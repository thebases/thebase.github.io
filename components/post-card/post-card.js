import { Component, AspectRatio, Avatar, Badge, Card, CardBody, CardDescription, CardTitle } from "nodexui";
import { t } from "../../i18n/index.js";

// One blog post tile: cover, date, title, summary and tag links.
export class PostCard extends Component {
  static template = "site.PostCard";
  static components = { AspectRatio, Avatar, Badge, Card, CardBody, CardDescription, CardTitle };
  static props = { post: Object, date: Function };
  t = t;
}
