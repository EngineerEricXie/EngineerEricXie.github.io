# Citation crawler

Use Python 3.12 and install `requirements.txt` in a virtual environment. The
`bibtexparser` v1 pin is required by `scholarly==1.5.1`; upgrading it to v2 breaks
the `bibtexparser.bibdatabase` import before a Google Scholar request is made.

From this directory, run the offline checks with:

```sh
python -m pip install -r requirements.txt
python -m pip check
python -m unittest discover -s tests -v
```

For a live check, run `python main.py`. The crawler reads the profile ID from
`author.googlescholar` in the site's `_config.yml`. An optional
`GOOGLE_SCHOLAR_ID` environment variable or repository secret overrides it;
an absent or empty secret uses the public URL already configured on the site.
A successful run writes both JSON files under `results/`.
Google Scholar network failures remain visible as failures; existing published
data is left intact if the fetch fails. The live-fetch step is capped at three
minutes and logs request failures to make upstream connectivity problems clear.

The Actions workflow runs daily at 08:00 UTC, after a Pages build, and manually
via **Run workflow**. Same-repository pull requests also run the live crawler,
using the same profile configuration, but never publish.
Fork and Dependabot pull requests run only offline tests because Actions secrets
are absent.

Only a successful default-branch run can publish to `google-scholar-stats`.
The separate publishing job has the required `contents: write` permission and
bot commit identity. It preserves branch history and skips an unchanged commit.
Manual runs on a fix branch fetch and test without updating the public data.
