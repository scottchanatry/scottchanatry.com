# scottchanatry.com

Personal site. Hand-typed HTML/CSS and ~120 lines of vanilla JS — the crayon
button lets visitors draw on the page, and the underline draws itself on load.
No frameworks, no build step, no trackers.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole site: markup, styles, crayon engine, Person schema (JSON-LD) |
| `404.html` | Not-found page (GitHub Pages picks it up automatically) |
| `CNAME` | Kept for a possible future GitHub Pages setup |
| `robots.txt` | Allows crawling, points to the sitemap |
| `sitemap.xml` | One-URL sitemap for Search Console |

## Hosting

Served by Porkbun Static Hosting via GitHub Connect: every push to `main`
publishes automatically. Preview locally with `python3 -m http.server` in
this folder. The `CNAME` file is kept in case hosting ever moves to
GitHub Pages.

## Make Google find it (the part that actually moves rankings)

1. **Google Search Console** → add property `scottchanatry.com` (Domain type)
   → verify with the DNS `TXT` record Google gives you, added at Porkbun.
2. Submit `https://scottchanatry.com/sitemap.xml`, then use **URL Inspection →
   Request Indexing** on the homepage.
3. **Close the entity loop** — this is the highest-value step. Point every
   profile back here:
   - Google Scholar → profile → Homepage field → `https://scottchanatry.com`
   - GitHub → profile → Website field → same
   - LinkedIn → Contact info → Website → same
   - Crunchbase / Semantic Scholar → website fields where editable

   The site links to the profiles (`sameAs` + `rel="me"`); the profiles link
   back. That reciprocal loop is how Google learns these pages are all the
   same Scott Chanatry — and it's what lifts the whole cluster for name
   searches.
4. Give it a real inbound link or two over time (a bio line anywhere that
   already mentions you). Fresh domains rank on links, not markup alone.
