"""Local edit of the live browser captures. No generated frames enter the film."""
import bisect
import json
import sys
from dataclasses import dataclass
from fractions import Fraction
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

WORK = Path(__file__).resolve().parent
ROOT = WORK.parents[1]
sys.path.insert(0, str(ROOT / 'docs/blossom/tools/python-deps'))
import av

RAW = WORK / 'rushes'
OUT = WORK.parent / '首发物料'
SIZE = (1080, 1440)
FPS, SR = 30, 48000
W, H = SIZE
IVORY, INK = '#fff5e8', '#203a39'
OUT.mkdir(exist_ok=True)


@dataclass(frozen=True)
class Clip:
    source: str
    first: float
    count: int
    caption: str


EDL = [
    Clip('flower', .28, 105, '轻轻一碰，花就散了。'),
    Clip('flower', 10.77, 108, '松手以后，它又开回来。'),
    Clip('palette', .47, 126, '让重莲开成青釉色。'),
    Clip('observatory', .32, 183, '用星星，连一只信封。'),
    Clip('meadow', .24, 126, '撑开花伞，去下一座岛。'),
    Clip('writing', .20, 156, ''),
    Clip('sea', .30, 246, '两封信，一起出海。'),
]


@lru_cache(maxsize=40)
def font(size, weight=540, serif=True):
    family = 'NotoSerifSC-VF.ttf' if serif else 'NotoSansSC-VF.ttf'
    result = ImageFont.truetype(str(Path('C:/Windows/Fonts') / family), size)
    result.set_variation_by_axes([weight])
    return result


def lettering(draw, xy, words, size, *, fill=IVORY, weight=550, serif=True):
    draw.text(xy, words, font=font(size, weight, serif), fill=fill, anchor='lt')


def fade(layer, where, rgb, peak, depth):
    # Transparent feather behind type. The centre of each shot keeps the game colour.
    height = layer.height
    distance = np.arange(height) / depth
    v = np.clip(1-distance, 0, 1)
    a = np.uint8(peak * v*v*(3-2*v))
    if where == 'bottom':
        a = a[::-1].copy()
    tint = Image.new('RGBA', layer.size, rgb)
    tint.putalpha(Image.fromarray(a[:, None]).resize(layer.size))
    return Image.alpha_composite(layer, tint)


def empty():
    return Image.new('RGBA', SIZE, (0, 0, 0, 0))


class Frames:
    def __init__(self, source):
        self.src = source
        self.log = json.loads((RAW/(source+'.json')).read_text(encoding='utf-8'))
        self.container = None
        if source in ('flower', 'writing'):
            self.directory = RAW/(source+'-frames')
            rows = json.loads((self.directory/'frames.json').read_text())
            start = self.log['captureEpoch'] + self.log['record']['t']/1000
            self.files = [r['file'] for r in rows]
            self.times = [r['t']-start for r in rows]
        else:
            self.container = av.open(str(RAW/(source+'.webm')))
            self.container.streams.video[0].thread_type = 'AUTO'
            self.frames = iter(self.container.decode(video=0))
            self.current = next(self.frames)
            self.upcoming = next(self.frames, None)

    def image(self, t):
        if self.container is None:
            i = max(0, bisect.bisect_right(self.times, t+.001)-1)
            with Image.open(self.directory/self.files[i]) as frame:
                return frame.convert('RGB')
        while self.upcoming is not None and self.upcoming.time <= t+.001:
            self.current = self.upcoming
            self.upcoming = next(self.frames, None)
        return self.current.to_image()

    def close(self):
        if self.container:
            self.container.close()


def compose_frame(im, source, seconds):
    if source == 'flower':
        # The player controls are outside this crop of the real desktop recording.
        box = (284, 0, 1022, 984)
    elif source == 'palette':
        box = (286, 45, 1078, 1101)
    elif source == 'writing':
        # Follow the actual in-game letter from salutation to the pressed seal.
        progress = min(1, max(0, (seconds-2.95)/1.1))
        progress = progress*progress*(3-2*progress)
        top = int(115+87*progress)
        box = (499, top, 955, top+608)
    else:
        box = (0, 0, im.width, im.height)
    return im.resize(SIZE, Image.Resampling.LANCZOS, box=box)


@lru_cache(maxsize=12)
def titles(index, end=False):
    layer = empty()
    clip = EDL[index]
    if index == 5:
        return layer
    if index in (0, 1):
        layer = fade(layer,'top',(22,27,56),143,345)
        d = ImageDraw.Draw(layer)
        if index == 0:
            lettering(d,(84,97),'花漾年华  /  游戏实录',32,weight=500,serif=False)
            lettering(d,(81,155),clip.caption,74,weight=630)
        else:
            lettering(d,(81,134),clip.caption,68,weight=600)
    elif index in (2,4):
        layer = fade(layer,'top',(248,243,225),230,365)
        d = ImageDraw.Draw(layer)
        lettering(d,(86,101),'花庭' if index==2 else '云海花甸',32,fill=INK,weight=560,serif=False)
        lettering(d,(82,158),clip.caption,65,fill=INK,weight=660)
    elif index == 3:
        layer = fade(layer,'bottom',(11,19,34),170,350)
        d = ImageDraw.Draw(layer)
        lettering(d,(86,1184),'沉星天文台',32,weight=500,serif=False)
        lettering(d,(81,1242),clip.caption,68,weight=600)
    elif index == 6:
        layer = fade(layer,'top',(255,243,221),218,445)
        d = ImageDraw.Draw(layer)
        if end:
            lettering(d,(78,115),'花漾年华',110,fill=INK,weight=650)
            lettering(d,(86,260),'待寄出的春信',48,fill=INK,weight=520)
        else:
            lettering(d,(84,133),clip.caption,69,fill=INK,weight=640)
    return layer


