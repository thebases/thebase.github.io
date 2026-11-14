// Builds the blog data from blog/[<group>/...]<slug>/index.<lang>.md: the post list JSON and one RSS feed per language.
// The pages themselves are rendered in the browser by index.html. No dependencies. Run with `make blog`; CI runs it before every deploy.
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://thebase.vn";
const LANGS = ["en", "vi"];
// Every post is published under the same author (a brand name, not translated).
const AUTHOR = "The Base";
// Top-level folder names that are routes (#/blog/tag/..., #/blog/group/...), so they cannot hold posts.
const RESERVED = ["tag", "group"];
// Social preview image used when a post has no `seo_image` or `cover`.
const DEFAULT_IMAGE = `${SITE}/assets/img/icon-512x512.png`;

// Escapes text so it is safe inside HTML or XML.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Turns a tag like "Payments & EMV" into a URL-safe word like "payments-emv".
const slugify = (s) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Feed path for a language: English is blog/feed.xml, others blog/feed.<lang>.xml (no per-language folders).
const feedPath = (lang) => (lang === "en" ? "blog/feed.xml" : `blog/feed.${lang}.xml`);
// Public address of a post: the site is one page, so posts are hash routes and the language is a ?lang= parameter.
const postUrl = (lang, slug) => `${SITE}/?lang=${lang}#/blog/${slug}`;

// Feed title and description per language (the feed is built outside the browser, so it cannot use t()).
const FEED_TEXT = {
  en: { title: "The Base blog", description: "News, release notes and engineering notes on payments, ERP and AI from The Base community." },
  vi: { title: "Blog The Base", description: "Tin tức, ghi chú phát hành và ghi chú kỹ thuật về thanh toán, ERP và AI từ cộng đồng The Base." },
};

// Splits a markdown file into its simple "key: value" front matter and the body text.
function parseFrontMatter(text, file) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const v = kv[2].trim();
    meta[kv[1]] = v.startsWith("[") ? v.slice(1, -1).split(",").map((t) => t.trim()).filter(Boolean) : v === "true" ? true : v === "false" ? false : v.replace(/^["']|["']$/g, "");
  }
  for (const key of ["title", "description", "date"]) if (!meta[key]) throw new Error(`${file}: front matter needs "${key}"`);
  if (Number.isNaN(Date.parse(meta.date))) throw new Error(`${file}: bad date "${meta.date}"`);
  if (meta.position !== undefined && !Number.isFinite(Number(meta.position))) throw new Error(`${file}: bad position "${meta.position}"`);
  return meta;
}

// Reads the optional hand-written SEO fields of a post (seo_title, seo_description, seo_keywords, seo_image, seo_canonical, seo_noindex).
// Anything left out is filled in later from the post itself: title, description, tags, cover.
function readSeo(meta, path) {
  const image = meta.seo_image ?? meta.cover;
  return {
    title: meta.seo_title ?? `${meta.title} | The Base`,
    description: meta.seo_description ?? meta.description,
    keywords: meta.seo_keywords ?? meta.tags ?? [],
    image: !image ? DEFAULT_IMAGE : /^https?:\/\//.test(image) ? image : `${SITE}/blog/${path}/${image}`,
    canonical: meta.seo_canonical,
    noindex: meta.seo_noindex === true,
  };
}

// Reads one post folder (blog/<path>) into a record holding all of its translations; null if it has no published file.
async function loadPost(path) {
  const post = { slug: path, group: posix.dirname(path) === "." ? "" : posix.dirname(path), author: AUTHOR, langs: {}, tags: [] };
  for (const lang of LANGS) {
    const file = `index.${lang}.md`;
    const text = await readFile(join(ROOT, "blog", path, file), "utf8").catch(() => null);
    if (text === null) continue;
    const meta = parseFrontMatter(text, `blog/${path}/${file}`);
    if (meta.draft) continue;
    post.langs[lang] = { title: meta.title, description: meta.description, file, seo: readSeo(meta, path) };
    post.date = post.date ?? meta.date;
    post.updated = post.updated ?? meta.updated;
    post.position = post.position ?? (meta.position === undefined ? undefined : Number(meta.position));
    post.cover = post.cover ?? meta.cover;
    post.tags = post.tags.length ? post.tags : (meta.tags ?? []).map((label) => ({ label, slug: slugify(label) }));
  }
  return Object.keys(post.langs).length ? post : null;
}

// Walks blog/ recursively: a folder holding index.<lang>.md is a post, any other folder is a group of posts and groups.
// A group's optional group.json maps language to title, e.g. {"en": "UI", "vi": "Giao diện"}; the folder name is the fallback.
async function walk(path, posts, groups) {
  const entries = await readdir(join(ROOT, "blog", path), { withFileTypes: true });
  const isPost = entries.some((e) => e.isFile() && LANGS.some((l) => e.name === `index.${l}.md`));
  if (isPost) {
    const post = await loadPost(path);
    if (post) posts.push(post);
    return;
  }
  if (path) {
    const titles = JSON.parse(await readFile(join(ROOT, "blog", path, "group.json"), "utf8").catch(() => "{}"));
    groups.push({ path, parent: posix.dirname(path) === "." ? "" : posix.dirname(path), titles: Object.fromEntries(LANGS.map((l) => [l, titles[l] ?? posix.basename(path)])) });
  }
  for (const e of entries.filter((e) => e.isDirectory() && !/^[_.]/.test(e.name) && !(path === "" && RESERVED.includes(e.name)))) await walk(posix.join(path, e.name), posts, groups);
}

// Reads every non-draft post and every group under blog/, posts newest first by `date`, then by `position` descending; a post without `position` goes last among its date.
async function loadBlog() {
  const posts = [];
  const groups = [];
  await walk("", posts, groups);
  return { posts: posts.sort((a, b) => b.date.localeCompare(a.date) || (b.position ?? -Infinity) - (a.position ?? -Infinity) || 0), groups: groups.filter((g) => posts.some((p) => p.slug.startsWith(`${g.path}/`))) };
}

// Writes a file, creating its folder first.
async function write(rel, text) {
  await mkdir(dirname(join(ROOT, rel)), { recursive: true });
  await writeFile(join(ROOT, rel), text);
}

// RSS 2.0 feed with the posts that exist in this language.
function feed(lang, posts) {
  const items = posts.filter((p) => p.langs[lang]).map((p) => {
    const url = postUrl(lang, p.slug);
    return `    <item><title>${esc(p.langs[lang].title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><dc:creator>${esc(p.author)}</dc:creator><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.langs[lang].description)}</description>${p.tags.map((t) => `<category>${esc(t.label)}</category>`).join("")}</item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(FEED_TEXT[lang].title)}</title>
    <link>${SITE}/?lang=${lang}#/blog</link>
    <description>${esc(FEED_TEXT[lang].description)}</description>
    <language>${lang}</language>
    <atom:link href="${SITE}/${feedPath(lang)}" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;
}

// Runs the whole build.
async function main() {
  const { posts, groups } = await loadBlog();
  await write("blog/posts.json", JSON.stringify({ posts, groups }, null, 2) + "\n");
  for (const lang of LANGS) await write(feedPath(lang), feed(lang, posts));
  console.log(`blog: ${posts.length} posts, ${groups.length} groups, ${LANGS.length} languages`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
