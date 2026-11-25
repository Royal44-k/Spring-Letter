"""Decode every reference frame with PyAV; analysis-only, no original file edits."""
from pathlib import Path
import sys, json, csv, hashlib
sys.path.insert(0, str(Path(__file__).parent / 'python-deps'))
import av
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
SOURCES=[('blossom',Path('C:/Users/lenovo/Videos/屏幕录制/ShiningBlossom.mp4')),('particles',Path('C:/Users/lenovo/Videos/屏幕录制/3D粒子效果.mp4'))]
FONT=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)

def sheet(frames, out, cols=4, cell_w=400):
    ratio=frames[0][1].height/frames[0][1].width
    cell_h=round(cell_w*ratio)+26
    canvas=Image.new('RGB',(cols*cell_w,((len(frames)+cols-1)//cols)*cell_h),'#10131b')
    draw=ImageDraw.Draw(canvas)
    for k,(label,im) in enumerate(frames):
        x=k%cols*cell_w;y=k//cols*cell_h
        canvas.paste(im.resize((cell_w,cell_h-26)),(x,y))
        draw.text((x+6,y+cell_h-23),label,font=FONT,fill='white')
    canvas.save(out,quality=87)

def analyze(name,source):
    out=ROOT/'video'/name;out.mkdir(parents=True,exist_ok=True)
    container=av.open(str(source));s=container.streams.video[0]
    meta={'source':str(source),'bytes':source.stat().st_size,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'codec':s.codec_context.name,'width':s.width,'height':s.height,'average_rate':str(s.average_rate),'time_base':str(s.time_base),'declared_frames':s.frames,'duration_seconds':float(s.duration*s.time_base) if s.duration else float(container.duration/av.time_base),'audio_streams':[{'codec':a.codec_context.name,'sample_rate':a.codec_context.sample_rate,'channels':a.codec_context.channels} for a in container.streams.audio]}
    print(name,json.dumps(meta),flush=True)
    rows=[];overview=[];atlas=[];overview_n=0;atlas_n=0;next_t=0;previous=None
    for i,frame in enumerate(container.decode(s)):
        t=float(frame.pts*frame.time_base)
        small=frame.reformat(width=160,height=max(1,round(160*s.height/s.width)),format='rgb24').to_ndarray().astype(np.float32)
        luma=small[:,:,0]*.2126+small[:,:,1]*.7152+small[:,:,2]*.0722
        bright=luma>180;yy,xx=np.where(bright)
        row={'frame':i,'pts':frame.pts,'time':t,'key_frame':int(frame.key_frame),'mean_change':0.0 if previous is None else float(np.abs(small-previous).mean()),'mean_luma':float(luma.mean()),'dark_fraction':float((luma<24).mean()),'bright_fraction':float(bright.mean()),'mean_r':float(small[:,:,0].mean()),'mean_g':float(small[:,:,1].mean()),'mean_b':float(small[:,:,2].mean()),'bright_cx':float(xx.mean()/small.shape[1]) if len(xx) else None,'bright_cy':float(yy.mean()/small.shape[0]) if len(yy) else None}
        rows.append(row);previous=small
        thumb=Image.fromarray(small.astype(np.uint8))
        atlas.append((f'{i} | {t:.3f}s',thumb))
        if len(atlas)==100:
            sheet(atlas,out/f'all-frames-{atlas_n:03d}.jpg',cols=10,cell_w=192);atlas=[];atlas_n+=1
        if t>=next_t:
            medium=frame.reformat(width=640,height=round(640*s.height/s.width),format='rgb24').to_image()
            overview.append((f'{i} | {t:.3f}s',medium));next_t+=.5
            if len(overview)==16:
                sheet(overview,out/f'overview-{overview_n:03d}.jpg');overview=[];overview_n+=1
        if i%500==0: print(name,'decoded',i,flush=True)
    if overview:sheet(overview,out/f'overview-{overview_n:03d}.jpg');overview_n+=1
    if atlas:sheet(atlas,out/f'all-frames-{atlas_n:03d}.jpg',cols=10,cell_w=192);atlas_n+=1
    container.close()
    with (out/'frame-metrics.csv').open('w',newline='',encoding='utf-8') as f:
        writer=csv.DictWriter(f,fieldnames=rows[0].keys());writer.writeheader();writer.writerows(rows)
    peaks=[]
    for row in sorted(rows,key=lambda r:r['mean_change'],reverse=True):
        if all(abs(row['time']-p['time'])>.5 for p in peaks):peaks.append(row)
        if len(peaks)==24:break
    summary={'metadata':meta,'decoded_frames':len(rows),'unique_pts':len(set(r['pts'] for r in rows)),'first_pts_seconds':rows[0]['time'],'last_pts_seconds':rows[-1]['time'],'pts_monotonic':all(rows[i]['time']>rows[i-1]['time'] for i in range(1,len(rows))),'mean_frame_interval':float(np.mean(np.diff([r['time'] for r in rows]))),'overview_interval_seconds':.5,'overview_sheets':overview_n,'all_frame_sheets':atlas_n,'metrics_resolution':[160,round(160*s.height/s.width)],'peak_changes':sorted(peaks,key=lambda r:r['time']),'method':'Every decoded video frame in display order using PyAV/FFmpeg; RGB metrics on reduced full frame. Full-frame atlases generated for every frame, overview at 0.5s; visual interpretation is a separate human/model review, not a claim that every full-resolution frame was inspected. No audio listening analysis.'}
    (out/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
    print('COMPLETE',name,len(rows),'frames',overview_n,'overview sheets',flush=True)

if __name__=='__main__':
    for name,source in SOURCES:analyze(name,source)
