"""Extract our release safely and serve it with the bundled launcher script."""
from pathlib import Path
from hashlib import sha256
from zipfile import ZipFile
import json
import os
import shutil
import socket
import subprocess
import tempfile
import time
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
release_root = (ROOT / 'releases').resolve()
record_path = ROOT / 'evidence/v5-package-verification.json'
record = json.loads(record_path.read_text(encoding='utf-8'))
archive = ROOT / record['file']
if sha256(archive.read_bytes()).hexdigest() != record['sha256']:
    raise SystemExit('Package changed after CRC verification')
node = Path('D:/NodeJS/node.exe')
if not node.is_file():
    node = shutil.which('node')
if not node:
    raise SystemExit('Local Node.js is required to verify the delivered runtime')

with tempfile.TemporaryDirectory(prefix='.verify-spring-', dir=release_root) as temporary:
    destination = Path(temporary).resolve()
    # Both extraction and the context manager's eventual cleanup stay in releases.
    if not destination.is_relative_to(release_root):
        raise SystemExit('Unexpected temporary extraction location')
    with ZipFile(archive) as z:
        for name in z.namelist():
            if not (destination / name).resolve().is_relative_to(destination):
                raise SystemExit('Unsafe archive member: ' + name)
        z.extractall(destination)
    game = destination / '春信'
    manifest = json.loads((game / '发行标识.json').read_text(encoding='utf-8'))
    expected_members = {'春信/' + entry['file'] for entry in manifest['dist'] + manifest['runtimeFiles']} | {'春信/开始游玩.txt', '春信/发行标识.json'}
    with ZipFile(archive) as z:
        if set(z.namelist()) != expected_members or len(z.namelist()) != len(expected_members):
            raise RuntimeError('Unexpected or duplicate package member')
    for entry in manifest['runtimeFiles']:
        if sha256((game / entry['file']).read_bytes()).hexdigest() != entry['sha256']:
            raise RuntimeError('Packaged launcher differs: ' + entry['file'])
    with socket.socket() as probe:
        probe.bind(('127.0.0.1', 0))
        port = probe.getsockname()[1]
    log_path = destination / 'server.log'
    with log_path.open('w', encoding='utf-8') as log:
        process = subprocess.Popen(
            [str(node), 'scripts/serve.cjs', '--port', str(port)], cwd=game,
            stdout=log, stderr=subprocess.STDOUT,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0)
        try:
            url = f'http://127.0.0.1:{port}'
            for attempt in range(50):
                if process.poll() is not None:
                    raise RuntimeError('Packaged server stopped: ' + log_path.read_text(encoding='utf-8'))
                try:
                    with urlopen(url, timeout=1) as response:
                        response.read()
                    break
                except OSError:
                    time.sleep(.1)
            else:
                raise RuntimeError('Packaged server did not become ready')
            verified = []
            for entry in manifest['dist']:
                relative = entry['file'].removeprefix('dist/')
                with urlopen(url + '/' + relative, timeout=3) as response:
                    payload = response.read()
                if sha256(payload).hexdigest() != entry['sha256']:
                    raise RuntimeError('Extracted HTTP asset differs: ' + relative)
                verified.append(relative)
            record['extractedRuntime'] = {
                'passed': True, 'filesVerified': len(verified), 'runtimeFilesVerified': len(manifest['runtimeFiles']), 'exactMemberSet': True,
                'build': manifest['build'],
                'scope': 'Actual extracted scripts/serve.cjs launched with local Node.js from a temporary Unicode path. Every dist response matches the package manifest. No browser UI or batch-window interaction is implied.'}
        finally:
            # This is only the child started above, never an existing user service.
            if process.poll() is None:
                process.terminate()
                process.wait(timeout=5)

record_path.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(record['extractedRuntime'], ensure_ascii=False))
