import { create } from "zustand";

type OnboardingState = {
  level: number;
  hebrewReading: string | null;
  reasons: string[];
  startPath: string | null;
  completed: boolean;
  setLevel: (level: number) => void;
  setHebrewReading: (id: string) => void;
  toggleReason: (id: string) => void;
  setStartPath: (id: string) => void;
  complete: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  level: 3,
  hebrewReading: null,
  reasons: [],
  startPath: "shema",
  completed: false,
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
}));
