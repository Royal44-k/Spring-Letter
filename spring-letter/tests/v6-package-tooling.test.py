"""CPU-only tests of the delivered package/current-release identity gate."""
import ast
import copy
from pathlib import Path
import unittest

SOURCE = Path(__file__).resolve().parents[1] / 'scripts/verify-v6-package.py'
tree = ast.parse(SOURCE.read_text(encoding='utf-8'))
# Execute only the pure gate, never the extractor/server top-level code.
gate = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == 'assert_current_release')
namespace = {}
exec(compile(ast.Module(body=[gate], type_ignores=[]), str(SOURCE), 'exec'), namespace)
check = namespace['assert_current_release']


class PackageIdentityTests(unittest.TestCase):
    def setUp(self):
        self.current = {'version': '0.4.0', 'build': '/assets/D.js', 'styleBuild': '/assets/D.css',
                        'dist': [{'file': 'dist/index.html', 'sha256': 'd'}],
                        'runtimeFiles': [{'file': 'scripts/serve.cjs', 'sha256': 's'}]}
        self.record = {'build': '/assets/D.js', 'styleBuild': '/assets/D.css'}

    def test_exact_current_release_passes(self):
        check(self.current, self.record, copy.deepcopy(self.current))

    def test_self_consistent_old_archive_is_rejected(self):
        old = copy.deepcopy(self.current)
        old.update(build='/assets/C.js', styleBuild='/assets/C.css')
        with self.assertRaisesRegex(RuntimeError, 'record'):
            check(self.current, {'build': old['build'], 'styleBuild': old['styleBuild']}, old)

    def test_old_stylesheet_or_missing_runtime_cannot_hide_behind_current_record(self):
        for key, value in [('styleBuild', '/assets/C.css'), ('dist', []), ('runtimeFiles', []), ('version', '0.3.0')]:
            with self.subTest(key=key):
                old = copy.deepcopy(self.current)
                old[key] = value
                with self.assertRaisesRegex(RuntimeError, 'manifest'):
                    check(self.current, self.record, old)


if __name__ == '__main__':
    unittest.main()
