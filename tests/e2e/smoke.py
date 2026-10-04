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
                page.on("dialog", lambda dialog: dialog.accept())

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
            saved = page.evaluate("JSON.parse(localStorage.getItem('nw_save'))")
            assert saved["state"]["currentIdentity"] == "citizen"
            assert saved["state"]["currentNode"] == "day1_night"
            assert saved["state"]["health"] == 90
            assert saved["state"]["sanity"] == 100
            assert saved["state"]["inventory"] == ["干粮"]
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
                editor.get_by_role("button", name="导出 JSON (需手动拆分)", exact=True).click()
            with tempfile.TemporaryDirectory(prefix="no-way-out-smoke-") as output_dir:
                export_path = Path(output_dir) / "storyData.json"
                download_event.value.save_as(export_path)
                exported = json.loads(export_path.read_text())
            assert len(exported) == 12
            assert exported["citizen"]["start"]["text"] == changed_text
            assert exported["citizen"]["start"]["choices"][-1] == {"text": "验证选项", "next": "home", "effect": {"health": -1}}
            print("PASS: editor loads stories, saves in memory and exports valid edited JSON", flush=True)

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
