import { Alert, AlertDescription, Avatar, Badge, Empty, EmptyHeader, EmptyTitle, Markdown, Separator, onMounted, onWillStart, onWillUnmount, useState } from "nodexui";
import { fmtDate, loadPosts, postBody } from "../../assets/js/utils.js";
import { Page } from "../page/page.js";

// One blog post: metadata from posts.json, body rendered by the Nodex Markdown component.
export class PostPage extends Page {
  static template = "page.post";
  static components = { ...Page.components, Alert, AlertDescription, Avatar, Badge, Empty, EmptyHeader, EmptyTitle, Markdown, Separator };
  fmtDate = fmtDate;
  setup() {
    this.state = useState({ post: null, body: null, toc: [] });
    onMounted(() => this.watchHeadings());
    onWillUnmount(() => this.observer?.disconnect());
    onWillStart(async () => {
      const slug = this.props.route.slug;
      const post = (await loadPosts()).find((p) => p.slug === slug);
      if (!post) return;
      this.state.post = post;
      this.state.body = postBody(await (await fetch(`/blog/${slug}/${post.file}`)).text(), slug);
    });
  }
  // SEO props for the shown post: hand-written front matter values, else the post's own title, description, tags and cover.
  get article() {
    const { post } = this.state;
    return { title: post.title, published: post.date, modified: post.updated, author: post.author };
  }
  // Rebuilds the "On this page" list whenever the Markdown component finishes drawing the post.
  watchHeadings() {
    const body = document.querySelector(".post-body");
    if (!body) return;
    this.observer = new MutationObserver(() => this.collectHeadings(body));
    this.observer.observe(body, { childList: true, subtree: true });
    this.collectHeadings(body);
  }
  // Gives every h2/h3 an id and stores its text and level for the side menu.
  collectHeadings(body) {
    const toc = [...body.querySelectorAll("h2, h3")].map((h, i) => {
      h.id = `sec-${i}`;
      return { id: h.id, text: h.textContent, level: h.tagName === "H3" ? 3 : 2 };
    });
    if (toc.length !== this.state.toc.length || toc.some((x, i) => x.text !== this.state.toc[i].text)) this.state.toc = toc;
  }
  // Scrolls to a section without touching the address hash, which the router owns.
  goTo(ev, id) {
    ev.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
