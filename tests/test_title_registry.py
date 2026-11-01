"""Verify the boundary that prevents a correct title being assigned to the wrong photo."""
import unittest
from scripts.sync_plate_titles import resolve_catalog


class ArtistTitleMappingTests(unittest.TestCase):
    def setUp(self):
        self.catalog = {'plates': [{'plate': '01', 'file': 'Working-1.jpg', 'title': 'Invented draft'}, {'plate': '02', 'file': 'Working-2.jpg', 'title': 'Another draft'}]}
        self.registry = {'sourceSha256': 'revision-a', 'titles': [{'sourceId': 'artist-source', 'title': 'Artist’s Own Title'}]}
        self.mapping = {'sourceSha256': 'revision-a', 'matches': {}}

    def match(self, **overrides):
        return dict(sourceId='artist-source', status='confirmed', confirmedBy='luna', evidence='Compared the source image with Working-1.jpg', **overrides)

    def test_unmatched_plates_have_no_synthetic_title(self):
        result = resolve_catalog(self.catalog, self.registry, self.mapping)
        self.assertEqual([p['title'] for p in result['plates']], ['Plate 01', 'Plate 02'])
        self.assertEqual(self.catalog['plates'][0]['title'], 'Invented draft')

    def test_only_exact_confirmed_file_gets_verbatim_artist_title(self):
        self.mapping['matches']['Working-1.jpg'] = self.match()
        result = resolve_catalog(self.catalog, self.registry, self.mapping)
        self.assertEqual(result['plates'][0]['title'], 'Artist’s Own Title')
        self.assertEqual(result['plates'][1]['title'], 'Plate 02')
        self.assertEqual(result['plates'][0]['titleSourceId'], 'artist-source')

    def test_unconfirmed_or_untraceable_matches_fail(self):
        for field in ['status', 'confirmedBy', 'evidence']:
            with self.subTest(field=field):
                self.mapping['matches']['Working-1.jpg'] = self.match()
                self.mapping['matches']['Working-1.jpg'][field] = ''
                with self.assertRaisesRegex(ValueError, 'confirmation and evidence'):
                    resolve_catalog(self.catalog, self.registry, self.mapping)

    def test_no_fuzzy_file_matching(self):
        self.mapping['matches']['working-1.jpg'] = self.match()
        with self.assertRaisesRegex(ValueError, 'Unknown plate file'):
            resolve_catalog(self.catalog, self.registry, self.mapping)

    def test_rejects_wrong_revision_unknown_source_and_duplicate_assignment(self):
        self.mapping['sourceSha256'] = 'old-revision'
        with self.assertRaisesRegex(ValueError, 'different source revision'):
            resolve_catalog(self.catalog, self.registry, self.mapping)
        self.mapping['sourceSha256'] = 'revision-a'
        self.mapping['matches']['Working-1.jpg'] = self.match()
        self.mapping['matches']['Working-1.jpg']['sourceId'] = 'unknown'
        with self.assertRaisesRegex(ValueError, 'Unknown artist source ID'):
            resolve_catalog(self.catalog, self.registry, self.mapping)
        self.mapping['matches'] = {p['file']: self.match() for p in self.catalog['plates']}
        with self.assertRaisesRegex(ValueError, 'multiple plates'):
            resolve_catalog(self.catalog, self.registry, self.mapping)

    def variant_pair(self):
        self.mapping['variantGroups'] = {'pair-1-2': {
            'sourceId': 'artist-source', 'files': ['Working-1.jpg', 'Working-2.jpg'],
            'confirmedBy': 'luna', 'evidence': 'Explicitly reviewed variants of the same scene'}}
        self.mapping['matches'] = {p['file']: dict(self.match(), variantGroup='pair-1-2') for p in self.catalog['plates']}

    def test_documented_variants_share_exact_artist_title(self):
        self.variant_pair()
        result = resolve_catalog(self.catalog, self.registry, self.mapping)
        self.assertEqual([p['title'] for p in result['plates']], ['Artist’s Own Title', 'Artist’s Own Title'])

    def test_variant_group_requires_exact_members_source_and_evidence(self):
        for field, value in [('files', ['Working-1.jpg']), ('sourceId', 'other-source'), ('confirmedBy', ''), ('evidence', '')]:
            with self.subTest(field=field):
                self.variant_pair()
                self.mapping['variantGroups']['pair-1-2'][field] = value
                with self.assertRaisesRegex(ValueError, 'Variant group lacks'):
                    resolve_catalog(self.catalog, self.registry, self.mapping)
        self.variant_pair()
        del self.mapping['matches']['Working-2.jpg']
        with self.assertRaisesRegex(ValueError, 'Variant group lacks'):
            resolve_catalog(self.catalog, self.registry, self.mapping)

    def test_provisional_and_contested_confidence_never_bind(self):
        for confidence in ['PROVISIONAL', 'SCENE MATCHED', 'CONTESTED', 'STRONG — CONTESTED by another title']:
            with self.subTest(confidence=confidence):
                self.mapping['matches'] = {'Working-1.jpg': dict(self.match(), registryConfidence=confidence)}
                with self.assertRaisesRegex(ValueError, 'not eligible'):
                    resolve_catalog(self.catalog, self.registry, self.mapping)


if __name__ == '__main__':
    unittest.main()
