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

For a live check, set `GOOGLE_SCHOLAR_ID` to the profile ID, then run
`python main.py`. A successful run writes both JSON files under `results/`.
Google Scholar network failures remain visible as failures; existing published
data is left intact if the fetch fails.

The Actions workflow runs daily at 08:00 UTC, after a Pages build, and manually
via **Run workflow**. Same-repository pull requests also run the live crawler,
using the existing `GOOGLE_SCHOLAR_ID` repository secret, but never publish.
Fork and Dependabot pull requests run only offline tests because Actions secrets
are absent.

Only a successful default-branch run can publish to `google-scholar-stats`.
The separate publishing job has the required `contents: write` permission and
bot commit identity. It preserves branch history and skips an unchanged commit.
Manual runs on a fix branch fetch and test without updating the public data.
