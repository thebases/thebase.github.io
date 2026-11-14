# Changelog

All notable changes to the The Base landing site (`thebase.vn`) are documented in this file.

## [Unreleased]

### Added
- Landing page (`index.html`) and products page (`products.html`) in English, plus Vietnamese pages under `vi/` with a language switcher and hreflang links; built with pure Nodex UI (`nodexui@1.3.4`, no build step) in `assets/`
- Products page listing Nodex UI, Base HUB, EMVHUB, Base Remote, APDU Sender and 2qr.app
- SEO files: `sitemap.xml`, `robots.txt`, Open Graph and JSON-LD tags; `CNAME` for `thebase.vn`
- Offline shell: `sw.js`, `manifest.webmanifest` and `version.json` (open tabs reload on a new deploy)
- GitHub Pages workflow `.github/workflows/pages.yml` (triggers on `master`, stamps `version.json` on each deploy)
- `Makefile` with `make serve [PORT=8080]` to run the site locally

### Pending
- DNS for `thebase.vn`, enabling Pages and HTTPS in the repo settings
- Native review of the Vietnamese copy
- Lighthouse run (target 90 or higher) after the first deploy
