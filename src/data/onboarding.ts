export const ONBOARDING_TOTAL_STEPS = 5;

export type Level = {
  value: number;
  label: string;
  title: string;
  description: string;
  /** How well someone at this level reads Hebrew (an id from hebrewOptions) */
  suggestedHebrew: string;
};

export const levels: Level[] = [
  {
    value: 1,
    label: "Brand new",
    title: "Brand new",
    suggestedHebrew: "not-yet",
    description: "I've never prayed from a siddur.",
  },
  {
    value: 2,
    label: "Beginner",
    title: "Beginner",
    suggestedHebrew: "few-letters",
    description: "I've been to shul a few times but feel lost.",
  },
  {
    value: 3,
    label: "Intermediate",
    title: "Intermediate",
    suggestedHebrew: "slowly",
    description: "I know some prayers, like the Shema and a few blessings.",
  },
  {
    value: 4,
    label: "Advanced",
    title: "Advanced",
    suggestedHebrew: "fluently",
    description: "I daven regularly and want to understand more.",
  },
  {
    value: 5,
    label: "Fluent",
    title: "Fluent",
    suggestedHebrew: "fluently",
    description: "I follow the whole service and lead parts of it.",
  },
];

export type HebrewOption = {
  id: string;
  hebrew: string;
  title: string;
  description: string;
};

export const hebrewOptions: HebrewOption[] = [
  { id: "not-yet", hebrew: "?", title: "Not yet", description: "Start me with the letters" },
  { id: "few-letters", hebrew: "א ב", title: "A few letters", description: "I recognize some" },
  { id: "slowly", hebrew: "שָׁלוֹם", title: "Yes, slowly", description: "I sound words out" },
  { id: "fluently", hebrew: "בָּרוּךְ אַתָּה", title: "Yes, fluently", description: "I read with vowels" },
];

export type ReasonOption = { id: string; label: string };

export const reasonOptions: ReasonOption[] = [
  { id: "shul", label: "Feel at home in shul" },
  { id: "bar-mitzvah", label: "Prepare for a Bar or Bat Mitzvah" },
  { id: "conversion", label: "Part of my conversion journey" },
  { id: "family", label: "Connect with family traditions" },
  { id: "daily", label: "A daily spiritual practice" },
  { id: "holidays", label: "Get ready for the holidays" },
];

export type StartPath = {
  id: string;
  title: string;
  description: string;
  hebrew?: string;
  badge?: string;
};

export const startPaths: StartPath[] = [
  {
    id: "morning-blessings",
    title: "Morning Blessings",
    description: "Modeh Ani and the first words of the day",
    hebrew: "מוֹדֶה אֲנִי",
  },
  {
    id: "shema",
    title: "The Shema",
    description: "The central line of Jewish prayer",
    hebrew: "שְׁמַע",
    badge: "BEST START",
  },
  {
    id: "shabbat",
    title: "Shabbat",
    description: "Candles, Kiddush and Lecha Dodi",
    hebrew: "שַׁבָּת",
  },
  {
    id: "kaddish",
    title: "Mourner's Kaddish",
    description: "Said in memory of a loved one",
    hebrew: "קַדִּישׁ",
  },
  {
    id: "pick-for-me",
    title: "Not sure, pick for me",
    description: "We'll build a path from your answers",
  },
];
