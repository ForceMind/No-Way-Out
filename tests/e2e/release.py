"""Verify the generated static package at root and project subpaths."""
from functools import partial
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import re
import os
from pathlib import Path
import shutil
from threading import Thread
from urllib.parse import urlparse
from urllib.request import urlopen
from playwright.sync_api import expect, sync_playwright

root=Path(__file__).resolve().parents[2]
release=root/"dist/no-way-out"
manifest=json.loads((release/"release.json").read_text())
failures=[]
metrics=[]
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,format,*args): pass
launch={"headless":True}
browser_path=os.environ.get("CHROMIUM_PATH") or shutil.which("chromium")
if browser_path: launch["executable_path"]=browser_path
proxy=os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY")
if proxy: launch["proxy"]={"server":proxy,"bypass":"127.0.0.1,localhost"}
with sync_playwright() as playwright:
    browser=playwright.chromium.launch(**launch)
    try:
        for directory,prefix in [(release,""),(release.parent,"/no-way-out")]:
            with ThreadingHTTPServer(("127.0.0.1",0),partial(Handler,directory=str(directory))) as server:
                thread=Thread(target=server.serve_forever,daemon=True);thread.start()
                try:
                    base=f"http://127.0.0.1:{server.server_port}{prefix}"
                    for name,expected in manifest["files"].items():
                        with urlopen(f"{base}/{name}",timeout=10) as response:
                            actual=response.read()
                            assert len(actual)==expected["bytes"] and hashlib.sha256(actual).hexdigest()==expected["sha256"],name
                            if name.endswith(".js"): assert response.headers.get_content_type() in ["text/javascript","application/javascript"],name
                    context=browser.new_context(viewport={"width":390 if prefix else 1366,"height":900})
                    context.tracing.start(screenshots=True,snapshots=True,sources=True)
                    page=context.new_page()
                    page.on("pageerror",lambda error:failures.append(str(error)))
                    page.on("requestfailed",lambda request:failures.append(request.url) if urlparse(request.url).hostname not in ["fonts.googleapis.com","fonts.gstatic.com"] else None)
                    page.on("response",lambda response:failures.append(response.url) if response.status>=400 and urlparse(response.url).hostname not in ["fonts.googleapis.com","fonts.gstatic.com"] else None)
                    page.add_init_script("localStorage.setItem('nw_preferences',JSON.stringify({speed:0,fontSize:20,reducedMotion:true}));localStorage.setItem('nw_volume',JSON.stringify({bgm:0,sfx:0}));")
                    page.goto(base+"/",wait_until="networkidle")
                    expect(page.locator("#title-screen")).to_be_visible()
                    data=page.evaluate("async ()=>{const {identities,storyData}=await import('./js/data.js');return {identities:identities.length,starts:Object.values(storyData).every(nodes=>nodes.start.text && nodes.start.choices.length)};}")
                    assert data=={"identities":12,"starts":True}
                    measurement=page.evaluate("({dcl:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,paint:performance.getEntriesByType('paint').map(entry=>({name:entry.name,ms:entry.startTime})),localBytes:performance.getEntriesByType('resource').filter(entry=>new URL(entry.name).origin===location.origin).reduce((sum,entry)=>sum+entry.transferSize,0),resources:performance.getEntriesByType('resource').length})")
                    metrics.append({"path":"project" if prefix else "root",**measurement})
                    expect(page.locator("#story-mode")).to_have_count(0)
                    expect(page.locator("#title-screen")).not_to_contain_text(re.compile("208|旧版|剧情模式"))
                    page.locator("#start-btn").click()
                    page.locator("#identity-list").get_by_role("button",name="普通市民",exact=True).click()
                    page.locator("#confirm-identity").click()
                    page.locator("#choices-area button").first.click()
                    page.locator("#choices-area button").nth(1).click()
                    expect(page.locator("#survival-status")).to_contain_text("物资：")
                    assert page.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_auto')).state.campaign.decisions")==2
                    page.reload(wait_until="networkidle")
                    page.locator("#continue-btn").click()
                    expect(page.locator("#survival-status")).to_contain_text("物资：")
                    assert page.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_auto')).state.campaign.decisions")==2
                    page.goto(base+"/editor.html",wait_until="networkidle")
                    expect(page.locator(".identity-item")).to_have_count(12)
                    page.locator("#node-list").get_by_text("start",exact=True).click()
                    expect(page.locator("#node-text")).not_to_have_value("")
                    assert page.evaluate("document.documentElement.scrollWidth<=innerWidth")
                    context.tracing.stop()
                    context.close()
                    print(f"PASS: {prefix or '/'} static hashes, JS MIME, 12 modules, unified game start/resume and editor",flush=True)
                finally:
                    server.shutdown();thread.join(timeout=5)
        assert not failures,failures
    except Exception:
        results=root/"test-results";results.mkdir(exist_ok=True)
        (results/"release-errors.json").write_text(json.dumps(failures,indent=2))
        for number,active_context in enumerate(browser.contexts):
            for page_number,active_page in enumerate(active_context.pages):
                try: active_page.screenshot(path=str(results/f"release-failure-{number}-{page_number}.png"),timeout=3000)
                except Exception: pass
            try: active_context.tracing.stop(path=str(results/f"release-trace-{number}.zip"))
            except Exception: pass
        raise
    finally: browser.close()
results=root/"test-results";results.mkdir(exist_ok=True)
(results/"release-metrics.json").write_text(json.dumps(metrics,indent=2)+"\n")
print("Local baseline (not real-device/network performance):",json.dumps(metrics),flush=True)
