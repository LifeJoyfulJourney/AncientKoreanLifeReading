# Ancient Korean Life Reading

Phase 5 static website for a premium Korean symbolic annual reading experience inspired by traditional Tojeong Bigyeol.

This project currently includes:

- Static `index.html`
- Responsive `styles.css`
- Vanilla `app.js`
- Custom SVG logo, hero symbol, and background pattern
- Full 144-gua JSON database at `data/tojeong-gua.json`
- Browse and search system for all 144 symbols
- Traditional upper/middle/lower gua calculation from birth form input
- Solar and lunar input support using embedded offline lunar calendar data
- Result preview system for calculated or selected browse-card readings
- SEO metadata and structured data
- Accessibility, mobile, and production polish
- Upgraded Monthly Reading cards with current-month highlight
- About, Privacy, and Contact trust pages
- Premium locked cards without payment integration

No backend, React, npm build step, or payment system is included in Phase 5.

## Run locally

Serve the directory with a simple static server so `fetch()` can load the JSON database:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Deploy to Cloudflare Pages

1. Push this folder to GitHub.
2. In Cloudflare Pages, create a new project from the GitHub repository.
3. Use these settings:
   - Framework preset: None
   - Build command: leave blank
   - Build output directory: `/`
4. Deploy.

## Phase 2 notes

- Full 144-gua database added.
- Browse/search system added.
- Database interpretations are original English adaptations and should be reviewed before commercial launch.

## Phase 3 notes

- Traditional calculation logic added.
- Solar and lunar input supported.
- Korean age uses converted lunar birth year.
- Calculation uses upper/middle/lower gua formula.
- The result maps to one of the 144 database records.
- Known limitation: Before commercial launch, the lunar conversion and ganji calculations should be tested against additional trusted Korean calendar and Tojeong Bigyeol references.

## Phase 4 notes

- Launch polish complete.
- Mobile optimized for small-screen form, result, and browse layouts.
- SEO metadata, Open Graph, Twitter card, canonical URL, and Schema.org structured data added.
- Accessibility improved with stronger focus states, live status messaging, semantic trust sections, and reduced-motion support.
- Production deployment ready for Cloudflare Pages as a static site.
- Remaining recommendation: continue validating calculation logic against trusted Korean calendar and Tojeong Bigyeol references.

## Phase 5 notes

- Monthly Reading upgraded.
- Current month auto-highlight added.
- About / Privacy / Contact pages created.
- AdSense readiness improved with privacy, contact, disclaimer, and trust signals.
- Trust pages added for cultural context and user confidence.

## Sitemap notes

For launch, add a root-level `sitemap.xml` with the production URL and include the main page plus About, Privacy, and Contact pages.

## Next phase

Phase 5 can add premium packaging, payment integration, and commercial QA after the calendar logic has been reviewed against trusted references.
