import { Component, AspectRatio, Avatar, Badge, Button, Card, CardBody, CardDescription, CardTitle } from "nodexui";

// One product tile: monogram, name, tag, one-line value and a link out.
export class ProductCard extends Component {
  static template = "site.ProductCard";
  static components = { AspectRatio, Avatar, Badge, Button, Card, CardBody, CardDescription, CardTitle };
  static props = { item: Object };
}
