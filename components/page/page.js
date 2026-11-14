import { Component, Button, Card, CardBody, CardDescription, CardTitle, Typography } from "nodexui";
import { items, links } from "../../assets/js/content.js";
import { t } from "../../i18n/index.js";
import { ProductCard } from "../product-card/product-card.js";
import { ProductRow } from "../product-row/product-row.js";
import { Seo } from "../seo/seo.js";

// Base for every page: gives it the translate function, product data and links.
export class Page extends Component {
  static components = { ProductCard, ProductRow, Seo, Button, Card, CardBody, CardDescription, CardTitle, Typography };
  static props = { route: Object };
  t = t;
  links = links;
  items = items;
}
