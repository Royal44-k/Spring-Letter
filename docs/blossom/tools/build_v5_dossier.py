"""Render the v5 documents without rewriting the historical archive."""
from pathlib import Path
import html
import build_dossier as base

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    ('README', '档案阅读入口'),
    ('v5-design-script', '风笔与远行 · 完整剧本'),
    ('research-v5', '自主研究与免费资源 v5'),
    ('v5-knowledge', '制作复盘与知识沉淀'),
    ('v5-execution-plan', 'v5 执行计划'),
    ('v5-landscape', '可走景观与空间预算'),
    ('v5-playability', '三庭玩法与验证'),
    ('v5-particles', '同源花尘与风笔'),
    ('v5-bridge-weaver', '手绘花桥与占用保护'),
    ('v5-main-play-verification', '主线普通输入验证'),
    ('v5-visual-gap-review', '参考视觉对照'),
    ('v5-narrative-review', '叙事独立审查'),
    ('v5-code-review', '代码独立审查'),
    ('v5-branches-play-verification', '三支线与尾声实际输入'),
]

def build():
    base.DOCS = PAGES + base.DOCS
    for stem, title in PAGES:
        source = ROOT / (stem + '.md')
        if not source.exists():
            continue
        body, toc = base.render_md(source.read_text(encoding='utf-8'))
        nav = '<p class="toc-title">' + html.escape(title) + '</p>' + ''.join(
            f'<a href="#{anchor}">{html.escape(text)}</a>' for anchor, text in toc)
        content = f'<main class="wrap doc-layout"><aside class="toc">{nav}</aside><article class="prose"><div class="doc-meta"><a href="index.html">← 本轮制作概览</a>　/　<a href="{stem}.md">Markdown源文件</a></div>{body}</article></main>'
        (ROOT / (stem + '.html')).write_text(base.shell(title, content).replace('2026.11.18 · v4.0','2026.11.19 · v5.0'), encoding='utf-8')
    (ROOT / 'index.html').write_text((ROOT / 'tools' / 'v5-index.html').read_text(encoding='utf-8'), encoding='utf-8')
    print(f'Rendered {len(PAGES)} v5 dossier pages and the v5 index.')

if __name__ == '__main__':
    build()
