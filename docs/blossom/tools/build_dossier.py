"""Render the design archive as local HTML; stdlib only, no remote dependencies."""
from pathlib import Path
import html
import json
import re
from urllib.parse import urlsplit, urlunsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
DOCS = [
    ('script-v4', '情景与交互剧本 v4'), ('research-v4', '自主研究 v4'),
    ('quality-rubric-v4', '质量验收与差距 v4'), ('v4-execution-plan', '本轮执行方案'),
    ('release-design-v3', '制作定稿 v3'), ('art-direction-v3', '视觉规格 v3'),
    ('research-sites-v3', '网站研究 v3'), ('free-assets-v3', '免费资源 v3'),
    ('fps-case-v3', 'Fable案例复核'), ('execution-plan', '开发执行计划'),
    ('development-log', '开发与验收记录'), ('README', '档案阅读说明'),
    ('design-proposal', '完整设计'), ('experience-blueprint', '叙事与玩法'),
    ('research-depth', '深化研究'), ('video-analysis', '视频证据'),
    ('research-cases', '案例核查'), ('resources-architecture', '资源与架构'),
    ('knowledge-playbook', '制作手册'),
]

CSS = '''
:root{--paper:#f0eee8;--ink:#292637;--muted:#665e70;--line:#d2ccd4;--accent:#65507e;--dark:#191523;--lavender:#d6c1eb}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:90px}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.85 "Segoe UI","Microsoft YaHei",sans-serif}a{color:var(--accent);text-underline-offset:5px}button,a{-webkit-tap-highlight-color:transparent}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #9f6ba5;outline-offset:4px}button{font:inherit;cursor:pointer}h1,h2,h3,p,figure{margin:0}h1,h2,.serif{font-family:"Noto Serif CJK SC","Source Han Serif SC",SimSun,serif;font-weight:400}h1{font-size:clamp(52px,7vw,96px);line-height:1.12;letter-spacing:.07em}h2{font-size:clamp(30px,3.1vw,46px);line-height:1.35}h3{font-size:20px;line-height:1.55}p+p{margin-top:1em}.wrap{max-width:1360px;margin:auto;padding:0 64px}.topbar{border-bottom:1px solid var(--line);padding:19px 0}.topbar .wrap{display:flex;justify-content:space-between;align-items:center;gap:20px}.brand{font-size:13px;letter-spacing:.16em;text-decoration:none;color:var(--ink)}.toplinks{display:flex;gap:24px;font-size:13px;flex-wrap:wrap}.toplinks a{text-decoration:none}.eyebrow{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}.hero{display:grid;grid-template-columns:1fr 1fr;gap:80px;padding-top:68px;padding-bottom:54px}.hero h1{margin:22px 0 14px}.subtitle{font-family:Georgia,serif;font-size:20px;font-style:italic;color:var(--muted)}.intro{padding-top:44px;max-width:460px}.intro h2{font-size:29px;margin-bottom:20px}.intro p{color:var(--muted)}.action{display:inline-flex;align-items:center;gap:28px;border-bottom:1px solid var(--accent);text-decoration:none;margin-top:24px;padding:8px 0}.facts{display:flex;gap:30px;flex-wrap:wrap;margin-top:30px;font-size:12px;color:var(--muted)}.facts b{display:block;font-family:Georgia,serif;font-size:27px;font-weight:400;color:var(--ink);line-height:1.3}.reference-spread{display:grid;grid-template-columns:1.15fr 1fr;gap:18px}.reference-spread img{display:block;width:100%;height:310px;object-fit:contain;background:#201a2c}.reference-spread figcaption{font-size:12px;margin-top:9px;color:var(--muted)}.notice{font-size:12px;color:var(--muted);margin:18px 0 0;padding-bottom:42px;border-bottom:1px solid var(--line)}.section{padding-top:74px;padding-bottom:74px}.section-head{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:end;margin-bottom:36px}.section-head .eyebrow{margin-bottom:16px}.section-head p{color:var(--muted);max-width:490px}.verbs{display:grid;grid-template-columns:repeat(3,1fr);gap:38px}.verb{border-top:1px solid var(--line);padding-top:23px}.verb .number{font:italic 18px Georgia,serif;color:var(--muted)}.verb h3{font-family:SimSun,serif;font-size:30px;font-weight:400;margin:14px 0}.verb p{font-size:15px;color:var(--muted)}.verb strong{font-weight:500;color:var(--ink)}.keys{font-size:12px;margin-top:18px;color:var(--accent)}.dark{background:var(--dark);color:#eee7f4}.dark .eyebrow,.dark p,.dark figcaption{color:#beb3cd}.dark .section-head h2{color:#eee7f4}.dark a{color:#dfc5f4}.gallery-layout{display:grid;grid-template-columns:minmax(0,2fr) minmax(240px,1fr);gap:32px}.viewer{width:100%;aspect-ratio:16/9;object-fit:contain;display:block;background:#0b090f;border:1px solid #3c314a}.gallery-caption{font-size:13px;margin-top:12px}.frame-buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-content:start}.frame-buttons button{min-height:58px;border:1px solid #574761;background:transparent;color:#e4d7ee;text-align:left;padding:12px 15px;font-size:13px;line-height:1.6}.frame-buttons button[aria-pressed=true]{background:#d7c4e7;color:#292031;border-color:#d7c4e7}.gallery-note{grid-column:1/-1;font-size:12px;margin-top:14px}.journey{border-top:1px solid var(--line);margin-top:34px}.journey details{border-bottom:1px solid var(--line);padding:22px 0}.journey summary{cursor:pointer;display:grid;grid-template-columns:50px 170px 1fr 24px;align-items:center;gap:12px;list-style:none}.journey summary::-webkit-details-marker{display:none}.journey .stepno{font:italic 22px Georgia,serif;color:var(--muted)}.journey summary b{font-family:SimSun,serif;font-size:25px;font-weight:400}.journey summary span:nth-child(3){font-size:15px;color:var(--muted)}.journey summary:after{content:'＋';color:var(--accent)}.journey details[open] summary:after{content:'－'}.journey details p{max-width:790px;margin:22px 0 5px 62px;color:var(--muted);font-size:15px}.route-note{display:flex;justify-content:space-between;gap:30px;margin-top:20px;font-size:13px;color:var(--muted)}.library{background:#e7e2e8}.library-links{margin-top:34px;display:grid;grid-template-columns:1fr 1fr;column-gap:50px}.library-links a{display:block;text-decoration:none;border-top:1px solid #bfb5c8;padding:22px 0}.library-links strong{display:block;font-size:20px;font-weight:500}.library-links span{display:block;color:var(--muted);font-size:13px;margin-top:5px}.approval-note{margin-top:32px;font-size:14px;max-width:900px;color:var(--muted)}footer{border-top:1px solid var(--line);padding:25px 0;font-size:12px;color:var(--muted)}footer .wrap{display:flex;justify-content:space-between;gap:30px}.doc-layout{display:grid;grid-template-columns:230px minmax(0,1fr);gap:48px;padding-top:42px;padding-bottom:70px}.toc{position:sticky;top:25px;height:calc(100vh - 50px);overflow:auto;font-size:13px;padding-right:15px}.toc a{display:block;text-decoration:none;padding:6px 0;color:var(--muted)}.toc .toc-title{font-size:11px;letter-spacing:.15em;margin:0 0 12px}.prose{max-width:900px;min-width:0;overflow-wrap:anywhere}.prose h1{font-size:42px;line-height:1.4;margin:0 0 30px;letter-spacing:.015em}.prose h2{font-family:inherit;font-weight:500;font-size:28px;margin:45px 0 22px;padding-top:24px;border-top:1px solid var(--line)}.prose h3{font-size:20px;margin:30px 0 12px}.prose p{margin:16px 0}.prose li{margin:9px 0}.prose blockquote{border-left:2px solid #937cab;margin:20px 0;padding:4px 24px;color:var(--accent)}.prose pre{background:#e4dfe6;padding:20px;overflow:auto;font:13px/1.8 Consolas,monospace}.prose code{font-family:Consolas,monospace;font-size:.9em}.table-scroll{overflow-x:auto;margin:22px 0}table{border-collapse:collapse;min-width:640px;width:100%;font-size:14px;line-height:1.8}th,td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid var(--line)}th{background:#e4dfe6;font-weight:500}td:first-child{font-weight:500}ul,ol{padding-left:24px}.doc-meta{font-size:12px;margin-bottom:25px;color:var(--muted)}.evidence-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:28px}.evidence-grid img{width:100%;height:220px;object-fit:contain;background:#e1dce3}.evidence-grid figcaption{font-size:12px;margin:7px 0}
@media(max-width:900px){.wrap{padding-left:28px;padding-right:28px}.hero{gap:40px}.reference-spread img{height:230px}.section-head{gap:35px}.gallery-layout{grid-template-columns:1fr}.doc-layout{grid-template-columns:1fr}.toc{position:static;height:auto;max-height:260px;border-bottom:1px solid var(--line);padding-bottom:24px}.frame-buttons{grid-template-columns:repeat(4,1fr)}}
@media(max-width:600px){.wrap{padding-left:22px;padding-right:22px}.topbar .wrap{align-items:flex-start}.toplinks{gap:8px 15px;justify-content:flex-end;max-width:175px;font-size:12px}.brand{font-size:11px}.hero{grid-template-columns:1fr;gap:22px;padding-top:40px;padding-bottom:32px}.intro{padding-top:0}.hero h1{font-size:64px}.intro h2{font-size:24px}.facts{gap:27px}.reference-spread{grid-template-columns:1fr;gap:20px}.reference-spread img{height:auto;aspect-ratio:16/9}.section{padding-top:48px;padding-bottom:48px}.section-head{grid-template-columns:1fr;gap:18px}.verbs{grid-template-columns:1fr;gap:28px}.verb h3{display:inline-block;margin:0 0 12px 16px;font-size:26px}.frame-buttons{grid-template-columns:1fr 1fr}.journey summary{grid-template-columns:30px 1fr 20px;gap:10px}.journey summary span:nth-child(3){grid-column:2;grid-row:2}.journey summary:after{grid-row:1;grid-column:3}.journey details p{margin-left:40px}.route-note,footer .wrap{display:block}.library-links{grid-template-columns:1fr}.prose h1{font-size:31px}.prose h2{font-size:25px}.doc-layout{gap:28px}.evidence-grid{grid-template-columns:1fr 1fr}.evidence-grid img{height:160px}}
@media(max-width:600px){.route-note span,footer .wrap span{display:block}.route-note span+span,footer .wrap span+span{margin-top:8px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{.topbar,.toc,.frame-buttons{display:none}.wrap{padding:0 18px}.doc-layout{display:block}.prose{max-width:none}.dark{background:white;color:black}.dark p{color:black}h2,h3{break-after:avoid}tr,figure{break-inside:avoid}a{color:inherit}body{font-size:11pt}.hero{padding-top:20px}.section{padding:25px 0}}
'''

