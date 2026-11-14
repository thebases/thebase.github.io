import { Component, onMounted, onWillUnmount, useState } from "nodexui";
import { parseRoute } from "../../assets/js/utils.js";
import { SiteFooter } from "../site-footer/site-footer.js";
import { SiteHeader } from "../site-header/site-header.js";
import { HomePage } from "../home-page/home-page.js";
import { ProductsPage } from "../products-page/products-page.js";
import { BlogPage } from "../blog-page/blog-page.js";
import { PostPage } from "../post-page/post-page.js";

const pages = { home: HomePage, products: ProductsPage, blog: BlogPage, post: PostPage };

// The one root: keeps header and footer on screen and swaps the page whenever the address hash changes.
export class App extends Component {
  static template = "site.App";
  static props = {};
  static components = { SiteHeader, SiteFooter, ...pages };
  setup() {
    this.pages = pages;
    this.state = useState({ route: parseRoute() });
    const onHash = () => (this.state.route = parseRoute());
    onMounted(() => addEventListener("hashchange", onHash));
    onWillUnmount(() => removeEventListener("hashchange", onHash));
  }
  // Remounts the page when the address changes, so each page loads its own data.
  get pageKey() {
    return location.hash;
  }
}
