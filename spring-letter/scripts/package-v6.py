"""Build a local runtime ZIP only from the verified 0.4 manifest."""
from pathlib import Path
from hashlib import sha256
from zipfile import ZipFile, ZIP_DEFLATED
import json

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'evidence/release-manifest-v6.json').read_text(encoding='utf-8'))
entries = manifest['dist'] + manifest['runtimeFiles']
actual = {p.relative_to(ROOT).as_posix() for p in (ROOT / 'dist').rglob('*') if p.is_file()}
assert actual == {p['file'] for p in manifest['dist']}, 'Runtime file set changed'
for entry in entries:
    assert sha256((ROOT / entry['file']).read_bytes()).hexdigest() == entry['sha256'], entry['file']
archive = ROOT / 'releases' / ('spring-letter-' + manifest['version'] + '-windows.zip')
archive.parent.mkdir(exist_ok=True)
intro = '''花漾年华：待寄出的春信 0.4.0 · 花随风行

解压整个文件夹，再双击「启动春信.cmd」。
需要本机已有 Node.js，启动器优先找 D:/NodeJS/node.exe，再找 PATH 中的 node。
访问 http://127.0.0.1:5192/，保持服务窗口开启。不要直接打开 dist/index.html。
素材全部本地化，游戏运行无需账号、付费接口或外部服务。

WASD / 方向键走路，镜头随方向缓缓跟随。拖动环看，滚轮缩放，C回正。
近花：轻触花心或 F 打散，按住拖动写风；花尘会慢慢归形。
主风廊和支风庭：按住牵引种子，到花杯后松手。
漫游时 Space+拖动 或 R 写风，沿悬光织桥。
终庭：靠近后点按 E 拿取、种下、取回；带着两枚种核写出两种未来，再到启程台确认。
触屏：方向按钮走路；近看时单指写风，双指拖动环看、张合缩放。
全屏按钮 / Alt+Enter 切换全屏；Esc 优先退出全屏。

进度和花型偏好保存在当前浏览器。手持种核会随存档恢复。
游戏包含四幕主路、三条物件支线、三座探索春庭和三种结局。
四花型与五材质可自由搭配；菜单含轻盈画质、静音和轻缓动态。
这是一份独立可玩章节。触控采用浏览器仿真验证，不能替代真实手机测试。
来源与许可证见 THIRD_PARTY_LICENSES.txt；精确发行文件散列见发行标识.json。
'''
with ZipFile(archive, 'w', ZIP_DEFLATED, compresslevel=6) as z:
    for entry in entries:
        z.write(ROOT / entry['file'], '春信/' + entry['file'])
    z.writestr('春信/开始游玩.txt', intro)
    z.writestr('春信/发行标识.json', json.dumps({k:manifest[k] for k in ('version','date','build','styleBuild','dist','runtimeFiles')},ensure_ascii=False,indent=2))
with ZipFile(archive) as z:
    expected = {'春信/' + e['file'] for e in entries} | {'春信/开始游玩.txt','春信/发行标识.json'}
    assert set(z.namelist()) == expected and len(z.namelist()) == len(expected)
    assert z.testzip() is None
record = {'file':archive.relative_to(ROOT).as_posix(),'bytes':archive.stat().st_size,'sha256':sha256(archive.read_bytes()).hexdigest(),'members':len(expected),'build':manifest['build'],'styleBuild':manifest['styleBuild'],'requiresLocalNode':True,'crcVerified':True}
(ROOT / 'evidence/v6-package-verification.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(record,ensure_ascii=False))
