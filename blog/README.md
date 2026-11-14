# Blog authoring

One folder per post; the folder name is the URL slug, shared by every language.
Posts can be grouped in nested folders: a folder with `index.<lang>.md` is a post, any other folder is a group.
The post slug is its path (`blog/ui/owl-vs-react/` is `#/blog/ui/owl-vs-react`); a group page is `#/blog/group/ui`.
Group titles are optional: `blog/<group>/group.json` as `{"en": "UI", "vi": "Giao diện"}` (the folder name is the fallback).
`tag` and `group` cannot be top-level folder names.

```
blog/<slug>/index.en.md   # English (default)
blog/<slug>/index.vi.md   # Vietnamese (optional; the vi blog falls back to English with a badge)
blog/<slug>/cover.png     # images, referenced relatively: ![alt](diagram.svg)
```

Front matter: `title`, `description` (150-160 chars), `date` (`YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`) are required;
`updated`, `position`, `tags: [a, b]`, `cover: cover.png`, `draft: true` are optional.
`position` is a number that breaks ties between posts with the same `date` (highest first); posts without one go last. Posts sort newest first by `date`, then by `position`.
Tags, date and cover are read from the first language file found. Do not put a `# H1` in the body (the page renders the title).

## SEO

The page head (title, description, keywords, robots, Open Graph, Twitter, JSON-LD) is written in the browser by the `Seo` component, so no extra files are generated.
Everything is filled in from the post (`title`, `description`, `tags`, `cover`). To set it by hand, add any of these to the front matter (each language file has its own):

```
seo_title: Custom <title> and og:title (default: "<title> | The Base")
seo_description: Custom meta description (default: description)
seo_keywords: [owl, no build step]     # default: tags
seo_image: https://.../share.png       # or a file in the post folder; default: cover, then the site icon
seo_canonical: https://example.com/original-post   # default: none
seo_noindex: true                      # robots noindex
```

`make blog` (also run by `make run` and CI) generates the post list (`posts.json`) and `feed.xml` per language.
Posts are rendered in the browser at `/#/blog/<slug>`; the language comes from `?lang=` or the visitor's saved choice. Generated files are gitignored.

The author of every post is "The Base"; it is set once in `scripts/build-blog.mjs` (`AUTHOR`), not in front matter.
