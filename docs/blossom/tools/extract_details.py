from pathlib import Path
import sys, json
sys.path.insert(0,str(Path(__file__).parent/'python-deps'))
import av
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parents[1]
sources=[('blossom','ShiningBlossom.mp4',[0,72,130,255,300,550,615,625,658,700,825]),('particles','3D粒子效果.mp4',[0,133,196,220,420,560,640,725,1050,1238])]
records=[]
for name,filename,targets in sources:
    out=root/'video'/name/'detail';out.mkdir(exist_ok=True)
    with av.open(str(Path('C:/Users/lenovo/Videos/屏幕录制')/filename)) as c:
        for i,f in enumerate(c.decode(video=0)):
            if i in targets:
                im=f.to_image();im.save(out/f'frame-{i:04d}.jpg',quality=95)
                records.append({'source':name,'frame':i,'time':float(f.pts*f.time_base),'path':str(out/f'frame-{i:04d}.jpg')})
            if i>=max(targets):break
(root/'video'/'detail-index.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
