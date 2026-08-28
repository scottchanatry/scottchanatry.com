# scottchanatry.com

Personal site. Hand-typed HTML/CSS and ~120 lines of vanilla JS — the crayon
button lets visitors draw on the page, and the underline draws itself on load.
No frameworks, no build step, no trackers.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole site: markup, styles, crayon engine, Person schema (JSON-LD) |
| `404.html` | Not-found page (GitHub Pages picks it up automatically) |
| `CNAME` | Tells GitHub Pages to serve at `scottchanatry.com` |
| `robots.txt` | Allows crawling, points to the sitemap |
| `sitemap.xml` | One-URL sitemap for Search Console |

## Before deploying

Open `index.html` and search for `TODO` — three fill-ins:

1. **Email** in the footer (or keep `hello@scottchanatry.com` and turn on
   Porkbun's free email forwarding for the domain).
2. **LinkedIn URL** — add it to the JSON-LD `sameAs` array *and* uncomment the
   Elsewhere list item, once the LinkedIn profile links back to this site.
3. **`headshot.jpg`** — drop a real photo (~1200×630) in this folder. It feeds
   `og:image` and the schema `image` field.

Preview locally: `python3 -m http.server` in this folder, then open
`http://localhost:8000`.

## Deploy (GitHub Pages + Porkbun DNS)

1. Create a **public repo** (e.g. `scottchanatry.com`) under the
   `scottchanatry` GitHub account and push these files to `main`.
2. Repo → Settings → Pages → Source: `main` branch, root. The `CNAME` file
   sets the custom domain automatically.
3. At **Porkbun** → the domain → DNS, delete the parked-page defaults, then add:
   - `A` records for the apex (`scottchanatry.com`), one per IP:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record: host `www` → `scottchanatry.github.io`
4. Back in GitHub Pages settings, wait for the DNS check, then tick
   **Enforce HTTPS**.

(Alternative: Porkbun's own static hosting can serve the same folder if you'd
rather keep everything in one dashboard — check their current hosting options.)

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
