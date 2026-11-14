# Changelog

All notable changes to the The Base landing site (`thebase.vn`) are documented in this file.

## [Unreleased]

### Added
- Single-page site (`index.html`, hash routes `#/`, `#/products`, `#/contact`) in English and Vietnamese, one component per folder in `components/`, language files in `i18n/` (`?lang=` switcher, hreflang links); built with pure Nodex UI (`nodexui@1.3.5`, no build step)
- Blog: posts in `blog/<slug>/index.<lang>.md`, `scripts/build-blog.mjs` generates `blog/posts.json` and an RSS feed per language, pages at `#/blog`, `#/blog/tag/<tag>` and `#/blog/<slug>` (`make blog`, run by CI before deploy)
- Products page listing Nodex UI, Base HUB, EMVHUB, Base Remote, APDU Sender and 2qr.app
- SEO files: `sitemap.xml`, `robots.txt`, Open Graph and JSON-LD tags; `CNAME` for `thebase.vn`
- Offline shell: `sw.js`, `manifest.webmanifest` and `version.json` (open tabs reload on a new deploy)
- GitHub Pages workflow `.github/workflows/pages.yml` (triggers on `master`, stamps `version.json` on each deploy)
- `Makefile` with `make run [PORT=8080]` and `make blog` to run the site locally

### Pending
- DNS for `thebase.vn`, enabling Pages and HTTPS in the repo settings
- Native review of the Vietnamese copy
- Lighthouse run (target 90 or higher) after the first deploy
