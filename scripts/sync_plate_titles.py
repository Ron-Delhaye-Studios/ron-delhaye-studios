#!/usr/bin/env python3
"""Bind artist titles only through an explicit, reviewed Working-N -> source ID map."""
import argparse
from copy import deepcopy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def resolve_catalog(catalog, registry, matches):
    titles = {}
    for record in registry['titles']:
        source_id = record['sourceId']
        if source_id in titles:
            raise ValueError('Duplicate artist source ID: ' + source_id)
        titles[source_id] = record['title']
    if matches['sourceSha256'] != registry['sourceSha256']:
        raise ValueError('Title-match map belongs to a different source revision')
    resolved = deepcopy(catalog)
    files = {plate['file'] for plate in resolved['plates']}
    used = set()
    for filename, match in matches['matches'].items():
        if filename not in files:
            raise ValueError('Unknown plate file: ' + filename)
        source_id = match['sourceId']
        if source_id not in titles:
            raise ValueError('Unknown artist source ID: ' + source_id)
        if source_id in used:
            raise ValueError('One artist title record matched to multiple plates: ' + source_id)
        if match.get('status') != 'confirmed' or not match.get('confirmedBy') or not match.get('evidence'):
            raise ValueError('Match lacks confirmation and evidence: ' + filename)
        used.add(source_id)
    for plate in resolved['plates']:
        match = matches['matches'].get(plate['file'])
        plate['title'] = titles[match['sourceId']] if match else 'Plate ' + plate['plate']
        plate['titleSourceId'] = match['sourceId'] if match else None
        plate['titleStatus'] = 'confirmed' if match else 'awaiting-match'
    return resolved


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail if the checked-in catalog is stale')
    args = parser.parse_args()
    load = lambda name: json.loads((ROOT / 'data' / name).read_text())
    catalog = load('plates-catalog.json')
    resolved = resolve_catalog(catalog, load('artist-titles.json'), load('plate-title-matches.json'))
    if args.check:
        if resolved != catalog:
            parser.exit(1, 'Catalog does not match the confirmed artist-title map. Run scripts/sync_plate_titles.py.\n')
    else:
        (ROOT / 'data/plates-catalog.json').write_text(json.dumps(resolved, ensure_ascii=False, indent=2) + '\n')
    confirmed = sum(p['titleStatus'] == 'confirmed' for p in resolved['plates'])
    print(f'{confirmed} confirmed artist-title matches; {len(resolved["plates"])-confirmed} numbered plates awaiting verification.')


if __name__ == '__main__':
    main()
