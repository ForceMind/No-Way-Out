"""Drive actual campaign buttons and autosaves, including reload and manual-slot recovery."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import shutil
import subprocess
from threading import Thread
from playwright.sync_api import expect, sync_playwright

root=Path(__file__).resolve().parents[2]
routes=json.loads(subprocess.run(['node','--input-type=module','-e',"import {identities,storyData} from './js/data.js';import {walkCampaign} from './scripts/campaign-routes.mjs';console.log(JSON.stringify(identities.map((id,i)=>{const end=Object.values(storyData[id.id]).filter(n=>n.campaign&&!n.choices.length)[i%9];const run=walkCampaign(id.id,end.ending.kind);return {...id,kind:end.ending.kind,steps:run.steps,ending:run.state.currentNode};})));"],cwd=root,text=True,capture_output=True,check=True).stdout)
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
launch={'headless':True}
path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
if path:launch['executable_path']=path
proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('HTTP_PROXY')
if proxy:launch['proxy']={'server':proxy,'bypass':'127.0.0.1,localhost'}
errors=[]
with ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(root))) as server:
    thread=Thread(target=server.serve_forever,daemon=True);thread.start()
    base=f'http://127.0.0.1:{server.server_port}'
    try:
        with sync_playwright() as playwright:
            browser=playwright.chromium.launch(**launch)
            context=browser.new_context(viewport={'width':390,'height':900})
            context.set_default_timeout(15000)
            context.tracing.start(screenshots=True,snapshots=True,sources=True)
            page=context.new_page()
            page.on('pageerror',lambda error:errors.append(str(error)))
            page.on('dialog',lambda dialog:dialog.accept())
            page.add_init_script("localStorage.setItem('nw_preferences',JSON.stringify({speed:0,fontSize:20,reducedMotion:true}));localStorage.setItem('nw_volume',JSON.stringify({bgm:0,sfx:0}));")
            try:
                for route in routes:
                    page.goto(base,wait_until='networkidle')
                    expect(page.locator('#story-mode')).to_have_value('campaign')
                    page.locator('#start-btn').click()
                    page.locator('#identity-list').get_by_role('button',name=route['name'],exact=True).click()
                    page.locator('#confirm-identity').click()
                    assert page.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_auto')).state.campaign.decisions")==0
                    # Each batch dispatches the same production click handlers as a reader, checking every saved step.
                    for offset in range(0,208,40):
                        page.evaluate("""async steps=>{
                          const {storyData}=await import('./js/data.js');
                          const {describeNode}=await import('./js/core/narrative.js');
                          for(const step of steps){
                            const before=JSON.parse(localStorage.getItem('nw_save_v2_auto')).state;
                            if(before.currentNode!==step.nodeKey)throw Error('Wrong source scene');
                            const choice=storyData[before.currentIdentity][step.nodeKey].choices[step.choiceIndex];
                            const button=[...document.querySelectorAll('#choices-area button')].find(b=>b.textContent===choice.text);
                            if(!button||button.disabled)throw Error('Expected available action '+choice.text);
                            const rendered=document.querySelector('#dialogue-text').textContent;
                            button.click();
                            const after=JSON.parse(localStorage.getItem('nw_save_v2_auto')).state;
                            if(after.currentNode!==step.next||after.campaign.decisions!==before.campaign.decisions+1)throw Error('Wrong transition/count');
                            if(after.history.at(-1).nodeText!==rendered||after.history.at(-1).outcome!==choice.outcome)throw Error('History lost narrative');
                            if(document.querySelector('#dialogue-text').textContent!==describeNode(storyData[after.currentIdentity][after.currentNode],after))throw Error('Wrong conditional display');
                          }
                        }""",route['steps'][offset:offset+40])
                        if offset==80:
                            page.locator('#save-btn').click()
                            saved=page.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_manual-1')).state")
                            page.reload(wait_until='networkidle')
                            page.locator('#load-btn-title').click()
                            assert page.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_auto')).state")==saved
                            expect(page.locator('#survival-status')).to_contain_text('120 / 208')
                    final=page.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_auto')).state")
                    assert final['currentNode']==route['ending'] and final['campaign']['decisions']==208
                    assert len(final['history'])==208
                    expect(page.locator('#chapter-heading')).to_contain_text('经历 208 次选择')
                    expect(page.get_by_role('button',name='返回主菜单',exact=True)).to_be_visible()
                    page.locator('#history-btn').click()
                    expect(page.locator('#history-list section')).to_have_count(208)
                    expect(page.locator('#history-list')).to_contain_text('行动后果：')
                    page.locator('#close-history').click()
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                    print(f"PASS: {route['id']} / {route['kind']}: 208 actual browser choices, mid-game reload, narrative history and mobile width",flush=True)
                page.goto(base+'/editor.html',wait_until='networkidle')
                page.locator('#node-search').fill('campaign_citizen_start')
                page.locator('#node-list').get_by_text('campaign_citizen_start',exact=True).click()
                page.locator('#preview-btn').click()
                expect(page.locator('#preview-status')).to_contain_text('已选择 0 次')
                page.locator('#preview-choices button').first.click()
                expect(page.locator('#preview-status')).to_contain_text('已选择 1 次')
                page.locator('#preview-choices button').nth(1).click()
                expect(page.locator('#preview-status')).to_contain_text('已选择 2 次')
                assert not errors,errors
                context.tracing.stop();context.close()
            except Exception:
                results=root/'test-results';results.mkdir(exist_ok=True)
                (results/'campaign-errors.json').write_text(json.dumps(errors,ensure_ascii=False))
                page.screenshot(path=str(results/'campaign-failure.png'))
                context.tracing.stop(path=str(results/'campaign-trace.zip'))
                raise
            finally:browser.close()
    finally:server.shutdown();thread.join(timeout=5)
