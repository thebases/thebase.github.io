import { mount } from "nodexui";
import { loadCatalog } from "../../i18n/index.js";
import { App } from "../../components/app/app.js";
import { loadComponentTemplates } from "../../components/templates.js";

// Fetches the Vietnamese texts (i18n/vi.po) before anything is drawn; English needs no download.
await loadCatalog(import.meta.url);

/** True when the page runs on the developer's machine rather than the live site. */
const IS_LOCAL = /^(localhost|127\.|\[::1\]$)/.test(location.hostname);

/** Backend origin that receives analytics events: the local helpdesk server during development,
 * the production helpdesk otherwise (the same backend as qr-page). Set to "" to disable collection. */
const BACKEND_URL = IS_LOCAL ? "http://localhost:8388" : "https://helpdesk.thebase.vn";

// Starts cookieless page analytics in the background; a blocked or offline tracker never breaks the site.
async function startAnalytics() {
  if (!BACKEND_URL) return;
  try {
    const { init, visitorContext } = await import("nodexui/analytics");
    init({ backendUrl: BACKEND_URL, captureOnLocalhost: IS_LOCAL, outboundLinks: true, customProperties: visitorContext });
  } catch (err) {
    console.warn("Analytics unavailable", err);
  }
}

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

// Removes the outer <templates> tag so several template files can share one root.
const stripTemplatesWrapper = (xml) => xml.replace(/^\s*<templates[^>]*>/, "").replace(/<\/templates>\s*$/, "");

// Loads Nodex UI templates plus each component's own, then renders the app into #app.
async function start() {
  const [nodex, components] = await Promise.all([
    fetch(import.meta.resolve("nodexui/templates")).then((r) => r.text()),
    loadComponentTemplates(),
  ]);
  const templates = `<templates>${stripTemplatesWrapper(nodex)}${components}</templates>`;
  await mount(App, document.getElementById("app"), { templates });
}

registerServiceWorker();
start();
startAnalytics();