def apply_titles(im, i, sec):
    if i == 5:
        return im
    end = i==6 and sec>=4.96
    if i == 0:
        opacity = 1
    elif i == 6 and 4.64 < sec < 5.19:
        opacity = max(0, min(1, ((4.94-sec) if not end else (sec-4.96))/.2))
    else:
        opacity = min(1, max(0, sec/.16))
    l = titles(i,end)
    if opacity >= 1:
        im.paste(l,(0,0),l)
    elif opacity > 0:
        im.paste(l,(0,0),l.getchannel('A').point(lambda a:int(a*opacity)))
    return im


def grab(src, second):
    frames = Frames(src)
    try:
        return frames.image(second)
    finally:
        frames.close()


def stills():
    # The cover is a title treatment on one actual recorded game frame.
    original = grab('flower', 1.73)
    hero = compose_frame(original,'flower',1.73)
    cover_layer = fade(empty(),'bottom',(16,27,43),250,900)
    d = ImageDraw.Draw(cover_layer)
    lettering(d,(86,108),'花漾年华  /  游戏实录',37,weight=540,serif=False)
    lettering(d,(78,965),'这朵花',122,weight=740)
    lettering(d,(77,1118),'可以碰碎',141,weight=740)
    lettering(d,(88,1310),'待寄出的春信',39,weight=540)
    hero.paste(cover_layer,(0,0),cover_layer)
    hero.save(OUT/'02-实机视频封面.jpg',quality=96,subsampling=0)

    print_sheet = Image.new('RGB',SIZE,'#f3efe3')
    label = ImageDraw.Draw(print_sheet)
    lettering(label,(74,98),'待寄出的春信  /  实机画面',33,fill='#48605b',serif=False)
    lettering(label,(68,179),'花庭与远海',90,fill='#203a39',weight=650)
    left = compose_frame(grab('flower',.7),'flower',.7)
    right = grab('sea',.32)
    for im, x, center, caption in ((left,72,(.51,.51),'月下的花庭'),(right,550,(.47,.53),'带信的船')):
        photo = ImageOps.fit(im,(458,835),Image.Resampling.LANCZOS,centering=center)
        print_sheet.paste(photo,(x,330))
        lettering(label,(x,1210),caption,47,fill=INK,weight=620)
    print_sheet.save(OUT/'05-花庭与远海-实机对照.jpg',quality=95,subsampling=0)

    pitch = Image.new('RGB',SIZE,'#f4f0e6')
    d = ImageDraw.Draw(pitch)
    lettering(d,(74,92),'自主创作案例  /  交互设计',34,fill='#526761',weight=540,serif=False)
    lettering(d,(66,163),'让一朵花回应手势',88,fill=INK,weight=680)
    lettering(d,(75,292),'《花漾年华：待寄出的春信》浏览器游戏',37,fill=INK)
    for time,x,label in ((.7,72,'碰触花心'),(3.6,550,'拖动花尘')):
        take=grab('flower',time)
        take=take.resize((458,435),Image.Resampling.LANCZOS,box=(337,180,1018,827))
        pitch.paste(take,(x,398))
        lettering(d,(x,859),label,38,fill=INK,weight=610)
    d.line((73,953,1007,953),fill='#a6b2a4',width=2)
    for y,name,body in [
        (1020,'创作主导','确定叙事和玩法，试玩并调整节奏。'),
        (1112,'开发方式','用 AI 辅助搭建场景、实现花尘散聚。'),
        (1230,'可谈合作','品牌互动网页、数字展陈的可玩样片。')]:
        lettering(d,(75,y),name,34,fill='#795354',weight=640,serif=False)
        lettering(d,(288,y-2),body,40,fill=INK,weight=520)
    pitch.save(OUT/'09-互动开发合作案例卡.jpg',quality=95,subsampling=0)

    previews = Image.new('RGB',(1080,650),'#292d30')
    d = ImageDraw.Draw(previews)
    picks = [(0,.25),(0,2.05),(1,2.8),(2,3.52),(3,4.65),(4,1.6),(5,1.8),(5,4.6),(6,1.5),(6,7)]
    for k,(i,sec) in enumerate(picks):
        cl=EDL[i]
        frame=compose_frame(grab(cl.source,cl.first+sec),cl.source,cl.first+sec)
        frame=apply_titles(frame,i,sec)
        frame.thumbnail((206,275))
        x=k%5*216;y=k//5*325
        previews.paste(frame,(x,y))
        d.text((x+3,y+281),f'{cl.source} {sec:.2f}s',fill='white')
    previews.save(WORK/'edit-board.jpg',quality=94)


