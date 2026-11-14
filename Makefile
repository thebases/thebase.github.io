PORT ?= 8080

.PHONY: run blog

# Builds the post list and RSS feeds from blog/*/index.<lang>.md.
blog:
	node scripts/build-blog.mjs

# Serves the site at http://localhost:$(PORT)/ (root-absolute paths need the site at the domain root).
run: blog
	node scripts/serve.mjs $(PORT)
