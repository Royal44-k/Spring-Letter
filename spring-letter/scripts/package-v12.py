"""Package a promoted, freshly reverified 0.9.0 release. Never builds or publishes.

--verify-only reads hashes and invokes the read-only Node release guard; it does
not create archives, start servers, open a browser or write evidence.
Normal execution requires evidence/release-manifest-v12.json and produces two
immutable ZIPs only after CRC, extraction and localhost HTTP byte verification.
"""
from pathlib import Path, PurePosixPath
from hashlib import sha256
from zipfile import ZipFile, ZIP_DEFLATED
from urllib.request import urlopen
from urllib.parse import quote
import json
import os
import re
import shutil
import socket
import stat
import subprocess
import sys
import tempfile
import time
import uuid

ROOT = Path(__file__).resolve().parents[1]
VERSION = '0.9.0'
REQUIRED_RUNTIME = {'scripts/serve.cjs', '启动春信.cmd', 'THIRD_PARTY_LICENSES.txt',
                    'ASSET_SOURCES.md', 'README.md', 'FINAL_QA.md'}
INTRO = '''花漾年华：待寄出的春信 0.9.0 · 雨林、星台与云海

完整解压后双击「启动春信.cmd」。需要本机已有 Node.js。
打开 http://127.0.0.1:5192/ ，保持服务窗口运行，不要直接打开 dist/index.html。
场景、声音与素材均在本地，无账号、内购、付费接口或在线游戏服务。

一个情境序章、十二个主要环节，以及两封信随船驶向曙光的终章：
花光暗房叠影、纸翼渡风、回声织信、风笔编桥、安排两处春天；
穿行雨幕温室，引蝶为三丛兰花授粉；走上沉星天文台，在三维星空描出信封；
用角色花伞逐岛滑翔，穿过云海花甸；亲笔写信、退潮收旧信、备舟、远航。
扉页「展开远方地图」可以进入三个独立地点，各自进度分别保存。

WASD 行走，拖动环看，C 回正，E 靠近互动。三图中 Space 招蝶或起跳展开花伞。
观星要先走到石台，再按 E；点触星点，或用 1–6，Z 撤回。触屏有方向及长按按钮。
海岸 1/2 解缆，按住 Space 升帆；航行 A/D 掌舵，Q/E 调帆，F 撒花种。
B 打开信袋，Esc 合上阅读或暂停；全屏按钮或 Alt+Enter 切换全屏。
抵达曙光前亲自选择启程，结束页可保存两封信 TXT、拍照、看海或重访花庭。

已有旅途选择「续写春信」。0.8 海岸进度和信件保留，三图不会自动标记完成。
设置→旅途存档可导出 JSON 备份；存档属于当前浏览器和网址。
操作详见 README.md；许可见 ASSET_SOURCES.md 和 THIRD_PARTY_LICENSES.txt。
新增布景使用程序制作，声音复用已有免费 CC0 采样，无新增外部素材下载。
证据和限制见 FINAL_QA.md；自动信号测试不等于人工试听，触屏仿真不等于实体手机。
'''
WEB_INTRO = '''花漾年华：待寄出的春信 0.9.0 · 静态浏览器包

将 ZIP 内容完整放到静态 HTTP/HTTPS 目录，index.html 位于根部。
支持根网址或子目录，资源使用相对路径。不要通过 file:// 直接双击页面。
浏览器包不需要 Node.js、API 密钥、账号或后端，未包含自动发布或数据上传服务。
浏览器须支持 WebGL2 和 WebAudio，首次点击进入后播放声音。

十二个主要环节，包括可真实行走的雨幕温室、沉星天文台和云海花甸。
新增引蝶授粉、三维描星、角色花伞滑翔；两封信继续随船抵达曙光。
扉页「展开远方地图」可独立游览，各地进度分别保存。
存档按网站 origin 隔离，换网址前可在设置→旅途存档导出 JSON。
照片、作品 SVG 和两封信 TXT 均在本机生成。
素材许可随包保留，发行标识和受验文件哈希见 BUILD.json。
桌面 Edge 和触屏仿真验收的限制见 BUILD.json；请另验实际目标设备。
'''


