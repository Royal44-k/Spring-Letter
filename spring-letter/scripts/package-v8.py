"""Package only the exact verified release bytes, then serve both extracted ZIPs."""
from pathlib import Path
from hashlib import sha256
from zipfile import ZipFile, ZIP_DEFLATED
from urllib.request import urlopen
from urllib.parse import quote
import json, tempfile, subprocess, socket, time, sys

ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'evidence/release-manifest-v8.json').read_text(encoding='utf-8'))
entries=manifest['dist']+manifest['runtimeFiles']
for e in entries:assert sha256((ROOT/e['file']).read_bytes()).hexdigest()==e['sha256'],e['file']
release=ROOT/'releases';release.mkdir(exist_ok=True)
intro='''花漾年华：待寄出的春信 0.6.0 · 来信之庭

解压完整文件夹后双击「启动春信.cmd」。需要本机已有 Node.js。
进入 http://127.0.0.1:5192/ ，保持服务窗口打开，不要直接打开 dist/index.html。
全部素材本地化，无账号、付费接口、在线游戏服务。

WASD行走、Shift踏风、拖动环看、C回正，全屏按钮或Alt+Enter进入全屏。
左岸听雨春庭有第一封旧来信。靠近信台E读信，点叶脉石转动，接通后选择照料对象。
三庭依次练习分流、避漏和双源汇合；方向键选石、Enter转动、Z撤销、H一点提示。
触屏使用方向按钮与“转石/回信”页签。源花可碰触/F化尘，随后自然归形。
三封信后回旧台，Space+拖动沿光迹织桥。终庭E拾起、安放两枚种核，寄出前可预览。
三庭追风、风笔与旧物支线可自由体验；不需要完成所有活动才能寄信。

设置中可分别调配乐、音效和环境声。浏览器首次点击后才允许播放声音。
存档只属于当前浏览器/网址；设置→旅途存档可导出JSON、预览导入、恢复备份。
临时模式关闭或刷新会丢失，请先导出。“留一帧春光”可制作个人春信明信片。
这是独立浏览器可玩章节；商业用户与付费意愿仍需真实试玩验证。来源见随包文件。
本包包含游戏、启动器、来源许可和验收摘要；原始测试截图与研究档案保存在制作工作区。
'''
web_intro='''将ZIP内文件完整放到支持静态HTTP/HTTPS的目录，index.html位于根部。
支持根网址或子目录，素材均为相对路径；不要使用file://直接双击。
不需要Node运行时（Node只用于项目开发与桌面本地启动器）。不需要API密钥、账号或后端。
浏览器须支持WebGL2/WebAudio。首次点击后播放声音。存档按网站origin隔离；更换网址前可导出JSON。
本包没有自动发布、支付或数据收集服务。发布前由持有者自行测试目标设备和平台。
'''
packages=[]
for kind in ['windows','browser']:
 archive=release/f'spring-letter-0.6.0-{kind}.zip'
 with ZipFile(archive,'w',ZIP_DEFLATED,compresslevel=6) as z:
  if kind=='windows':
   for e in entries:z.write(ROOT/e['file'],'春信/'+e['file'])
   z.writestr('春信/开始游玩.txt',intro)
   z.writestr('春信/发行标识.json',json.dumps(manifest,ensure_ascii=False,indent=2))
  else:
   for e in manifest['dist']:z.write(ROOT/e['file'],e['file'][5:])
   z.writestr('README-WEB.txt',web_intro)
   z.writestr('BUILD.json',json.dumps(manifest,ensure_ascii=False,indent=2))
 with ZipFile(archive) as z:
  assert z.testzip() is None
  names=z.namelist();assert len(names)==len(set(names))
 with tempfile.TemporaryDirectory(prefix='.verify-v8-',dir=release) as temp:
  destination=Path(temp).resolve();assert destination.is_relative_to(release.resolve())
  with ZipFile(archive) as z:
   for n in z.namelist():assert (destination/n).resolve().is_relative_to(destination)
   z.extractall(destination)
  game=destination/'春信' if kind=='windows' else destination
  served=game/'dist' if kind=='windows' else game
  for e in manifest['dist']:assert sha256((served/e['file'][5:]).read_bytes()).hexdigest()==e['sha256']
  if kind=='windows':
   for e in manifest['runtimeFiles']:assert sha256((game/e['file']).read_bytes()).hexdigest()==e['sha256']
  with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
  command=['D:/NodeJS/node.exe',str(game/'scripts/serve.cjs'),'--port',str(port)] if kind=='windows' else [sys.executable,'-m','http.server',str(port),'--bind','127.0.0.1','--directory',str(served)]
  process=subprocess.Popen(command,cwd=game,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
  try:
   for _ in range(80):
    try:
     with urlopen(f'http://127.0.0.1:{port}/',timeout=2) as r:r.read()
     break
    except OSError:time.sleep(.1)
   verified=0
   for e in manifest['dist']:
    with urlopen(f'http://127.0.0.1:{port}/'+quote(e['file'][5:]),timeout=10) as r:assert sha256(r.read()).hexdigest()==e['sha256'],e['file']
    verified+=1
  finally:process.terminate();process.wait(timeout=10)
 packages.append({'kind':kind,'file':archive.relative_to(ROOT).as_posix(),'bytes':archive.stat().st_size,'sha256':sha256(archive.read_bytes()).hexdigest(),'members':len(names),'httpFilesVerified':verified})
record={'passed':True,'version':'0.6.0','build':manifest['build'],'packages':packages}
(ROOT/'evidence/v8/package.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(record,ensure_ascii=False,indent=2))
