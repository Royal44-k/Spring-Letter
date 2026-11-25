"""Render only v6 dossier pages, retaining all historical documents unchanged.

Uses the existing stdlib Markdown renderer. No asset downloads, browser, GPU,
global CSS rewrite, historical page generation, or release/QA claims.
"""
from pathlib import Path
import hashlib
import html
import json
import shutil
import build_dossier as base

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    ('README', '制作档案阅读入口'),
    ('v6-design', '花随风行 · 本轮设计'),
    ('v6-play-script', '可执行剧情与交互脚本'),
    ('v6-visual-boundaries', '视觉复核与参考差距'),
    ('v6-production-notes', '真实问题与制作复盘'),
    ('v6-startup-optimization', '加载预热优化与独立对照'),
    ('v6-render-pass-review', '阴影归属与渲染实验复核'),
    ('v6-research-index', '研究、采用决定与验证索引'),
    ('v6-execution-plan', 'v6 执行计划'),
    ('research-v6-experience', '加载与镜头研究'),
    ('research-v6-seeds', '牵引、携带与选择研究'),
    ('research-v6-flower', '花形、材质与同源花尘研究'),
    ('v6-experience-review', '体验与接线独立复审'),
    ('v6-opening-art-review', '初花庭美术复审'),
    ('v6-seeds-review', '种子规则复核'),
    ('v6-seeds-play-review', '种子普通输入审查'),
    ('v6-world-polish-plan', '风廊与终庭美术记录'),
    ('v6-retained-content-verification', '保留支线与雨潮庭回归'),
    ('v6-closeout-audit', '最终候选与发行收尾核对'),
]
# The release page is generated only after the final evidence gates succeed.
if (ROOT / 'v6-release-verification.md').is_file():
    PAGES.append(('v6-release-verification', '最终验证、实录与发行'))


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build():
    archive = ROOT / 'index-v5.html'
    if not archive.exists():
        shutil.copyfile(ROOT / 'index.html', archive)
    protected = sorted({archive, ROOT / 'dossier.css', ROOT / 'frame-atlas.html',
                        *ROOT.glob('v5-*'), *ROOT.glob('*-v5.*'),
                        *ROOT.glob('index-v[1-4].html')})
    before = {str(p.relative_to(ROOT)): digest(p) for p in protected if p.is_file()}
    missing = [stem for stem, _ in PAGES if not (ROOT / (stem + '.md')).is_file()]
    if missing:
        raise FileNotFoundError('Missing v6 source documents: ' + ', '.join(missing))
    # Link conversion knows existing archive pages, but only PAGES are rendered.
    current_stems = {stem for stem, _ in PAGES}
    archive_docs = [(p.stem, p.stem) for p in ROOT.glob('*.md')
                    if p.stem not in current_stems and p.with_suffix('.html').exists()]
    base.DOCS = PAGES + archive_docs
    generated = []
    for stem, title in PAGES:
        body, toc = base.render_md((ROOT / (stem + '.md')).read_text(encoding='utf-8'))
        nav = '<p class="toc-title">' + html.escape(title) + '</p>' + ''.join(
            f'<a href="#{anchor}">{html.escape(text)}</a>' for anchor, text in toc)
        content = (f'<main class="wrap doc-layout"><aside class="toc" aria-label="本文目录">{nav}</aside>'
                   f'<article class="prose"><div class="doc-meta"><a href="index.html">← 花随风行 · 制作概览</a>'
                   f'　/　<a href="{stem}.md">Markdown 源文件</a></div>{body}</article></main>')
        page = base.shell(title, content).replace(
            '2026.11.18 · v4.0', '2026.11.19 · v6 / 0.4 制作档案').replace(
            '参考原帧与首版实机分别标注；文档推演不代替游戏验收。',
            '原片、隔离实验与主游戏证据分别标注；文档不代替最终验收。')
        (ROOT / (stem + '.html')).write_text(page, encoding='utf-8')
        generated.append(stem + '.html')
    shutil.copyfile(ROOT / 'tools/v6-index.html', ROOT / 'index.html')
    changed = [name for name, sha in before.items() if digest(ROOT / name) != sha]
    if changed:
        raise RuntimeError('Historical files unexpectedly changed: ' + ', '.join(changed))
    report = {'version': 'v6 / 0.4 dossier', 'generated': generated + ['index.html'],
              'history_preserved': before, 'historical_changes': changed,
              'scope': 'Document rendering only; no browser, gameplay or release validation.'}
    (ROOT / 'v6-dossier-build.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'generated_pages': len(generated) + 1,
                      'historical_changes': changed, 'index': str(ROOT / 'index.html')}, ensure_ascii=False))


if __name__ == '__main__':
    build()
