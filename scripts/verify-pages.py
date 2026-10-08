"""Verify the actual Pages publication, including commit identity and every asset hash."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import time
from urllib.parse import quote
from urllib.request import urlopen
from urllib.error import HTTPError

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('url')
parser.add_argument('--commit',required=True)
args=parser.parse_args()
base=args.url.rstrip('/')

def fetch(path):
    # Avoid a stale CDN response while a new deployment is propagating.
    url=f'{base}/{quote(path,safe="/")}?deployment={quote(args.commit,safe="")}'
    try:
        with urlopen(url,timeout=25) as response:
            return response.read(),response.headers.get_content_type()
    except HTTPError as error:
        raise RuntimeError(f'{path}: HTTP {error.code}') from error

def verify():
    identity=json.loads(fetch('deployment.json')[0])
    if identity.get('commit')!=args.commit:
        raise ValueError(f"Pages commit {identity.get('commit')} differs from {args.commit}")
    manifest=json.loads(fetch('release.json')[0])
    if not isinstance(manifest.get('files'),dict) or not manifest['files']:
        raise ValueError('Release manifest is missing files')
    required={'index.html','editor.html','js/data.js','js/game.js','js/content-manifest.js','css/style.css'}
    if not required.issubset(manifest['files']):
        raise ValueError('Release manifest is missing an entry point or game module')
    def check(entry):
        name,expected=entry
        body,mime=fetch(name)
        if len(body)!=expected['bytes'] or hashlib.sha256(body).hexdigest()!=expected['sha256']:
            raise ValueError(f'Published contents differ: {name}')
        if name.endswith('.js') and mime not in ('text/javascript','application/javascript'):
            raise ValueError(f'Incorrect JavaScript MIME: {name}')
        if name.endswith('.html') and mime!='text/html':
            raise ValueError(f'Incorrect HTML MIME: {name}')
    with ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(check,manifest['files'].items()))
    print(f"PASS: Pages serves commit {args.commit}, content {manifest['contentVersion']}, and all {len(manifest['files'])} exact release files",flush=True)

for attempt in range(12):
    try:
        verify()
        break
    except Exception as error:
        if attempt==11:
            # A public Actions annotation preserves the concrete cause even when logs require login.
            message=str(error).replace('%','%25').replace('\r','%0D').replace('\n','%0A')
            print(f'::error title=Published site verification::{message}',flush=True)
            raise
        print(f'Waiting for Pages propagation ({attempt+1}/12): {error}',flush=True)
        time.sleep(5)
