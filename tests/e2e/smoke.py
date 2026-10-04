"""Exercise the static game and editor without changing repository files."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import shutil
from threading import Thread
import json
import os
from pathlib import Path
import tempfile
from urllib.parse import urlparse
from urllib.request import urlopen

from playwright.sync_api import expect, sync_playwright


def run_smoke(repository, base, browser_path):
    files = ["index.html", "editor.html", "css/style.css", "icon.png", "assets/audio/BGM.mp3"]
    files += [str(path.relative_to(repository)) for path in sorted((repository / "js").rglob("*.js"))]
    for name in files:
        with urlopen(f"{base}/{name}", timeout=10) as response:
            assert response.status == 200, name
            assert response.read() == (repository / name).read_bytes(), name
            if name.endswith(".js"):
                assert response.headers.get_content_type() in ("text/javascript", "application/javascript"), name
    print(f"PASS: HTTP contents for {len(files)} local resources", flush=True)

    page_errors = []
    console_errors = []
    failed_requests = []
    http_errors = []
    dialogs = []
    proxy_server = os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY")
    launch_options = {"headless": True}
    if browser_path:
        launch_options["executable_path"] = browser_path
    if proxy_server:
        launch_options["proxy"] = {"server": proxy_server, "bypass": "127.0.0.1,localhost"}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(**launch_options)
        try:
            context = browser.new_context(viewport={"width": 1440, "height": 1000}, accept_downloads=True)
            context.set_default_timeout(15000)

            def observe(page):
                page.on("pageerror", lambda error: page_errors.append(str(error)))
                page.on("requestfailed", lambda request: failed_requests.append({"url": request.url, "failure": request.failure}))
                page.on("response", lambda response: http_errors.append({"url": response.url, "status": response.status}) if response.status >= 400 else None)
                page.on("console", lambda message: console_errors.append({"text": message.text, "url": message.location.get("url", "")}) if message.type == "error" else None)
                page.on("dialog", lambda dialog: (dialogs.append(dialog.message), dialog.accept()))

            page = context.new_page()
            observe(page)
            console_messages = []
            page.on("console", lambda message: console_messages.append(message.text))
            response = page.goto(base, wait_until="networkidle")
            assert response.status == 200
            expect(page.locator("#title-screen")).to_be_visible()
            data = page.evaluate("async () => { const data = await import('./js/data.js'); return { identities: data.identities, stories: data.storyData }; }")
            assert len(data["identities"]) == 12
            assert len(data["stories"]) == 12
            for identity in data["identities"]:
                assert data["stories"][identity["id"]]["start"]["text"], identity["id"]
            print("PASS: browser loads all 12 identity/story modules", flush=True)

            for choice_text, target, item in [
                ("带上锄头防身", "farmer_tool", "锄头"),
                ("寻找食物", "farmer_food", None),
                ("去找家人", "farmer_family", None),
            ]:
                farmer = context.new_page()
                observe(farmer)
                farmer.goto(base, wait_until="networkidle")
                farmer.locator("#start-btn").click()
                farmer.locator("#identity-list").get_by_role("button", name="农夫", exact=True).click()
                farmer.locator("#confirm-identity").click()
                farmer.wait_for_function("!document.querySelector('#dialogue-text').classList.contains('cursor')")
                opening = farmer.locator("#choices-area").get_by_role("button", name=choice_text, exact=True)
                if item:
                    opening.evaluate("button => { button.click(); button.click(); }")
                else:
                    opening.click()
                expect(farmer.locator("#dialogue-text")).to_have_text(data["stories"]["farmer"][target]["text"])
                farmer.wait_for_function("!document.querySelector('#dialogue-text').classList.contains('cursor')")
                expect(farmer.locator("#inventory-display .item-tag")).to_have_count(1 if item else 0)
                if item:
                    expect(farmer.locator("#inventory-display")).to_have_text(item)
                farmer.locator("#save-btn").click()
                farmer_save = farmer.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_manual-1'))")
                assert len(farmer_save["state"]["history"]) == 1
                assert farmer_save["state"]["history"][0]["to"] == target
                farmer.close()
            print("PASS: all three farmer opening choices reach valid nodes with correct inventory", flush=True)

            def wait_node(key):
                expect(page.locator("#dialogue-text")).to_have_text(data["stories"]["citizen"][key]["text"])
                page.wait_for_function("!document.querySelector('#dialogue-text').classList.contains('cursor')")

            def choose(text, next_node):
                page.locator("#choices-area").get_by_role("button", name=text, exact=True).click()
                wait_node(next_node)

            page.locator("#start-btn").click()
            expect(page.locator("#identity-screen")).to_be_visible()
            expect(page.locator(".identity-btn")).to_have_count(12)
            page.locator("#identity-list").get_by_role("button", name="普通市民", exact=True).click()
            page.locator("#reselect-identity").click()
            assert page.locator(".identity-btn:visible").count() == 12
            page.locator("#identity-list").get_by_role("button", name="普通市民", exact=True).click()
            page.locator("#confirm-identity").click()
            wait_node("start")
            expect(page.locator("#choices-area button")).to_have_count(4)
            choose("去亲戚家", "relative1")
            choose("翻找食物", "relative_food")
            choose("拿走现有食物", "relative_leave")
            expect(page.locator("#inventory-display")).to_have_text("干粮")
            choose("寻找长期避难所", "survival_start")
            choose("开始第一天", "day1_morning")
            choose("外出寻找食物", "day1_search_food")
            choose("一无所获", "day1_noon")
            expect(page.locator("#health-display")).to_have_text("生命：95")
            choose("查看情况", "day1_event")
            choose("忍痛无视", "day1_night")
            expect(page.locator("#health-display")).to_have_text("生命：90")
            assert "BGM playing successfully" in console_messages, console_messages
            print("PASS: identity selection, story choices, inventory, health and BGM playback", flush=True)

            page.locator("#save-btn").click()
            saved = page.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_manual-1'))")
            assert saved["saveVersion"] == 2
            automatic = page.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_auto'))")
            assert automatic["state"] == saved["state"]
            assert saved["state"]["currentIdentity"] == "citizen"
            assert saved["state"]["currentNode"] == "day1_night"
            assert saved["state"]["health"] == 90
            assert saved["state"]["sanity"] == 100
            assert saved["state"]["inventory"] == ["干粮"]
            assert len(saved["state"]["history"]) == 9
            assert saved["state"]["history"][-1]["text"] == "忍痛无视"
            page.locator("#settings-btn-game").click()
            expect(page.locator("#settings-modal")).to_be_visible()
            page.locator("#bgm-volume").fill("0.2")
            page.locator("#sfx-volume").fill("0.3")
            page.locator("#close-settings").click()
            volume = page.evaluate("JSON.parse(localStorage.getItem('nw_volume'))")
            assert float(volume["bgm"]) == 0.2 and float(volume["sfx"]) == 0.3
            page.reload(wait_until="networkidle")
            expect(page.locator("#bgm-volume")).to_have_value("0.2")
            expect(page.locator("#sfx-volume")).to_have_value("0.3")
            page.locator("#load-btn-title").click()
            wait_node("day1_night")
            expect(page.locator("#health-display")).to_have_text("生命：90")
            expect(page.locator("#inventory-display")).to_have_text("干粮")
            choose("生火取暖", "day1_fire")
            choose("继续取暖", "ending_caught1")
            expect(page.locator("#choices-area button")).to_have_count(1)
            page.get_by_role("button", name="返回主菜单", exact=True).click()
            expect(page.locator("#title-screen")).to_be_visible()
            print("PASS: save/load across reload, persisted volume settings and ending/menu flow", flush=True)

            page.locator("#start-btn").click()
            page.locator("#identity-list").get_by_role("button", name="普通市民", exact=True).click()
            page.locator("#confirm-identity").click()
            wait_node("start")
            choose("去防空洞", "shelter")
            choose("继续待下去", "shelter_wait")
            expect(page.locator("#choices-area button")).to_have_count(1)
            expect(page.locator("#choices-area button")).to_have_text("无视")
            print("PASS: item-dependent choices stay hidden without required inventory", flush=True)

            editor = context.new_page()
            observe(editor)
            response = editor.goto(f"{base}/editor.html", wait_until="networkidle")
            assert response.status == 200
            expect(editor.locator(".identity-item")).to_have_count(12)
            editor.locator("#node-list").get_by_text("start", exact=True).click()
            original_text = data["stories"]["citizen"]["start"]["text"]
            expect(editor.locator("#node-text")).to_have_value(original_text)
            changed_text = original_text + "（云环境验证）"
            editor.locator("#node-text").fill(changed_text)
            editor.get_by_role("button", name="添加选项", exact=True).click()
            new_choice = editor.locator(".choice-item").last
            new_choice.locator(".choice-text").fill("验证选项")
            new_choice.locator(".choice-next").fill("home")
            new_choice.locator(".choice-effect").fill('{"health": -1}')
            editor.get_by_role("button", name="保存当前节点修改", exact=True).click()
            editor.locator("#node-list").get_by_text("home", exact=True).click()
            editor.locator("#node-list").get_by_text("start", exact=True).click()
            expect(editor.locator("#node-text")).to_have_value(changed_text)
            expect(editor.locator(".choice-item")).to_have_count(5)
            with editor.expect_download() as download_event:
                editor.get_by_role("button", name="导出 JSON (完整备份)", exact=True).click()
            with tempfile.TemporaryDirectory(prefix="no-way-out-smoke-") as output_dir:
                export_path = Path(output_dir) / "storyData.json"
                download_event.value.save_as(export_path)
                exported = json.loads(export_path.read_text())
            assert len(exported) == 12
            assert exported["citizen"]["start"]["text"] == changed_text
            assert exported["citizen"]["start"]["choices"][-1] == {"text": "验证选项", "next": "home", "effect": {"health": -1}}
            print("PASS: editor loads stories, saves in memory and exports valid edited JSON", flush=True)

            editor.locator("#node-list").get_by_text("shelter_wait", exact=True).click()
            quoted_text = '递水并说："慢点喝"，保留\'原文\''
            node_text = data["stories"]["citizen"]["shelter_wait"]["text"] + "（未保存的文字）"
            editor.locator("#node-text").fill(node_text)
            editor.locator(".choice-item").first.locator(".choice-text").fill(quoted_text)
            editor.locator(".choice-item").last.get_by_role("button", name="删除", exact=True).click()
            expect(editor.locator(".choice-item")).to_have_count(1)
            expect(editor.locator("#node-text")).to_have_value(node_text)
            expect(editor.locator(".choice-text")).to_have_value(quoted_text)
            editor.get_by_role("button", name="添加选项", exact=True).click()
            new_choice = editor.locator(".choice-item").last
            new_choice.locator(".choice-text").fill("离开")
            new_choice.locator(".choice-next").fill("street1")
            new_choice.locator(".choice-effect").fill('{"health": -1}')
            editor.get_by_role("button", name="保存当前节点修改", exact=True).click()

            def export_editor():
                with editor.expect_download() as event:
                    editor.get_by_role("button", name="导出 JSON (完整备份)", exact=True).click()
                with tempfile.TemporaryDirectory(prefix="no-way-out-editor-") as output_dir:
                    path = Path(output_dir) / "storyData.json"
                    event.value.save_as(path)
                    return json.loads(path.read_text())

            valid_export = export_editor()
            saved_node = valid_export["citizen"]["shelter_wait"]
            assert saved_node["text"] == node_text
            assert len(saved_node["choices"]) == 2
            assert saved_node["choices"][0]["text"] == quoted_text
            assert saved_node["choices"][0]["condition"] == {"hasItem": "水"}
            assert saved_node["choices"][1]["effect"] == {"health": -1}
            editor.locator(".choice-item").last.locator(".choice-effect").fill('{"health":')
            editor.get_by_role("button", name="保存当前节点修改", exact=True).click()
            expect(editor.locator("#editor-error")).to_be_visible()
            expect(editor.locator("#editor-error")).to_contain_text("JSON 不合法")
            assert export_editor() == valid_export
            editor.locator(".choice-item").last.locator(".choice-effect").fill('{"health": -1}')
            editor.get_by_role("button", name="保存当前节点修改", exact=True).click()
            editor.locator("#node-list").get_by_text("shelter", exact=True).click()
            editor.get_by_role("button", name="删除节点", exact=True).click()
            expect(editor.locator("#editor-error")).to_contain_text("不能删除")
            expect(editor.locator("#editor-error")).to_contain_text("start、relative_escape")
            assert export_editor() == valid_export
            print("PASS: editor deletion preserves drafts/conditions/quotes and invalid saves or referenced deletions leave data unchanged", flush=True)

            for key, raw, expected_message in [
                ("nw_volume", "{broken", None),
                ("nw_save", "{broken", "存档无法读取"),
                ("nw_save", json.dumps({"state": {"currentIdentity": "absent"}}), "存档内容无效"),
                ("nw_save_v2_manual-1", json.dumps({**saved, "saveVersion": 999}), "存档版本不兼容"),
                ("nw_save_v2_manual-1", json.dumps({**saved, "contentVersion": "future-content"}), "存档版本不兼容"),
            ]:
                isolated = browser.new_context()
                broken = isolated.new_page()
                observe(broken)
                broken.add_init_script(f"localStorage.setItem({json.dumps(key)}, {json.dumps(raw)});")
                broken.goto(base, wait_until="networkidle")
                expect(broken.locator("#title-screen")).to_be_visible()
                if expected_message:
                    broken.locator("#load-btn-title").click()
                    assert expected_message in dialogs[-1]
                    expect(broken.locator("#title-screen")).to_be_visible()
                else:
                    expect(broken.locator("#bgm-volume")).to_have_value("0.5")
                    expect(broken.locator("#sfx-volume")).to_have_value("0.5")
                assert broken.evaluate("key => localStorage.getItem(key)", key) == raw
                isolated.close()

            editor.locator("#node-list").get_by_text("shelter_wait", exact=True).click()
            editor.locator("#node-text").fill("切换时待处理的文字")
            editor.locator("#node-list").get_by_text("home", exact=True).click()
            expect(editor.locator("#unsaved-modal")).to_be_visible()
            editor.locator("#draft-cancel").click()
            expect(editor.locator("#node-text")).to_have_value("切换时待处理的文字")
            editor.locator("#node-list").get_by_text("home", exact=True).click()
            editor.locator("#draft-discard").click()
            expect(editor.locator("#node-key")).to_have_value("home")
            editor.locator("#node-list").get_by_text("shelter_wait", exact=True).click()
            editor.locator(".choice-condition").first.fill('{"hasItem":"水","minHealth":10}')
            editor.locator("#node-list").get_by_text("home", exact=True).click()
            editor.locator("#draft-save").click()
            expect(editor.locator("#node-key")).to_have_value("home")
            editor.locator("#undo-btn").click()
            assert export_editor()["citizen"]["shelter_wait"]["choices"][0]["condition"] == {"hasItem":"水"}
            editor.locator("#redo-btn").click()
            expected_data=export_editor()
            assert expected_data["citizen"]["shelter_wait"]["choices"][0]["condition"] == {"hasItem":"水","minHealth":10}
            editor.locator("#node-search").fill("shelter_wait")
            expect(editor.locator("#node-list .node-item")).to_have_count(1)
            editor.locator("#node-list").get_by_text("shelter_wait", exact=True).click()
            expect(editor.locator("#node-references")).to_contain_text("shelter")
            editor.locator("#preview-btn").click()
            expect(editor.locator("#preview-choices button").first).to_be_disabled()
            editor.locator("#preview-items").fill("水")
            editor.locator("#preview-restart").click()
            expect(editor.locator("#preview-choices button").first).to_be_enabled()
            editor.locator("#preview-choices button").first.click()
            expect(editor.locator("#preview-status")).to_contain_text(expected_data["citizen"]["shelter_wait"]["choices"][0]["next"])
            editor.locator("#preview-close").click()
            with editor.expect_download() as event:
                editor.locator("#export-identity").click()
            with tempfile.TemporaryDirectory() as output_dir:
                module_path=Path(output_dir)/"citizen.js"
                event.value.save_as(module_path)
                source=module_path.read_text()
                imported=editor.evaluate("async source=>{const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));try{return (await import(url)).citizenData;}finally{URL.revokeObjectURL(url);}}",source)
                assert imported == expected_data["citizen"]
            editor.locator("#import-file").set_input_files({"name":"backup.json","mimeType":"application/json","buffer":json.dumps(expected_data).encode()})
            expect(editor.locator("#edit-form")).not_to_be_visible()
            assert export_editor()==expected_data
            editor.locator("#import-file").set_input_files({"name":"bad.json","mimeType":"application/json","buffer":b'{"citizen":{"start":{"text":"bad","choices":[{"text":"go","next":"missing"}]}}}'})
            expect(editor.locator("#editor-error")).to_contain_text("missing")
            assert export_editor()==expected_data
            editor.locator("#node-search").fill("")
            editor.locator("#node-list").get_by_text("shelter_wait", exact=True).click()
            editor.locator("#node-text").fill("刷新后恢复的未提交文字")
            editor.locator(".choice-effect").last.fill("{broken")
            editor.wait_for_function("JSON.parse(localStorage.getItem('nw_editor_draft'))?.form?.inputs?.at(-1)?.effectText === '{broken'")
            editor.reload(wait_until="networkidle")
            expect(editor.locator("#node-text")).to_have_value("刷新后恢复的未提交文字")
            expect(editor.locator(".choice-effect").last).to_have_value("{broken")
            assert export_editor()==expected_data
            print("PASS: editor switch save/discard/cancel, conditions, undo/redo, search/references, isolated preview, JS/JSON round-trip and raw draft recovery",flush=True)

            isolated = browser.new_context()
            legacy_page = isolated.new_page()
            observe(legacy_page)
            legacy_raw = json.dumps({"state": saved["state"], "timestamp": 123})
            legacy_page.add_init_script(f"localStorage.setItem('nw_save', {json.dumps(legacy_raw)});")
            legacy_page.goto(base, wait_until="networkidle")
            legacy_page.locator("#load-btn-title").click()
            legacy_page.wait_for_function("!document.querySelector('#dialogue-text').classList.contains('cursor')")
            expect(legacy_page.locator("#health-display")).to_have_text("生命：90")
            migrated = legacy_page.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_manual-1'))")
            assert migrated["saveVersion"] == 2
            assert migrated["state"] == saved["state"]
            assert legacy_page.evaluate("localStorage.getItem('nw_save')") == legacy_raw
            isolated.close()
            print("PASS: legacy saves migrate without reapplying effects or overwriting the original record; future versions are rejected", flush=True)

            isolated = browser.new_context()
            full = isolated.new_page()
            observe(full)
            full.add_init_script("Storage.prototype.setItem = function() { throw new DOMException('Storage full', 'QuotaExceededError'); };")
            full.goto(base, wait_until="networkidle")
            full.locator("#start-btn").click()
            full.locator("#identity-list").get_by_role("button", name="普通市民", exact=True).click()
            full.locator("#confirm-identity").click()
            full.wait_for_function("!document.querySelector('#dialogue-text').classList.contains('cursor')")
            full.locator("#save-btn").click()
            assert "无法写入存档" in dialogs[-1]
            expect(full.locator("#game-container")).to_be_visible()
            isolated.close()
            print("PASS: corrupt saves/settings remain intact and quota failures do not report successful saves", flush=True)

            for width in [360, 390, 768, 1366]:
                reader_context = browser.new_context(viewport={"width":width,"height":800})
                reader = reader_context.new_page()
                observe(reader)
                reader.add_init_script("window.AudioContext=undefined; window.webkitAudioContext=undefined;")
                reader.goto(base, wait_until="networkidle")
                reader.locator("#settings-btn-title").click()
                reader.locator("#reading-speed").select_option("0")
                reader.locator("#reading-size").select_option("24")
                reader.locator("#reduced-motion").check()
                reader.keyboard.press("Escape")
                expect(reader.locator("#settings-modal")).not_to_be_visible()
                reader.locator("#start-btn").click()
                reader.locator("#identity-list").get_by_role("button", name="普通市民", exact=True).click()
                reader.locator("#confirm-identity").click()
                reader.locator("#choices-area").get_by_role("button",name="去亲戚家",exact=True).click()
                expect(reader.locator("#choices-area button")).to_have_count(len(data["stories"]["citizen"]["relative1"]["choices"]))
                reader.locator("#history-btn").click()
                expect(reader.locator("#history-list section")).to_have_count(1)
                expect(reader.locator("#history-list")).to_contain_text("你的选择：去亲戚家")
                reader.keyboard.press("Tab")
                assert reader.evaluate("document.activeElement.closest('dialog')?.id") == "history-modal"
                reader.keyboard.press("Escape")
                reader.locator("#saves-btn-game").click()
                expect(reader.locator(".save-slot")).to_have_count(4)
                reader.locator('[data-save-slot="manual-2"]').click()
                slot = reader.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_manual-2'))")
                assert slot["state"]["currentNode"] == "relative1"
                assert reader.evaluate("localStorage.getItem('nw_save_v2_manual-1')") is None
                reader.keyboard.press("Escape")
                assert reader.evaluate("document.documentElement.scrollWidth <= innerWidth"), width
                reader.evaluate("document.querySelector('#dialogue-text').textContent = '很长的文字。'.repeat(300)")
                last = reader.locator("#choices-area button").last
                last.scroll_into_view_if_needed()
                box = last.bounding_box()
                assert box["x"] >= 0 and box["x"]+box["width"] <= width+1, (width,box)
                reader.reload(wait_until="networkidle")
                expect(reader.locator("#continue-btn")).to_be_visible()
                reader.locator("#continue-btn").click()
                expect(reader.locator("#dialogue-text")).to_have_text(data["stories"]["citizen"]["relative1"]["text"])
                assert reader.evaluate("JSON.parse(localStorage.getItem('nw_save_v2_auto')).state.history.length") == 1
                expect(reader.locator("#reading-speed")).to_have_value("0")
                expect(reader.locator("#reading-size")).to_have_value("24")
                expect(reader.locator("body")).to_have_class("reduced-motion")
                reader_context.close()
            print("PASS: reading/history/independent slots/continue, keyboard dialogs, long text and four viewport widths without Web Audio", flush=True)

            skip_context = browser.new_context()
            skip_page = skip_context.new_page()
            observe(skip_page)
            skip_page.goto(base, wait_until="networkidle")
            skip_page.locator("#start-btn").click()
            skip_page.locator("#identity-list").get_by_role("button",name="普通市民",exact=True).click()
            skip_page.locator("#confirm-identity").click()
            skip_page.locator("#skip-text").click()
            expect(skip_page.locator("#choices-area button")).to_have_count(4)
            skip_page.locator("#choices-area").get_by_role("button",name="去亲戚家",exact=True).click()
            skip_page.locator("#dialogue-text").click()
            expect(skip_page.locator("#choices-area button")).to_have_count(len(data["stories"]["citizen"]["relative1"]["choices"]))
            skip_context.close()
            print("PASS: skipping text exposes each choice once", flush=True)

            assert not page_errors, page_errors
            font_hosts = ("fonts.googleapis.com", "fonts.gstatic.com")

            def is_optional(entry):
                url = urlparse(entry["url"])
                if url.hostname in font_hosts:
                    return True
                # editor.html has no icon declaration, so Chromium requests this
                # absent default icon. All other local HTTP errors still fail.
                return url.hostname == "127.0.0.1" and url.path == "/favicon.ico" and (entry.get("status") == 404 or "404" in entry.get("text", ""))

            required_request_failures = [entry for entry in failed_requests if not is_optional(entry)]
            assert not required_request_failures, required_request_failures
            required_http_errors = [entry for entry in http_errors if not is_optional(entry)]
            assert not required_http_errors, required_http_errors
            app_console_errors = [entry for entry in console_errors if not is_optional(entry)]
            assert not app_console_errors, app_console_errors
            print("PASS: no JavaScript exceptions or failures of required application resources", flush=True)
            if any(urlparse(entry["url"]).hostname in font_hosts for entry in failed_requests + http_errors):
                print("OPTIONAL: Google font requests unavailable under current network policy; system serif fallback used", flush=True)
            if any(urlparse(entry["url"]).path == "/favicon.ico" for entry in http_errors):
                print("OPTIONAL REPOSITORY ISSUE: editor default favicon.ico is absent (HTTP 404)", flush=True)
            context.close()
        except Exception:
            print("BROWSER ERRORS:", page_errors, console_errors, flush=True)
            raise
        finally:
            browser.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repository", type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument("--port", type=int, default=0)
    parser.add_argument("--browser-path", default=os.environ.get("CHROMIUM_PATH") or shutil.which("chromium"))
    args = parser.parse_args()

    class Handler(SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass

    with ThreadingHTTPServer(("127.0.0.1", args.port), partial(Handler, directory=str(args.repository))) as server:
        thread = Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            run_smoke(args.repository, f"http://127.0.0.1:{server.server_port}", args.browser_path)
        finally:
            server.shutdown()
            thread.join(timeout=5)


if __name__ == "__main__":
    main()
