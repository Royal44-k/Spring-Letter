"""Check local links and evidence media in the v5 dossier, using stdlib only."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import build_v5_dossier as dossier

ROOT = Path(__file__).resolve().parents[1]

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids = [], set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        for key in ('href', 'src', 'poster'):
            if attrs.get(key):
                self.links.append((tag, key, attrs[key]))

def parse(file):
    result = Links()
    result.feed(file.read_text(encoding='utf-8'))
    return result

def main():
    pages = [ROOT / 'index.html'] + [ROOT / (stem + '.html') for stem, _ in dossier.PAGES]
    parsed = {file: parse(file) for file in pages}
    failures, checked, external = [], 0, 0
    for file in pages:
        page = parsed[file]
        for tag, attr, raw in page.links:
            link = urlsplit(raw)
            if link.scheme or link.netloc:
                external += 1
                continue
            target = (file.parent / unquote(link.path)).resolve() if link.path else file
            checked += 1
            if not target.is_file():
                failures.append({'page': file.name, 'reference': raw, 'reason': 'missing local file'})
                continue
            if link.fragment and target.suffix == '.html':
                other = parsed.setdefault(target, parse(target))
                if unquote(link.fragment) not in other.ids:
                    failures.append({'page': file.name, 'reference': raw, 'reason': 'missing anchor'})
    report = {'pages': len(pages), 'localReferencesChecked': checked, 'externalReferencesNotFetched': external,
              'failures': failures, 'scope': 'Static existence and HTML anchors; no external network or browser layout validation.'}
    (ROOT / 'v5-dossier-links.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False))
    if failures:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
