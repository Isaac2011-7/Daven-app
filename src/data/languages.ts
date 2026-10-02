export type Language = {
  id: string;
  name: string;
  /** The language's name written in that language */
  nativeName: string;
  /** Short code shown on the option card */
  code: string;
};

/** Languages we can explain prayers in. */
export const languages: Language[] = [
  { id: "en", name: "English", nativeName: "English", code: "EN" },
  { id: "es", name: "Spanish", nativeName: "Español", code: "ES" },
  { id: "fr", name: "French", nativeName: "Français", code: "FR" },
  { id: "ru", name: "Russian", nativeName: "Русский", code: "RU" },
  { id: "pt", name: "Portuguese", nativeName: "Português", code: "PT" },
];
