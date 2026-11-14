import { Component, Separator, Typography } from "nodexui";
import { links } from "../../assets/js/content.js";
import { t } from "../../i18n/index.js";

// Bottom bar with contact and licence notes.
export class SiteFooter extends Component {
  static template = "site.Footer";
  static props = {};
  static components = { Separator, Typography };
  t = t;
  links = links;
}
