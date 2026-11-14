import { Badge, Empty, EmptyHeader, EmptyTitle, onWillStart, useState } from "nodexui";
import { t } from "../../i18n/index.js";
import { fmtDate, loadGroups, loadPosts } from "../../assets/js/utils.js";
import { Page } from "../page/page.js";
import { PostCard } from "../post-card/post-card.js";

// Blog list and tag pages: all posts, or only the posts with the tag named in the route.
export class BlogPage extends Page {
  static template = "page.blog";
  static components = { ...Page.components, PostCard, Badge, Empty, EmptyHeader, EmptyTitle };
  fmtDate = fmtDate;
  setup() {
    this.state = useState({ posts: [], tags: [], groups: [] });
    onWillStart(async () => {
      const all = await loadPosts();
      const groups = await loadGroups();
      this.state.groups = groups;
      this.groupTitle = groups.find((g) => g.path === this.group)?.title;
      this.state.tags = [...new Map(all.flatMap((p) => p.tags).map((tg) => [tg.slug, tg])).values()];
      this.state.posts = all.filter((p) => (!this.tag || p.tags.some((tg) => tg.slug === this.tag)) && (!this.group || p.slug.startsWith(`${this.group}/`)));
    });
  }
  get tag() {
    return this.props.route.tag || "";
  }
  // Splits the shown posts into one section per group that holds posts directly (root posts first), each titled by its group path.
  get sections() {
    const title = (path) => this.state.groups.filter((g) => path === g.path || path.startsWith(`${g.path}/`)).sort((a, b) => a.path.length - b.path.length).map((g) => g.title).join(" / ");
    const paths = [...new Set(this.state.posts.map((p) => p.group))].sort();
    return paths.map((path) => ({ path, title: path && title(path), posts: this.state.posts.filter((p) => p.group === path) }));
  }
  get group() {
    return this.props.route.group || "";
  }
  get heading() {
    if (this.groupTitle) return this.groupTitle;
    const found = this.state.tags.find((tg) => tg.slug === this.tag);
    return found ? t("Posts tagged “{tag}”", { tag: found.label }) : t("The Base blog");
  }
  get seoTitle() {
    return this.tag || this.group ? t("{title} | The Base", { title: this.heading }) : t("Blog | The Base");
  }
  get feedHref() {
    return t("/blog/feed.xml");
  }
}
