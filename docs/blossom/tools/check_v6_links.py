"""Check generated local v6 links without a browser or external requests."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import build_v6_dossier

ROOT = Path(__file__).resolve().parents[1]
class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if value and name in ('href', 'src', 'poster'):
                self.links.append((tag, value))

files = [ROOT / 'index.html'] + [ROOT / (stem + '.html') for stem, _ in build_v6_dossier.PAGES]
checked = []
missing = []
for file in files:
    parser = Links()
    parser.feed(file.read_text(encoding='utf-8'))
    for tag, url in parser.links:
        parts = urlsplit(url)
        if parts.scheme or parts.netloc or not parts.path:
            continue
        target = (file.parent / unquote(parts.path)).resolve()
        checked.append({'page': file.name, 'tag': tag, 'url': url})
        if not target.is_file():
            missing.append({'page': file.name, 'url': url, 'target': str(target)})
result = {'passed': not missing, 'pages': len(files), 'localReferences': len(checked),
          'missing': missing, 'scope': 'Generated local href/src/poster targets exist. No external link, anchor, or visual-layout assertion.'}
(ROOT / 'v6-local-link-verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False))
if missing:
    raise SystemExit(1)
