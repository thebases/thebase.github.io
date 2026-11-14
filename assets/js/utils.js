import { currentLanguage } from "../../i18n/index.js";

// Reads the address hash (#/blog/tag/emv, #/blog/group/ui) into page, tag, group and post slug (a post slug may be nested: ui/owl-vs-react).
export function parseRoute() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "blog" && parts[1] === "tag") return { page: "blog", tag: parts[2] || "" };
  if (parts[0] === "blog" && parts[1] === "group") return { page: "blog", group: parts.slice(2).join("/") };
  if (parts[0] === "blog" && parts[1]) return { page: "post", slug: parts.slice(1).join("/") };
  const page = ["products", "blog"].includes(parts[0]) ? parts[0] : "home";
  return { page, contact: parts[0] === "contact" };
}

// Fetches the generated blog data; a missing file (not built yet) fails with a message that names the fix instead of a JSON parse error.
async function blogData() {
  const response = await fetch("/blog/posts.json");
  if (!response.ok) throw new Error(`/blog/posts.json returned ${response.status}: run "make blog" (it is generated, not committed)`);
  return response.json();
}

// Loads the groups, each with its title in the visitor's language.
export async function loadGroups() {
  const { groups } = await blogData();
  return groups.map((g) => ({ ...g, title: g.titles[currentLanguage()] ?? g.titles.en }));
}

// Loads the post list and gives each post the title/summary in the visitor's language (or its fallback language).
export async function loadPosts() {
  const lang = currentLanguage();
  const { posts } = await blogData();
  return posts.map((p) => {
    const shown = p.langs[lang] ? lang : p.langs.en ? "en" : Object.keys(p.langs)[0];
    return { ...p, ...p.langs[shown], translated: shown === lang, shown };
  });
}

// Formats a post date the way readers of the current language expect.
export const fmtDate = (d) => new Date(d).toLocaleDateString(currentLanguage(), { dateStyle: "long" });


// Removes the front matter from a post and points relative image links at the post's own folder.
export function postBody(text, slug) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").replace(/(!\[[^\]]*\]\()(?:\.\/)?(?![a-z][a-z0-9+.-]*:|\/|#)/gi, `$1/blog/${slug}/`);
}
