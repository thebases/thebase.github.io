import { Component } from "nodexui";
import { currentLanguage } from "../../i18n/index.js";

const SITE = "https://thebase.vn";
const DEFAULT_IMAGE = `${SITE}/assets/img/icon-512x512.png`;

// Writes one <meta> tag in <head> (found by name or property), or removes it when there is no value.
function setTag(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) return el?.remove();
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.append(el);
  }
  el.setAttribute("content", content);
}

// Writes the canonical <link> in <head>, or removes it when there is no address.
function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) return el?.remove();
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.append(el);
  }
  el.href = href;
}

// Writes the page's JSON-LD block (what search engines read as structured data), or removes it for plain pages.
function setJsonLd(data) {
  let el = document.getElementById("seo-jsonld");
  if (!data) return el?.remove();
  if (!el) {
    el = document.createElement("script");
    el.id = "seo-jsonld";
    el.type = "application/ld+json";
    document.head.append(el);
  }
  el.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
}

// Draws nothing; sets the page's SEO head tags (title, description, keywords, robots, Open Graph, Twitter, JSON-LD) from its props.
// Every page renders one, and each run rewrites the whole set, so tags from the previous page never linger.
export class Seo extends Component {
  static template = "site.seo";
  static props = { title: String, description: String, "keywords?": Array, "image?": String, "canonical?": String, "noindex?": Boolean, "lang?": String, "article?": Object };
  setup() {
    const { title, description, keywords = [], image = DEFAULT_IMAGE, canonical, noindex, article } = this.props;
    const lang = this.props.lang ?? currentLanguage();
    document.title = title;
    document.documentElement.lang = lang;
    setTag("name", "description", description);
    setTag("name", "keywords", keywords.join(", "));
    setTag("name", "robots", noindex ? "noindex, follow" : "index, follow");
    setCanonical(canonical);
    setTag("property", "og:type", article ? "article" : "website");
    setTag("property", "og:locale", lang);
    setTag("property", "og:title", title);
    setTag("property", "og:description", description);
    setTag("property", "og:url", canonical ?? location.href);
    setTag("property", "og:image", image);
    setTag("name", "twitter:card", image === DEFAULT_IMAGE ? "summary" : "summary_large_image");
    setTag("name", "twitter:title", title);
    setTag("name", "twitter:description", description);
    setTag("name", "twitter:image", image);
    setJsonLd(article && { "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description, inLanguage: lang, image, datePublished: article.published, dateModified: article.modified ?? article.published, author: { "@type": "Organization", name: article.author }, publisher: { "@type": "Organization", name: "The Base", logo: { "@type": "ImageObject", url: DEFAULT_IMAGE } }, keywords: keywords.join(", ") });
  }
}
