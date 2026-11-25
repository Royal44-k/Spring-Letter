"""Package the tested local runtime and verify the actual extracted HTTP bytes."""
from pathlib import Path
from hashlib import sha256
from zipfile import ZipFile, ZIP_DEFLATED
from urllib.request import urlopen
import json, tempfile, subprocess, socket, time

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT/'evidence/release-manifest-v7.json').read_text(encoding='utf-8'))
entries = manifest['dist'] + manifest['runtimeFiles']
for e in entries:
    assert sha256((ROOT/e['file']).read_bytes()).hexdigest() == e['sha256'], e['file']
archive = ROOT/'releases/spring-letter-0.5.0-windows.zip'
archive.parent.mkdir(exist_ok=True)
intro = '''花漾年华：待寄出的春信 0.5.0 · 风起之时

解压完整文件夹，双击「启动春信.cmd」。需要本机已有 Node.js。
进入 http://127.0.0.1:5192/ 。请保持服务窗口打开，不要直接打开 dist/index.html。
所有游戏素材本地化，无需账号、付费接口或联网服务。

WASD / 方向键行走，Shift 踏风加速。放缓步伐恢复风力，接取花灵补充风力。
发光花巢旁 E 开始，带回足够花灵以后回巢 E 送回。也可以收齐全部，留下完整和声。
初庭：自由选择银灵/金灵路线。风廊：等游絮同行接银灵，踏风先接金灵。
终庭：银灵慢行，金色花冠打开时踏风。踏风可穿过回旋风，失误不损已接花灵。
近花：F 或轻触花心打散；按住拖动写风，花尘会漂游后自然归形。
渡桥：Space+拖动沿光迹织桥。终庭 E 拾起、安放和取回两枚种核，启程前可预览。
全屏按钮 / Alt+Enter 全屏；拖动环看、滚轮缩放、C 镜头回正。
触屏方向按钮行走，可同时按住踏风；近看双指拖动环看、张合缩放。
第一次点击走进花庭后开始播放配乐，设置中可分别调音乐、动作和环境声。

存档和最好成绩保存在当前浏览器；旧存档可继续。四幕、三庭追风、三支线、三探索庭。
这是独立浏览器可玩章节，非商业3A游戏。来源和许可见随包文件。
'''
with ZipFile(archive,'w',ZIP_DEFLATED,compresslevel=6) as z:
    for e in entries: z.write(ROOT/e['file'],'春信/'+e['file'])
    z.writestr('春信/开始游玩.txt',intro)
    z.writestr('春信/发行标识.json',json.dumps(manifest,ensure_ascii=False,indent=2))
with ZipFile(archive) as z:
    assert z.testzip() is None
    expected={'春信/'+e['file'] for e in entries}|{'春信/开始游玩.txt','春信/发行标识.json'}
    assert set(z.namelist())==expected and len(z.namelist())==len(expected)
with tempfile.TemporaryDirectory(prefix='.verify-v7-',dir=archive.parent) as temp:
    destination=Path(temp).resolve()
    assert destination.is_relative_to(archive.parent.resolve())
    with ZipFile(archive) as z:
        for n in z.namelist(): assert (destination/n).resolve().is_relative_to(destination)
        z.extractall(destination)
    game=destination/'春信'
    for e in entries: assert sha256((game/e['file']).read_bytes()).hexdigest()==e['sha256']
    with socket.socket() as s: s.bind(('127.0.0.1',0)); port=s.getsockname()[1]
    process=subprocess.Popen(['D:/NodeJS/node.exe',str(game/'scripts/serve.cjs'),'--port',str(port)],cwd=game,stdout=subprocess.PIPE,stderr=subprocess.PIPE,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    try:
        for _ in range(50):
            try:
                with urlopen(f'http://127.0.0.1:{port}/',timeout=2) as r: r.read()
                break
            except OSError: time.sleep(.1)
        verified=0
        for e in manifest['dist']:
            relative=e['file'][len('dist/'):]
            with urlopen(f'http://127.0.0.1:{port}/'+relative,timeout=10) as r:
                assert sha256(r.read()).hexdigest()==e['sha256'],relative
            verified+=1
    finally:
        process.terminate(); process.wait(timeout=10)
record={'passed':True,'file':str(archive.relative_to(ROOT)).replace('\\','/'),'sha256':sha256(archive.read_bytes()).hexdigest(),'bytes':archive.stat().st_size,'members':len(expected),'httpFilesVerified':verified,'build':manifest['build'],'styleBuild':manifest['styleBuild']}
(ROOT/'evidence/v7/package.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(record,ensure_ascii=False))
