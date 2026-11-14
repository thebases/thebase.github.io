import { Component } from "nodexui";
import { Button, NavigationMenu, NavigationMenuItem, Separator, ThemeButton } from "nodexui";
import { links } from "../../assets/js/content.js";
import { t } from "../../i18n/index.js";
import { LanguageSwitcher } from "../language-switcher/language-switcher.js";

// Top bar with logo, navigation, language switch and theme button.
export class SiteHeader extends Component {
  static template = "site.Header";
  static components = { Button, LanguageSwitcher, NavigationMenu, NavigationMenuItem, Separator, ThemeButton };
  static props = { page: String };
  t = t;
  links = links;
}
