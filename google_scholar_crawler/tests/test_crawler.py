"""Offline regression tests; no Google requests or repository writes."""

import contextlib
import io
import json
import os
from pathlib import Path
import runpy
import tempfile
import unittest
from unittest.mock import patch

import bibtexparser
from bibtexparser.bibdatabase import BibDatabase
from bibtexparser.bwriter import BibTexWriter
from scholarly import scholarly


SCRIPT = Path(__file__).resolve().parents[1] / "main.py"
resolve_scholar_id = runpy.run_path(str(SCRIPT))["resolve_scholar_id"]


class ProfileConfigurationTests(unittest.TestCase):
    def test_explicit_id_takes_precedence(self):
        with patch.dict(os.environ, {"GOOGLE_SCHOLAR_ID": " explicit-id "}):
            self.assertEqual(resolve_scholar_id("missing-config.yml"), "explicit-id")

    def test_empty_secret_uses_public_profile_url(self):
        with tempfile.TemporaryDirectory() as directory:
            config = Path(directory) / "_config.yml"
            config.write_text(
                'author:\n  googlescholar: "https://scholar.google.com.tw/citations?user=public-id&hl=zh-TW"\n'
            )
            with patch.dict(os.environ, {"GOOGLE_SCHOLAR_ID": "  "}):
                self.assertEqual(resolve_scholar_id(config), "public-id")

    def test_missing_profile_reports_configuration_error(self):
        with tempfile.TemporaryDirectory() as directory:
            config = Path(directory) / "_config.yml"
            config.write_text('author:\n  googlescholar: ""\n')
            with patch.dict(os.environ, {"GOOGLE_SCHOLAR_ID": ""}):
                with self.assertRaisesRegex(ValueError, "author.googlescholar"):
                    resolve_scholar_id(config)


class DependencyCompatibilityTests(unittest.TestCase):
    def test_scholarly_bibtex_v1_api(self):
        database = BibDatabase()
        database.entries = [{"ENTRYTYPE": "article", "ID": "example", "title": "Example"}]
        encoded = BibTexWriter().write(database)
        self.assertEqual(bibtexparser.loads(encoded).entries, database.entries)


class CrawlerOutputTests(unittest.TestCase):
    def run_crawler(self, publications, citedby):
        author = {"name": "Test Author", "citedby": citedby, "publications": publications}
        with tempfile.TemporaryDirectory() as directory:
            previous = Path.cwd()
            try:
                os.chdir(directory)
                with (
                    patch.dict(os.environ, {"GOOGLE_SCHOLAR_ID": "test-profile"}),
                    patch.object(scholarly, "search_author_id", return_value=author) as search,
                    patch.object(scholarly, "fill") as fill,
                    contextlib.redirect_stdout(io.StringIO()),
                ):
                    runpy.run_path(str(SCRIPT), run_name="__main__")
                search.assert_called_once_with("test-profile")
                fill.assert_called_once_with(
                    author, sections=["basics", "indices", "counts", "publications"]
                )
                data = json.loads(Path("results/gs_data.json").read_text())
                badge = json.loads(Path("results/gs_data_shieldsio.json").read_text())
                return data, badge
            finally:
                os.chdir(previous)

    def test_writes_author_and_badge_json(self):
        publication = {"author_pub_id": "test-profile:paper", "bib": {"title": "測試"}}
        data, badge = self.run_crawler([publication], 12)
        self.assertEqual(data["publications"], {"test-profile:paper": publication})
        self.assertTrue(data["updated"])
        self.assertEqual(badge, {"schemaVersion": 1, "label": "citations", "message": "12"})

    def test_zero_citations_and_no_publications(self):
        data, badge = self.run_crawler([], 0)
        self.assertEqual(data["publications"], {})
        self.assertEqual(badge["message"], "0")


if __name__ == "__main__":
    unittest.main()
