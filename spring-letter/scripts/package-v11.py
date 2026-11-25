"""Package the exact verified 0.8.0 release; CRC, extract and HTTP-check its bytes.

This script is intentionally separate from building or publishing. It consumes
evidence/release-manifest-v11.json after the final serial verification has passed.
"""
from pathlib import Path
from hashlib import sha256
from zipfile import ZipFile, ZIP_DEFLATED
from urllib.request import urlopen
from urllib.parse import quote
import json
import tempfile
import subprocess
import socket
import time
import sys

ROOT = Path(__file__).resolve().parents[1]
VERSION = '0.8.0'
manifest = json.loads((ROOT / 'evidence/release-manifest-v11.json').read_text(encoding='utf-8'))
assert manifest['version'] == VERSION, 'release manifest must identify the verified 0.8.0 build'
entries = manifest['dist'] + manifest['runtimeFiles']
assert len({entry['file'] for entry in entries}) == len(entries), 'duplicate manifest path'
for entry in entries:
    source = (ROOT / entry['file']).resolve()
    assert source.is_relative_to(ROOT), entry['file']
    assert sha256(source.read_bytes()).hexdigest() == entry['sha256'], entry['file']
for entry in manifest['dist']:
    assert entry['file'].startswith('dist/'), entry['file']

release = ROOT / 'releases'
release.mkdir(exist_ok=True)
intro = '''花漾年华：待寄出的春信 0.8.0 · 潮汐与远航

解压完整文件夹后双击「启动春信.cmd」。需要本机已有 Node.js。
打开 http://127.0.0.1:5192/ ，保持服务窗口运行，不要直接打开 dist/index.html。
全部场景、声音与素材位于本地，无账号、内购、付费接口或在线服务。

一个情境序章、九段主要旅程，以及两封信随船驶向曙光的终章。
花光暗房叠影；纸翼渡风操纵飞行；回声织信创作八拍；风笔编桥；安排两处春天。
随后写收信人与正文，封好自己的信，趁退潮收起岑的旧信，上岛寻找船。
WASD行走、拖动环看、C回正，E靠近互动。1/2解缆，按住Space升帆。
出海后A/D掌舵，Q/E调帆，F撒花种，Space缓行；触屏有相应按钮与滑条。
B打开信袋，Esc合上阅读或暂停。全屏按钮或Alt+Enter可进入全屏。
到曙光前亲自选择启程；结束页可下载自己的信与岑的旧信TXT、拍照、看海或重访花庭。

旧存档选择“续写春信”，已完成旧版结局的旅程可直接开始海岸篇。
设置中的旅途存档可导出JSON备份；存档属于当前浏览器与网址。
来源与许可见ASSET_SOURCES.md和THIRD_PARTY_LICENSES.txt；操作细节见README.md。
测试证据与边界见FINAL_QA.md。这是独立浏览器可玩章节，未宣称商业验证或AAA制作水准。
'''
web_intro = '''将 ZIP 内文件完整放到支持静态 HTTP/HTTPS 的目录，index.html 位于根部。
支持根网址或子目录，素材均为相对路径；不要使用 file:// 直接双击。
不需要 Node 运行时（Node 只用于项目开发和 Windows 本地启动器）。
不需要 API 密钥、账号或后端。此包不包含自动发布、支付或数据上传服务。
浏览器须支持 WebGL2/WebAudio，首次点击后允许播放声音。
存档按网站 origin 隔离，更换网址前可在“设置→旅途存档”导出 JSON。
来信册可下载花光、纸翼、春声的个人作品 SVG；照片和明信片也在本机生成。
发行标识和全部受验文件哈希见 BUILD.json。发布前请测试实际目标设备和平台。
'''


def available_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


