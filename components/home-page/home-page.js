import { onMounted } from "nodexui";
import { items } from "../../assets/js/content.js";
import { Page } from "../page/page.js";

// Landing page: hero, featured products and contact call to action.
export class HomePage extends Page {
  static template = "page.home";
  setup() {
    onMounted(() => this.props.route.contact && document.getElementById("contact")?.scrollIntoView());
  }
  get featured() {
    return items.filter((i) => i.featured);
  }
}
