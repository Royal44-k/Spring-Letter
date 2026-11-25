"""CPU metadata guard tests only: no browser, video encoding or frame decoding."""
from pathlib import Path
from copy import deepcopy
from hashlib import sha256
from datetime import datetime, timezone
import importlib.util
import json
import sys
import unittest

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
TOOL = ROOT / 'scripts/verify-v6-media.py'
spec = importlib.util.spec_from_file_location('v6_media_guards', TOOL)
media = importlib.util.module_from_spec(spec)
spec.loader.exec_module(media)


class MediaMetadataGuards(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.expected = media.candidate_identity()

    def setUp(self):
        expected = self.expected
        self.fixture = {'success': True, 'uncut': True, 'audioRecorded': False, 'failure': None,
                        'errors': [], 'requestsFailed': [], 'candidate': expected,
                        'build': {**{key: expected[key] for key in ('entry', 'styleBuild', 'entrySha256', 'styleSha256')},
                                  'finalEntry': expected['entry'], 'finalStyleBuild': expected['styleBuild']},
                        'file': 'spring-letter-v6-uncut-silent.webm', 'fileBytes': 2001,
                        'fileSha256': 'a' * 64, 'viewport': [1440, 900], 'openingElapsedMs': 48000}

    def validate(self, fixture):
        media.validate_report(fixture, self.expected, 'a' * 64, 2001)

    def rejects(self, change):
        fixture = deepcopy(self.fixture)
        change(fixture)
        with self.assertRaises(AssertionError):
            self.validate(fixture)

    def test_valid_metadata(self):
        self.validate(self.fixture)

    def test_same_size_video_replacement_is_rejected(self):
        self.rejects(lambda r: r.update(fileSha256='b' * 64))

    def test_mixed_final_entry_is_rejected(self):
        self.rejects(lambda r: r['build'].update(finalEntry='/assets/other.js'))

    def test_wrong_candidate_asset_hash_is_rejected(self):
        self.rejects(lambda r: r['build'].update(styleSha256='c' * 64))

    def test_path_substitution_is_rejected(self):
        self.rejects(lambda r: r.update(file='../outside.webm'))

    def test_failed_recording_is_rejected(self):
        self.rejects(lambda r: r.update(success=False))

    def test_audio_claim_mismatch_is_rejected(self):
        self.rejects(lambda r: r.update(audioRecorded=True))

    def test_incomplete_opening_is_rejected(self):
        self.rejects(lambda r: r.update(openingElapsedMs=1000))

    def test_wrong_dimensions_are_rejected(self):
        self.rejects(lambda r: r.update(viewport=[320, 200]))


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(MediaMetadataGuards)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    record = {'date': datetime.now(timezone.utc).isoformat(), 'passed': result.wasSuccessful(),
              'testsRun': result.testsRun, 'failures': len(result.failures), 'errors': len(result.errors),
              'sourceSha256': {TOOL.name: sha256(TOOL.read_bytes()).hexdigest(), Path(__file__).name: sha256(Path(__file__).read_bytes()).hexdigest()},
              'scope': 'Pure CPU metadata guards with explicitly synthetic digests, not video data. No browser or frame decoding. This is not a media integrity report.'}
    output = ROOT / 'evidence/v6-media-tool-guards.json'
    if output.exists():
        previous = output.parent / 'tool-guard-history' / ('v6-media-tool-guards-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%f') + '.json')
        previous.parent.mkdir(parents=True, exist_ok=True)
        previous.write_bytes(output.read_bytes())
    output.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(record))
    sys.exit(0 if result.wasSuccessful() else 1)