def require(condition, message):
    if not condition:
        raise ValueError(message)


def safe_member(name):
    require(isinstance(name, str) and bool(name), 'missing relative member')
    require(not name.startswith('/') and '\\' not in name and ':' not in name,
            'absolute or platform-dependent member: ' + name)
    require(all(part not in ('', '.', '..') for part in name.split('/')),
            'traversal or ambiguous member: ' + name)
    return name


def safe_file(base, name):
    safe_member(name)
    base = base.resolve()
    candidate = base / name
    current = base
    for part in PurePosixPath(name).parts:
        current = current / part
        require(not current.is_symlink(), 'symlink in package source: ' + name)
    resolved = candidate.resolve()
    require(resolved.is_relative_to(base) and resolved != base, 'escaped package root')
    return resolved


def digest_file(file):
    return sha256(file.read_bytes()).hexdigest()


def check_row(row):
    safe_member(row.get('file'))
    require(re.fullmatch(r'[a-f0-9]{64}', row.get('sha256', '')) is not None,
            'SHA-256 missing for ' + row['file'])
    require(type(row.get('bytes')) is int and row['bytes'] >= 0,
            'invalid size for ' + row['file'])


def validate_manifest(manifest):
    require(manifest.get('version') == VERSION, 'release version must be 0.9.0')
    require(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', manifest.get('candidate', '')) is not None,
            'invalid immutable candidate label')
    require(re.fullmatch(r'\./assets/[^/\\]+\.js', manifest.get('build', '')) is not None,
            'release must name its exact relative module entry')
    require(isinstance(manifest.get('dist'), list) and manifest['dist'], 'no release dist files')
    require(isinstance(manifest.get('runtimeFiles'), list), 'no runtime inventory')
    entries = manifest['dist'] + manifest['runtimeFiles']
    for row in entries:
        check_row(row)
    names = [row['file'] for row in entries]
    require(len(names) == len({name.casefold() for name in names}), 'case-colliding package paths')
    require({row['file'] for row in manifest['runtimeFiles']} == REQUIRED_RUNTIME,
            'runtime/notice inventory differs')
    require(all(row['file'].startswith('dist/') for row in manifest['dist']), 'dist path prefix missing')
    dist = {row['file']: row for row in manifest['dist']}
    require('dist/index.html' in dist, 'entry HTML absent')
    require('dist/ASSET_SOURCES.md' in dist and 'dist/THIRD_PARTY_LICENSES.txt' in dist,
            'public source or license notice missing')
    entry_path = 'dist/' + manifest['build'][2:]
    require(entry_path in dist and dist[entry_path]['sha256'] == manifest.get('entrySha256'),
            'published module hash differs')
    require(manifest.get('evidence', {}).get('candidate') == manifest['candidate'], 'proof candidate differs')
    require(manifest['evidence'].get('entry') == manifest['build'], 'proof entry differs')
    require(manifest['evidence'].get('entrySha256') == manifest['entrySha256'], 'proof bytes differ')
    evidence = manifest.get('evidenceHashes', {})
    require({'build', 'proof', 'cpu', 'full', 'layout', 'audio', 'stress'}.issubset(evidence),
            'required evidence hashes missing')
    for row in evidence.values():
        require(safe_member(row.get('file')).startswith('evidence/'), 'evidence path outside evidence')
        require(re.fullmatch(r'[a-f0-9]{64}', row.get('sha256', '')) is not None, 'invalid evidence hash')
    checks = manifest.get('checks', {})
    for key, value in {'primaryActions': 12, 'newMaps': 3, 'layouts': 9, 'audioScenes': 3,
                       'sceneQualityCases': 9, 'mapContextRecovery': 3, 'mapCycles': 3}.items():
        require(checks.get(key) == value, 'release coverage missing: ' + key)
    require(type(checks.get('units')) is int and checks['units'] > 0, 'actual CPU total missing')
    return entries


def node_executable():
    configured = Path('D:/NodeJS/node.exe')
    node = str(configured) if configured.is_file() else shutil.which('node')
    require(bool(node), 'Node.js is needed to recheck release evidence and the Windows launcher')
    return node


