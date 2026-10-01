import { create } from "zustand";

type OnboardingState = {
  language: string | null;
  level: number;
  hebrewReading: string | null;
  reasons: string[];
  startPath: string | null;
  completed: boolean;
  setLanguage: (id: string) => void;
  clearLanguage: () => void;
  setLevel: (level: number) => void;
  setHebrewReading: (id: string) => void;
  toggleReason: (id: string) => void;
  setStartPath: (id: string) => void;
  complete: () => void;
  restore: (answers: OnboardingAnswers) => void;
  reset: () => void;
};

export type OnboardingAnswers = Pick<
  OnboardingState,
  "language" | "level" | "hebrewReading" | "reasons" | "startPath" | "completed"
>;

const initialAnswers: OnboardingAnswers = {
  language: null,
  level: 3,
  hebrewReading: null,
  reasons: [],
  startPath: "shema",
  completed: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialAnswers,
  setLanguage: (id) => set({ language: id }),
  clearLanguage: () => set({ language: null }),
  setLevel: (level) => set({ level }),
  setHebrewReading: (id) => set({ hebrewReading: id }),
  toggleReason: (id) =>
    set((state) => ({
      reasons: state.reasons.includes(id)
        ? state.reasons.filter((reason) => reason !== id)
        : [...state.reasons, id],
    })),
  setStartPath: (id) => set({ startPath: id }),
  complete: () => set({ completed: true }),
  restore: (answers) => set(answers),
  reset: () => set(initialAnswers),
}));
