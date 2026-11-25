"""Check generated local links/anchors without contacting external sites."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids, self.title_text = [], set(), ''
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if 'id' in values:
            self.ids.add(values['id'])
        if tag == 'title':
            self.in_title = True
        for name in ('href', 'src'):
            if name in values:
                self.links.append(values[name])

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title_text += data


def parse(path):
    page = Page()
    page.feed(path.read_text(encoding='utf-8'))
    return page


def verify():
    pages = {path.resolve(): parse(path) for path in ROOT.glob('*.html')}
    issues, local, external = [], 0, 0
    for path, page in pages.items():
        for url in page.links:
            parts = urlsplit(url)
            if parts.scheme or parts.netloc:
                external += 1
                continue
            target = (path.parent / unquote(parts.path)).resolve() if parts.path else path
            local += 1
            if not target.exists():
                issues.append({'page': path.name, 'url': url, 'problem': 'missing local target'})
            elif parts.fragment and target.suffix == '.html':
                target_page = pages.get(target) or parse(target)
                if unquote(parts.fragment) not in target_page.ids:
                    issues.append({'page': path.name, 'url': url, 'problem': 'missing anchor'})
    output = ROOT / 'document-verification-v3.json'
    previous = json.loads(output.read_text(encoding='utf-8')) if output.exists() else {}
    report = {
        'date': '2026-11-18', 'version': 'v4.0',
        'check': 'Generated-page local link, media, fragment and title check; external links not fetched',
        'html_pages': len(pages), 'local_references_checked': local,
        'external_references_not_fetched': external,
        'project_readme_exists': (ROOT.parents[1] / 'spring-letter/README.md').is_file(),
        'all_titles_updated': all('花漾年华：待寄出的春信' in page.title_text for page in pages.values()),
        'issues': issues,
        'gameplay_qa': 'Separate evidence: spring-letter/evidence/v4-browser-verification.json and boundary-verification.json; not performed by this link checker',
        'browser_layout_qa': previous.get('browser_layout_qa', 'Not covered by this script'),
    }
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({key: value for key, value in report.items() if key != 'browser_layout_qa'}, ensure_ascii=False))
    return 1 if issues or not report['all_titles_updated'] else 0


if __name__ == '__main__':
    raise SystemExit(verify())
