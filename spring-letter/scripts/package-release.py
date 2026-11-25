"""Package the verified local runtime; no dependencies or research media copied."""
from pathlib import Path
from hashlib import sha256
from zipfile import ZipFile, ZIP_DEFLATED
import json

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'evidence/release-manifest-v5.json').read_text(encoding='utf-8'))
actual_dist = {file.relative_to(ROOT).as_posix() for file in (ROOT / 'dist').rglob('*') if file.is_file()}
if actual_dist != {entry['file'] for entry in manifest['dist']}:
    raise SystemExit('Release file set changed after verification')
runtime = manifest['runtimeFiles']
if {entry['file'] for entry in runtime} != {'scripts/serve.cjs', '启动春信.cmd', 'THIRD_PARTY_LICENSES.txt'}:
    raise SystemExit('Incomplete launcher verification')
for entry in manifest['dist'] + runtime:
    file = ROOT / entry['file']
    if sha256(file.read_bytes()).hexdigest() != entry['sha256']:
        raise SystemExit('Release changed after verification: ' + entry['file'])
out = ROOT / 'releases'
out.mkdir(exist_ok=True)
archive = out / ('spring-letter-' + manifest['version'] + '-windows.zip')
readme = '''花漾年华：待寄出的春信 0.3.0

解压整个文件夹，再双击「启动春信.cmd」。
这份包需要本机已有 Node.js；启动器先寻找 D:/NodeJS/node.exe，否则使用 PATH 中的 node。
在浏览器打开 http://127.0.0.1:5192/。保持服务窗口开启；关闭窗口即停止服务。
不要直接双击 dist/index.html。素材已本地化，游戏运行无需账号或外部生成服务。

默认拖动环看；WASD / 方向键行走；滚轮缩放。
Space + 拖动写风，R 切换风笔：慢慢提笔开花，快速挥动散尘，松手自然回流。
E 靠近细看；终庭长按拾起、安放、取回与寄出种核。
第二幕桌面无需按鼠标，从光后方轻推，到杯边移远指针。
触屏先开风笔后拖动，到杯边抬指；单指默认环看，双指缩放。
M 查看地图；Alt+Enter 全屏；Esc 优先退出全屏，之后离开近看/打开设置。

进度保存在当前浏览器。三座支庭可以绕路探索并回访；三种终章安排可以重选。
电影感与参考一致性仍有精修空间；这是独立可玩章节，没有宣称完整 3A 游戏。
触屏经过浏览器仿真，尚非多台真实手机的设备验证。
免费素材作者与许可证见 THIRD_PARTY_LICENSES.txt，详细元数据随 dist/assets 保存。
'''
files = [ROOT / entry['file'] for entry in manifest['dist'] + runtime]
with ZipFile(archive, 'w', compression=ZIP_DEFLATED, compresslevel=6) as z:
    for file in sorted(files):
        if file.is_file():
            z.write(file, '春信/' + file.relative_to(ROOT).as_posix())
    z.writestr('春信/开始游玩.txt', readme)
    z.writestr('春信/发行标识.json', json.dumps({k: manifest[k] for k in ('version', 'date', 'build', 'dist', 'runtimeFiles')}, ensure_ascii=False, indent=2))
with ZipFile(archive) as z:
    expected_members = {'春信/' + file.relative_to(ROOT).as_posix() for file in files} | {'春信/开始游玩.txt', '春信/发行标识.json'}
    if set(z.namelist()) != expected_members or len(z.namelist()) != len(expected_members):
        raise SystemExit('Unexpected or duplicate zip member')
    bad = z.testzip()
    if bad:
        raise SystemExit('Invalid zip member: ' + bad)
    count = len(z.infolist())
record = {'file': archive.relative_to(ROOT).as_posix(), 'bytes': archive.stat().st_size,
          'sha256': sha256(archive.read_bytes()).hexdigest(), 'members': count,
          'build': manifest['build'], 'requiresLocalNode': True, 'crcVerified': True}
(ROOT / 'evidence/v5-package-verification.json').write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(record, ensure_ascii=False))