def verify_release():
    file = ROOT / 'evidence/release-manifest-v12.json'
    raw = file.read_bytes()
    manifest = json.loads(raw)
    entries = validate_manifest(manifest)
    result = subprocess.run([node_executable(), str(ROOT / 'scripts/release-v12.cjs'), '--verify-only'],
                            cwd=ROOT, capture_output=True, text=True, check=True,
                            creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    verified = json.loads(result.stdout)
    require(verified.get('verified') is True and verified.get('promotionExecuted') is False,
            'read-only release guard did not pass')
    for key, actual in [('candidate', manifest['candidate']), ('entry', manifest['build']),
                        ('entrySha256', manifest['entrySha256']), ('units', manifest['checks']['units'])]:
        require(verified.get(key) == actual, 'promoted release differs from current evidence: ' + key)
    for row in entries:
        source = safe_file(ROOT, row['file'])
        require(source.is_file() and source.stat().st_size == row['bytes'], 'file size changed: ' + row['file'])
        require(digest_file(source) == row['sha256'], 'file hash changed: ' + row['file'])
    for row in manifest['evidenceHashes'].values():
        require(digest_file(safe_file(ROOT, row['file'])) == row['sha256'], 'evidence changed: ' + row['file'])
    require(file.read_bytes() == raw, 'release manifest changed during verification')
    return manifest, entries, sha256(raw).hexdigest()


def available_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


def verify_http(command, cwd, port, required):
    process = subprocess.Popen(command, cwd=cwd, stdout=subprocess.DEVNULL,
                               stderr=subprocess.DEVNULL,
                               creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    try:
        for _ in range(80):
            require(process.poll() is None, 'packaged HTTP server exited before becoming ready')
            try:
                with urlopen(f'http://127.0.0.1:{port}/', timeout=2) as response:
                    response.read()
                break
            except OSError:
                time.sleep(.1)
        else:
            raise RuntimeError('packaged HTTP server did not become ready')
        for relative, expected in required.items():
            safe_member(relative)
            with urlopen(f'http://127.0.0.1:{port}/' + quote(relative), timeout=10) as response:
                require(response.status == 200 and sha256(response.read()).hexdigest() == expected,
                        'HTTP bytes differ: ' + relative)
        return len(required)
    finally:
        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=10)


def check_archive(archive, kind, release, manifest):
    with ZipFile(archive) as zipped:
        require(zipped.testzip() is None, 'ZIP CRC failure')
        names = zipped.namelist()
        require(len(names) == len({name.casefold() for name in names}), 'case-colliding ZIP members')
        for member in zipped.infolist():
            safe_member(member.filename)
            require(not member.is_dir() and not stat.S_ISLNK(member.external_attr >> 16), 'unexpected ZIP link/directory')
        member_hashes = {name: sha256(zipped.read(name)).hexdigest() for name in names}
    with tempfile.TemporaryDirectory(prefix='.verify-v12-', dir=release) as temp:
        destination = Path(temp).resolve()
        require(destination.is_relative_to(release.resolve()), 'temporary extraction escaped releases')
        with ZipFile(archive) as zipped:
            for name in names:
                safe_file(destination, name)
            zipped.extractall(destination)
        for name, expected in member_hashes.items():
            require(digest_file(safe_file(destination, name)) == expected, 'extraction hash differs: ' + name)
        game = destination / '春信' if kind == 'windows' else destination
        served = game / 'dist' if kind == 'windows' else game
        dist_hashes = {row['file'][5:]: row['sha256'] for row in manifest['dist']}
        for relative, expected in dist_hashes.items():
            require(digest_file(safe_file(served, relative)) == expected, 'packaged runtime differs: ' + relative)
        if kind == 'windows':
            port = available_port()
            dist_http = verify_http([node_executable(), str(game / 'scripts/serve.cjs'), '--port', str(port)],
                                    game, port, dist_hashes)
        else:
            port = available_port()
            dist_http = verify_http([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1',
                                     '--directory', str(game)], game, port, dist_hashes)
        all_hashes = {name.removeprefix('春信/') if kind == 'windows' else name: expected
                      for name, expected in member_hashes.items()}
        port = available_port()
        all_http = verify_http([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1',
                                '--directory', str(game)], game, port, all_hashes)
        # For the browser archive, also verify every original asset beneath a
        # genuine URL prefix while the extracted package remains unchanged.
        nested_http = 0
        if kind == 'browser':
            port = available_port()
            prefix = destination.name + '/'
            nested_http = verify_http([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1',
                                       '--directory', str(destination.parent)], destination.parent, port,
                                      {prefix + name: expected for name, expected in all_hashes.items()})
        require(all_http == len(names), 'not every archive member was HTTP checked')
    return {'members': len(names), 'memberHashes': member_hashes, 'httpFilesVerified': dist_http,
            'httpPackageFilesVerified': all_http, 'httpSubdirectoryFilesVerified': nested_http,
            'crcPassed': True, 'extractionHashesPassed': True}


def main():
    require(set(sys.argv[1:]).issubset({'--verify-only'}), 'only --verify-only is supported')
    manifest, entries, manifest_hash = verify_release()
    if '--verify-only' in sys.argv:
        print(json.dumps({'verified': True, 'version': VERSION, 'candidate': manifest['candidate'],
                          'entry': manifest['build'], 'entrySha256': manifest['entrySha256'],
                          'packageCreated': False, 'filesystemWrites': 0}))
        return
    release = ROOT / 'releases'
    require(not release.is_symlink(), 'releases directory must not be a symlink')
    require(release.resolve().is_relative_to(ROOT), 'releases escaped project')
    destinations = {kind: release / f'spring-letter-{VERSION}-{kind}.zip' for kind in ['windows', 'browser']}
    for file in destinations.values():
        require(not file.exists(), 'immutable package already exists: ' + str(file))
    record_file = ROOT / 'evidence/v12/package.json'
    require(not record_file.exists(), 'immutable package verification record already exists')
    release.mkdir(exist_ok=True)
    packages, pending = [], []
    for kind, destination in destinations.items():
        archive = release / (destination.name + '.' + uuid.uuid4().hex + '.partial')
        with ZipFile(archive, 'x', ZIP_DEFLATED, compresslevel=6) as zipped:
            for row in entries if kind == 'windows' else manifest['dist']:
                content = safe_file(ROOT, row['file']).read_bytes()
                require(len(content) == row['bytes'] and sha256(content).hexdigest() == row['sha256'],
                        'source changed during ZIP creation: ' + row['file'])
                name = '春信/' + row['file'] if kind == 'windows' else row['file'][5:]
                zipped.writestr(safe_member(name), content)
            zipped.writestr('春信/开始游玩.txt' if kind == 'windows' else 'README-WEB.txt', INTRO if kind == 'windows' else WEB_INTRO)
            zipped.writestr('春信/发行标识.json' if kind == 'windows' else 'BUILD.json', json.dumps(manifest, ensure_ascii=False, indent=2))
        checks = check_archive(archive, kind, release, manifest)
        packages.append({'kind': kind, 'file': destination.relative_to(ROOT).as_posix(),
                         'bytes': archive.stat().st_size, 'sha256': digest_file(archive), **checks})
        pending.append((archive, destination))
    # Re-read all source/proof hashes before assigning final immutable names.
    _, _, final_manifest_hash = verify_release()
    require(final_manifest_hash == manifest_hash, 'release changed while packaging')
    for archive, destination in pending:
        require(not destination.exists(), 'another package acquired the final name')
        os.rename(archive, destination)
    record = {'passed': True, 'version': VERSION, 'candidate': manifest['candidate'],
              'build': manifest['build'], 'entrySha256': manifest['entrySha256'],
              'releaseManifestSha256': manifest_hash, 'packages': packages,
              'browserLaunched': False, 'gpuExecuted': False}
    with record_file.open('x', encoding='utf-8') as stream:
        stream.write(json.dumps(record, ensure_ascii=False, indent=2))
    print(json.dumps(record, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
