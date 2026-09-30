from scholarly import scholarly
import json
from datetime import datetime
import os
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import yaml


def resolve_scholar_id(config_path=None):
    """Prefer an explicit override; otherwise use the site's public profile URL."""
    scholar_id = os.environ.get('GOOGLE_SCHOLAR_ID', '').strip()
    if scholar_id:
        return scholar_id

    config_path = config_path or Path(__file__).resolve().parents[1] / '_config.yml'
    with open(config_path, encoding='utf-8') as config_file:
        config = yaml.safe_load(config_file) or {}
    profile_url = config.get('author', {}).get('googlescholar', '') or ''
    scholar_id = parse_qs(urlparse(profile_url).query).get('user', [''])[0].strip()
    if not scholar_id:
        raise ValueError(
            'Set GOOGLE_SCHOLAR_ID or author.googlescholar in _config.yml '
            'to a Google Scholar profile URL containing user=PROFILE_ID.'
        )
    return scholar_id


def main():
    author: dict = scholarly.search_author_id(resolve_scholar_id())
    scholarly.fill(author, sections=['basics', 'indices', 'counts', 'publications'])
    author['updated'] = str(datetime.now())
    author['publications'] = {v['author_pub_id']: v for v in author['publications']}
    print(json.dumps(author, indent=2))
    os.makedirs('results', exist_ok=True)
    with open('results/gs_data.json', 'w', encoding='utf-8') as outfile:
        json.dump(author, outfile, ensure_ascii=False)

    shieldio_data = {
        'schemaVersion': 1,
        'label': 'citations',
        'message': str(author['citedby']),
    }
    with open('results/gs_data_shieldsio.json', 'w', encoding='utf-8') as outfile:
        json.dump(shieldio_data, outfile, ensure_ascii=False)


if __name__ == '__main__':
    main()
