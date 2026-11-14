import { loadCatalog, t } from "../../i18n/index.js";

// Fetches the Vietnamese texts before the product texts below are wrapped in t().
await loadCatalog(import.meta.url);

// Product data. Texts are written in English and translated here with t() from i18n/index.js (catalog: i18n/vi.po).
export const links = {
  github: "https://github.com/thebases",
  hub: "https://github.com/thebases/base-hub",
  remote: "https://ui.thebase.vn/remote-controller-server/",
  apdu: "https://github.com/thebases/base-apdu",
  nodex: "https://www.npmjs.com/package/nodexui",
  emvhub: "https://emvhub.com",
  qr: "https://2qr.app",
  mail: "mailto:community@thebase.vn",
};

export const items = [
  {
    id: "nodexui", name: "Nodex UI", tag: t("UI"), featured: true,
    value: t("HTML-first UI components. Add a CDN link, no build step."),
    image: { src: "/assets/img/products/nodexui.svg", alt: t("Nodex UI home page: UI components with no build step, with docs links and the npm install command"), width: 1682, height: 856 },
    cta: t("View on npm"), href: links.nodex,
  },
  {
    id: "base-hub", name: "Base HUB", tag: t("Platform"), featured: true,
    value: t("A modular business platform that AI can build on: data models, workflows and UI defined as data, exposed to AI through MCP."),
    image: { src: "/assets/img/products/base-hub.svg", alt: t("Base HUB admin workspace with menu sidebar, partner, user, site and page counts, and quick links"), width: 1897, height: 857 },
    cta: t("View on GitHub"), href: links.hub,
  },
  {
    id: "emvhub", name: "EMVHUB", tag: t("Payments"), featured: true,
    value: t("A wiki for EMV knowledge: learn how chip card payments work."),
    image: { src: "/assets/img/products/emvhub.svg", alt: t("EMVHUB home page: practical EMV engineering with terminal, EMV kernel, issuer, TLV data, EMV QR and backend diagrams"), width: 1660, height: 741 },
    cta: t("Read the wiki"), href: links.emvhub,
  },
  {
    id: "base-remote", name: "Base Remote", tag: t("Devices"), featured: true,
    value: t("Open-source remote support for Android devices: see and control a phone from your browser."),
    image: { src: "/assets/img/products/base-remote.svg", alt: t("Base Remote console: enter the Session ID and password from the mobile device to start controlling it"), width: 1688, height: 862 },
    cta: t("Open Base Remote"), href: links.remote,
  },
  {
    id: "apdu-sender", name: "APDU Sender", tag: t("Payments"),
    value: t("Turn an NFC phone into a contactless reader for EMV, Apple VAS and Google Smart Tap testing."),
    image: { src: "/assets/img/products/apdu-sender.svg", alt: t("APDU Sender: an NFC phone sends APDU commands to EMV, Apple VAS, Google Smart Tap, MIFARE, FeliCa and Java Card cards, with a decoded TLV response console"), width: 1688, height: 862 },
    cta: t("View on GitHub"), href: links.apdu,
  },
  {
    id: "2qr", name: "2qr.app", tag: t("Tools"),
    value: t("A QR code tool on the web."),
    image: { src: "/assets/img/products/2qr.svg", alt: t("2qr.app QR code generator with VietQR form, live preview and download options"), width: 1260, height: 770 },
    cta: t("Open 2qr.app"), href: links.qr,
  },
];
