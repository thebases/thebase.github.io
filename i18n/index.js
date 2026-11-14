import { init } from "nodexui/i18n";

// Sets up the shared Nodex UI i18n service once (languages and where the visitor's choice is saved),
// then hands it to the rest of the site, so every file imports t() and friends from here.
init({
  languages: [
    { code: "en", label: "English" },
    { code: "vi", label: "Tiếng Việt" },
  ],
  storageKey: "thebase-lang",
  catalogDir: "/i18n",
});

export * from "nodexui/i18n";
