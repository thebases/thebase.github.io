// Loads every component template (<name>/<name>.xml next to <name>/<name>.js) as one <templates> body.
const FILES = ["app", "blog-page", "home-page", "language-switcher", "post-card", "post-page", "product-card", "product-row", "products-page", "seo", "site-footer", "site-header"];

/** Removes the outer <templates> tag so several template files can share one root. */
const stripTemplatesWrapper = (xml) => xml.replace(/^\s*<templates[^>]*>/, "").replace(/<\/templates>\s*$/, "");

/** Fetches all component template files in parallel and returns them merged without a wrapper. */
export async function loadComponentTemplates() {
  const files = await Promise.all(FILES.map((n) => fetch(new URL(`./${n}/${n}.xml`, import.meta.url)).then((r) => r.text())));
  return files.map(stripTemplatesWrapper).join("");
}
