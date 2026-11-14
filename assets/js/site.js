import { Component, mount } from "nodexui";
import { Badge, Button, Card, CardBody, CardDescription, CardTitle, ThemeButton } from "nodexui";
import { content } from "./content.js";

// Reloads open pages when a new version is deployed, and registers the offline service worker.
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.addEventListener("message", (e) => e.data === "version-changed" && location.reload());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) navigator.serviceWorker.controller?.postMessage("check-version");
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => console.error("Service worker registration failed", err));
  });
}

// Top bar with logo, navigation, language switch and theme button.
class SiteHeader extends Component {
  static template = "site.Header";
  static components = { Button, ThemeButton };
}

// Bottom bar with contact and licence notes.
class SiteFooter extends Component {
  static template = "site.Footer";
}

// One product tile: monogram, name, tag, one-line value and a link out.
class ProductCard extends Component {
  static template = "site.ProductCard";
  static components = { Badge, Button, Card, CardBody, CardDescription, CardTitle };
}

// Base for both pages: picks the copy for the page language from the <div id="app"> attributes.
class Page extends Component {
  static components = { SiteHeader, SiteFooter, ProductCard, Button };
  get c() {
    return content[document.getElementById("app").dataset.lang];
  }
  get featured() {
    return this.c.items.filter((i) => i.featured);
  }
}

// Landing page: hero, featured products and contact call to action.
class HomePage extends Page {
  static template = "page.home";
}

// Product catalogue: one card per product, each linking straight to the product.
class ProductsPage extends Page {
  static template = "page.products";
}

const pages = { home: HomePage, products: ProductsPage };

// Removes the outer <templates> tag so several template files can share one root.
const stripTemplatesWrapper = (xml) => xml.replace(/^\s*<templates[^>]*>/, "").replace(/<\/templates>\s*$/, "");

// Loads Nodex UI templates plus ours, then renders the page named in data-page.
async function start() {
  const el = document.getElementById("app");
  const [nodex, site] = await Promise.all([
    fetch(import.meta.resolve("nodexui/templates")).then((r) => r.text()),
    fetch(new URL("./site.xml", import.meta.url)).then((r) => r.text()),
  ]);
  const templates = `<templates>${stripTemplatesWrapper(nodex)}${stripTemplatesWrapper(site)}</templates>`;
  await mount(pages[el.dataset.page], el, { templates });
  if (el.dataset.page === "home") forceDark();
}

// The home page is dark only, even if the visitor saved a light choice on another page.
function forceDark() {
  document.documentElement.setAttribute("b-theme", "dark");
  document.documentElement.dataset.bsTheme = "dark";
}

registerServiceWorker();
start();
