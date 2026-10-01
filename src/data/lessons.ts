import type { Lesson } from "@/types/learning";

/** The daily davening path, in the order prayers are said each morning. */
export const lessons: Lesson[] = [
  { id: "modeh-ani", title: "Modeh Ani", fullTitle: "Modeh Ani", hebrew: "מוֹדֶה אֲנִי", minutes: 3 },
  {
    id: "netilat-yadayim",
    title: "Netilat Yadayim",
    fullTitle: "Netilat Yadayim",
    hebrew: "נְטִילַת יָדַיִם",
    minutes: 3,
  },
  { id: "shema", title: "Shema", fullTitle: "Shema Yisrael", hebrew: "שְׁמַע", minutes: 4 },
  { id: "amidah", title: "Amidah", fullTitle: "The Amidah", hebrew: "עֲמִידָה", minutes: 6 },
  { id: "ashrei", title: "Ashrei", fullTitle: "Ashrei", hebrew: "אַשְׁרֵי", minutes: 5 },
  { id: "aleinu", title: "Aleinu", fullTitle: "Aleinu", hebrew: "עָלֵינוּ", minutes: 4 },
  { id: "adon-olam", title: "Adon Olam", fullTitle: "Adon Olam", hebrew: "אֲדוֹן עוֹלָם", minutes: 3 },
];