def capture_audio(source):
    arrays, offsets = [], []
    with av.open(str(RAW/(source+'.webm'))) as stream:
        resampler = av.AudioResampler(format='fltp',layout='stereo',rate=SR)
        for decoded in stream.decode(audio=0):
            for frame in resampler.resample(decoded):
                arrays.append(frame.to_ndarray())
                offsets.append(round(float(frame.time)*SR))
    last = max(off+arr.shape[1] for off,arr in zip(offsets,arrays))
    out = np.zeros((2,last),np.float32)
    for start,arr in zip(offsets,arrays):
        offset = max(0,-start)
        out[:,max(0,start):start+arr.shape[1]] = arr[:,offset:]
    return out


def cut_sound():
    length = sum(c.count for c in EDL)*SR//FPS
    soundtrack = np.zeros((2,length),np.float32)
    decoded, stats, cursor = {},[],0
    for i,clip in enumerate(EDL):
        if clip.source not in decoded:
            decoded[clip.source] = capture_audio(clip.source)
        source = decoded[clip.source]
        start = round(clip.first*SR)
        n = clip.count*SR//FPS
        tail = round(.14*SR) if i<len(EDL)-1 else 0
        segment = source[:,start:start+n+tail].copy()
        if segment.shape[1]<n+tail:
            segment=np.pad(segment,((0,0),(0,n+tail-segment.shape[1])))
        rms = np.sqrt(np.mean(segment[:,:n]**2))
        gain = min(.091/max(.001,rms),8.1,.85/max(.001,np.max(np.abs(segment))))
        segment *= gain
        attack = round((.065 if i==0 else .14)*SR)
        segment[:,:attack] *= np.linspace(0,1,attack,dtype=np.float32)
        fadeout = tail if tail else round(.90*SR)
        segment[:,-fadeout:] *= np.linspace(1,0,fadeout,dtype=np.float32)
        soundtrack[:,cursor:cursor+segment.shape[1]] += segment
        stats.append({'scene':clip.source,'input_rms':float(rms),'gain_db':float(20*np.log10(gain))})
        cursor+=n
    peak = float(np.max(np.abs(soundtrack)))
    if peak>.87:
        soundtrack *= .87/peak
    return soundtrack,stats


def render():
    audio, levels = cut_sound()
    timeline = []
    target = OUT/'01-春信-真实游玩宣传片.mp4'
    temp = WORK/'spring-letter-cut.mp4'
    with av.open(str(temp),mode='w',options={'movflags':'+faststart'}) as output:
        output.metadata.update({'title':'花漾年华：待寄出的春信','comment':'0.9.1 实机游玩剪辑，游戏原声。'})
        v=output.add_stream('libx264',rate=FPS)
        v.width,v.height=SIZE
        v.pix_fmt='yuv420p'
        v.options={'crf':'18','preset':'fast','profile':'high','g':'60'}
        v.codec_context.thread_count=5
        v.codec_context.colorspace=1
        v.codec_context.color_primaries=1
        v.codec_context.color_trc=1
        v.codec_context.color_range=1
        a=output.add_stream('aac',rate=SR)
        a.layout='stereo';a.bit_rate=192000
        vpos=apos=0
        for i,cl in enumerate(EDL):
            fr=Frames(cl.source)
            timeline.append({'file':cl.source,'in':cl.first,'start_frame':vpos,'frames':cl.count,'caption':cl.caption})
            try:
                for f in range(cl.count):
                    s=cl.first+f/FPS
                    img=apply_titles(compose_frame(fr.image(s),cl.source,s),i,f/FPS)
                    frame=av.VideoFrame.from_image(img).reformat(format='yuv420p',dst_colorspace='ITU709')
                    frame.pts=vpos;frame.time_base=Fraction(1,FPS)
                    for packet in v.encode(frame): output.mux(packet)
                    vpos+=1
                    while apos<audio.shape[1] and apos<vpos*SR/FPS:
                        pcm=np.ascontiguousarray(audio[:,apos:apos+1024])
                        af=av.AudioFrame.from_ndarray(pcm,format='fltp',layout='stereo')
                        af.sample_rate=SR;af.pts=apos;af.time_base=Fraction(1,SR)
                        for packet in a.encode(af): output.mux(packet)
                        apos+=pcm.shape[1]
            finally:
                fr.close()
            print('Cut',cl.source,vpos,flush=True)
        for packet in v.encode(None):output.mux(packet)
        for packet in a.encode(None):output.mux(packet)
    temp.replace(target)
    (WORK/'edit.json').write_text(json.dumps({'fps':FPS,'size':SIZE,'seconds':vpos/FPS,'video':timeline,
        'audio':'Parallel tap of the same local game audio graph for each shot. No added music.',
        'audio_levels':levels},ensure_ascii=False,indent=2),encoding='utf-8')
    print(target, target.stat().st_size,flush=True)


if __name__=='__main__':
    stills()
    if '--stills' not in sys.argv:
        render()