def inline(s):
    tokens = []
    def stash(content):
        tokens.append(content)
        return f'@@TOKEN{len(tokens)-1}@@'
    s = re.sub(r'`([^`]+)`', lambda m: stash('<code>'+html.escape(m[1])+'</code>'), s)
    def link(m):
        url = m[2].strip()
        if url.startswith('<') and url.endswith('>'):
            url = url[1:-1]
        parts = urlsplit(url)
        # Only documents generated in this dossier may acquire .html. A linked
        # project README outside ROOT must stay .md, even though its stem matches.
        local_path = (ROOT / unquote(parts.path)).resolve()
        if (not parts.scheme and not parts.netloc and parts.path.endswith('.md')
                and local_path.parent == ROOT and local_path.stem in {d[0] for d in DOCS}):
            url = urlunsplit(('', '', parts.path[:-3]+'.html', parts.query, parts.fragment))
        return stash(f'<a href="{html.escape(url, quote=True)}">{html.escape(m[1])}</a>')
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, s)
    s = html.escape(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    for i,t in enumerate(tokens):
        s=s.replace(f'@@TOKEN{i}@@',t)
    return s

def render_md(source):
    lines=source.splitlines(); out=[]; toc=[]; i=0
    while i<len(lines):
        line=lines[i]
        if not line.strip(): i+=1; continue
        if line.startswith('```'):
            chunk=[]; i+=1
            while i<len(lines) and not lines[i].startswith('```'):
                chunk.append(lines[i]);i+=1
            out.append('<pre><code>'+html.escape('\n'.join(chunk))+'</code></pre>');i+=1;continue
        heading=re.match(r'^(#{1,3}) (.*)',line)
        if heading:
            depth=len(heading[1]);anchor=f'section-{len(toc)}';title=heading[2]
            if depth==2: toc.append((anchor,title))
            out.append(f'<h{depth}'+(f' id="{anchor}"' if depth==2 else '')+'>'+inline(title)+f'</h{depth}>');i+=1;continue
        if line.startswith('|') and i+1<len(lines) and re.match(r'^\|[\s:|\-]+\|$',lines[i+1]):
            rows=[]
            while i<len(lines) and lines[i].startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')]);i+=1
            out.append('<div class="table-scroll"><table><thead><tr>'+''.join('<th>'+inline(c)+'</th>' for c in rows[0])+'</tr></thead><tbody>')
            for row in rows[2:]:out.append('<tr>'+''.join('<td>'+inline(c)+'</td>' for c in row)+'</tr>')
            out.append('</tbody></table></div>');continue
        item=re.match(r'^(\d+\.|[-*]) (.*)',line)
        if item:
            kind='ol' if item[1][0].isdigit() else 'ul';out.append('<'+kind+'>')
            while i<len(lines):
                m=re.match(r'^(\d+\.|[-*]) (.*)',lines[i])
                if not m or ('ol' if m[1][0].isdigit() else 'ul')!=kind:break
                out.append('<li>'+inline(m[2])+'</li>');i+=1
            out.append('</'+kind+'>');continue
        if line.startswith('> '):out.append('<blockquote>'+inline(line[2:])+'</blockquote>');i+=1;continue
        if re.fullmatch(r'[-*_]{3,}',line.strip()):out.append('<hr>');i+=1;continue
        para=[line];i+=1
        while i<len(lines) and lines[i].strip() and not re.match(r'^(#|\||```|> |\d+\. |[-*] )',lines[i]):para.append(lines[i]);i+=1
        out.append('<p>'+inline(' '.join(para))+'</p>')
    return '\n'.join(out),toc

def shell(title,body,script=''):
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)} · 花漾年华：待寄出的春信</title><link rel="stylesheet" href="dossier.css"></head><body>
<header class="topbar"><div class="wrap"><a class="brand" href="index.html">SPRING LETTER · 春信</a><nav class="toplinks" aria-label="文档导航"><a href="index.html#development">当前进度</a><a href="index.html#story">故事与主题</a><a href="index.html#journey">四幕玩法</a><a href="index.html#library">完整档案</a></nav></div></header>
{body}<footer><div class="wrap"><span>独立主题设计与制作档案 · 2026.11.18 · v4.0</span><span>参考原帧与首版实机分别标注；文档推演不代替游戏验收。</span></div></footer>{script}</body></html>'''

FRAMES=[
 ('液银 · 白昼','blossom',0,'ShiningBlossom · 00:00.00 / 帧0000。液银、虹彩、浅水与展厅层次。'),
 ('液银 · 夜间','blossom',72,'ShiningBlossom · 00:02.40 / 帧0072。同一场景进入夜间，保持花的空间关系。'),
 ('晶体 · 透光','blossom',300,'ShiningBlossom · 00:10.00 / 帧0300。材质身份变为晶体，厚度与折射观感清楚。'),
 ('自然花 · 粉白','blossom',700,'ShiningBlossom · 00:23.33 / 帧0700。自然花瓣、绿色茎叶与柔和亮场。'),
 ('点云 · 保形','particles',0,'3D粒子效果 · 00:00.00 / 帧0000。密集表面点云保留可辨立体形体。'),
 ('点云 · 局部扰动','particles',133,'3D粒子效果 · 00:04.43 / 帧0133。局部拉开形成流线，未受扰区域仍有轮廓。'),
 ('点云 · 满屏展开','particles',220,'3D粒子效果 · 00:07.33 / 帧0220。点场铺满视野；镜头与粒子各自贡献尚不确定。'),
 ('点云 · 渐进回聚','particles',560,'3D粒子效果 · 00:18.67 / 帧0560。大形恢复，细部逐步出现。'),
]

def build():
    css=CSS+'\n'+(Path(__file__).parent/'dossier-v2.css').read_text(encoding='utf-8')
    (ROOT/'dossier.css').write_text(css,encoding='utf-8')
    for stem,label in DOCS:
        body,toc=render_md((ROOT/(stem+'.md')).read_text(encoding='utf-8'))
        nav='<p class="toc-title">'+label+' / CONTENTS</p>'+''.join(f'<a href="#{a}">{html.escape(t)}</a>' for a,t in toc)
        content=f'<main class="wrap doc-layout"><aside class="toc" aria-label="本文目录">{nav}</aside><article class="prose"><div class="doc-meta"><a href="index.html">← 图文概览</a>　/　<a href="{stem}.md">Markdown源文件</a></div>{body}</article></main>'
        (ROOT/(stem+'.html')).write_text(shell(label,content),encoding='utf-8')
    buttons=''.join(f'<button type="button" data-frame="{i}" aria-pressed="{str(i==0).lower()}">{html.escape(f[0])}</button>' for i,f in enumerate(FRAMES))
    gallery_data=[{'src':f'video/{v}/detail/frame-{n:04d}.jpg','caption':c,'label':label} for label,v,n,c in FRAMES]
    body=(Path(__file__).parent/'dossier-template.html').read_text(encoding='utf-8').replace('@@FRAME_BUTTONS@@',buttons)
    project_readme = ROOT.parents[1]/'spring-letter'/'README.md'
    readme_link = ('<a href="../../spring-letter/README.md">项目运行说明 ↗</a>' if project_readme.is_file()
                   else '<span>项目运行说明正在汇整；目录：D:/AI Game/spring-letter/</span>')
    body = body.replace('@@PROJECT_README@@', readme_link)
    script='<script>const frames='+json.dumps(gallery_data,ensure_ascii=False)+''';document.querySelectorAll('[data-frame]').forEach(button=>button.addEventListener('click',()=>{const f=frames[Number(button.dataset.frame)];document.getElementById('frame-view').src=f.src;document.getElementById('frame-view').alt=f.label+'：用户视频参考原帧';document.getElementById('frame-link').href=f.src;document.getElementById('frame-caption').textContent=f.caption;document.querySelectorAll('[data-frame]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));</script>'''
    script+= '<script>'+ (Path(__file__).parent/'dossier-choices.js').read_text(encoding='utf-8')+'</script>'
    (ROOT/'index.html').write_text(shell('设计概览',body,script),encoding='utf-8')
    atlas='<main class="wrap section"><div class="eyebrow">Frame audit / Every decoded frame</div><h1 style="font-size:46px;margin:18px 0">全部参考帧</h1><p>联系表覆盖全部2629帧。点击查看完整图；每格标有帧号与时间。缩略图通览不等于全部原分辨率逐帧检查。</p>'
    for video,title in [('blossom','ShiningBlossom · 1052帧'),('particles','3D粒子效果 · 1577帧')]:
        atlas+=f'<h2 style="margin-top:48px">{title}</h2><div class="evidence-grid">'
        for p in sorted((ROOT/'video'/video).glob('all-frames-*.jpg')):
            rel=p.relative_to(ROOT).as_posix()
            atlas+=f'<figure><a href="{rel}"><img loading="lazy" src="{rel}" alt="{title}，联系表{p.stem}"></a><figcaption>{p.stem}</figcaption></figure>'
        atlas+='</div>'
    atlas+='</main>'
    (ROOT/'frame-atlas.html').write_text(shell('全帧索引',atlas),encoding='utf-8')
    print(json.dumps({'html_pages':len(DOCS)+2,'version':'v4.0','reference_frames':len(FRAMES),'all_frame_sheets':27,'project_readme_linked':project_readme.is_file(),'output':str(ROOT/'index.html')},ensure_ascii=False))

if __name__=='__main__':build()