def verify_http(command, cwd, port, required):
    """Verify every requested relative file through a real local HTTP server."""
    process = subprocess.Popen(command, cwd=cwd, stdout=subprocess.DEVNULL,
                               stderr=subprocess.DEVNULL,
                               creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    try:
        for _ in range(80):
            if process.poll() is not None:
                raise RuntimeError('packaged HTTP server exited before becoming ready')
            try:
                with urlopen(f'http://127.0.0.1:{port}/', timeout=2) as response:
                    response.read()
                break
            except OSError:
                time.sleep(.1)
        else:
            raise RuntimeError('packaged HTTP server did not become ready')
        for relative, expected in required.items():
            with urlopen(f'http://127.0.0.1:{port}/' + quote(relative), timeout=10) as response:
                assert sha256(response.read()).hexdigest() == expected, relative
        return len(required)
    finally:
        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=10)


packages = []
for kind in ['windows', 'browser']:
    archive = release / f'spring-letter-{VERSION}-{kind}.zip'
    with ZipFile(archive, 'w', ZIP_DEFLATED, compresslevel=6) as zipped:
        if kind == 'windows':
            for entry in entries:
                zipped.write(ROOT / entry['file'], '春信/' + entry['file'])
            zipped.writestr('春信/开始游玩.txt', intro)
            zipped.writestr('春信/发行标识.json', json.dumps(manifest, ensure_ascii=False, indent=2))
        else:
            for entry in manifest['dist']:
                zipped.write(ROOT / entry['file'], entry['file'][5:])
            zipped.writestr('README-WEB.txt', web_intro)
            zipped.writestr('BUILD.json', json.dumps(manifest, ensure_ascii=False, indent=2))
    with ZipFile(archive) as zipped:
        assert zipped.testzip() is None, 'ZIP CRC failure'
        names = zipped.namelist()
        assert len(names) == len(set(names)), 'duplicate ZIP member'
        assert len(names) == len({name.casefold() for name in names}), 'case-insensitive ZIP collision'
        member_hashes = {name: sha256(zipped.read(name)).hexdigest() for name in names}
    with tempfile.TemporaryDirectory(prefix='.verify-v11-', dir=release) as temp:
        destination = Path(temp).resolve()
        assert destination.is_relative_to(release.resolve())
        with ZipFile(archive) as zipped:
            for name in zipped.namelist():
                assert (destination / name).resolve().is_relative_to(destination), name
            zipped.extractall(destination)
        for name, expected in member_hashes.items():
            assert sha256((destination / name).read_bytes()).hexdigest() == expected, name
        game = destination / '春信' if kind == 'windows' else destination
        served = game / 'dist' if kind == 'windows' else game
        dist_hashes = {entry['file'][5:]: entry['sha256'] for entry in manifest['dist']}
        for relative, expected in dist_hashes.items():
            assert sha256((served / relative).read_bytes()).hexdigest() == expected, relative
        if kind == 'windows':
            for entry in manifest['runtimeFiles']:
                assert sha256((game / entry['file']).read_bytes()).hexdigest() == entry['sha256'], entry['file']
            port = available_port()
            command = ['D:/NodeJS/node.exe', str(game / 'scripts/serve.cjs'), '--port', str(port)]
            dist_verified = verify_http(command, game, port, dist_hashes)
        else:
            dist_verified = len(dist_hashes)
        # Also serve the complete extracted package. This checks the generated
        # instructions/build record and Windows runtime files, not just dist.
        all_hashes = {name.removeprefix('春信/') if kind == 'windows' else name: expected
                      for name, expected in member_hashes.items()}
        port = available_port()
        command = [sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1', '--directory', str(game)]
        all_verified = verify_http(command, game, port, all_hashes)
        assert all_verified == len(names)
    packages.append({'kind': kind, 'file': archive.relative_to(ROOT).as_posix(),
                     'bytes': archive.stat().st_size,
                     'sha256': sha256(archive.read_bytes()).hexdigest(),
                     'members': len(names), 'httpFilesVerified': dist_verified,
                     'httpPackageFilesVerified': all_verified, 'crcPassed': True})

record = {'passed': True, 'version': VERSION, 'build': manifest['build'], 'packages': packages}
(ROOT / 'evidence/v11').mkdir(parents=True, exist_ok=True)
(ROOT / 'evidence/v11/package.json').write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(record, ensure_ascii=False, indent=2))
