import { Component } from "nodexui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, Icon } from "nodexui";
import { currentLanguage, languages, setLanguage, t } from "../../i18n/index.js";

// Icon button that opens the list of languages; picking one saves the choice and reloads in it.
export class LanguageSwitcher extends Component {
  static template = "site.LanguageSwitcher";
  static props = {};
  static components = { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, Icon };
  t = t;
  languages = languages();
  current = currentLanguage();
  changeLanguage = (code) => setLanguage(code);
}
