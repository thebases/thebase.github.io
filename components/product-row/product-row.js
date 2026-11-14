import { Component, Avatar, Badge, Button, Item } from "nodexui";

// One product as a full-width row: avatar, name with tag, one-line value and a link out.
export class ProductRow extends Component {
  static template = "site.ProductRow";
  static components = { Avatar, Badge, Button, Item };
  static props = { item: Object };
}
