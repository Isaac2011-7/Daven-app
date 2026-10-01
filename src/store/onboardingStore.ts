import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingState = {
  level: number;
  hebrewReading: string | null;
  reasons: string[];
  startPath: string | null;
  completedUserIds: string[];
  hasHydrated: boolean;
  setLevel: (level: number) => void;
  setHebrewReading: (id: string) => void;
  toggleReason: (id: string) => void;
  setStartPath: (id: string) => void;
  complete: (userId: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      level: 3,
      hebrewReading: null,
      reasons: [],
      startPath: "shema",
      completedUserIds: [],
      hasHydrated: false,
      setLevel: (level) => set({ level }),
      setHebrewReading: (id) => set({ hebrewReading: id }),
      toggleReason: (id) =>
        set((state) => ({
          reasons: state.reasons.includes(id)
            ? state.reasons.filter((reason) => reason !== id)
            : [...state.reasons, id],
        })),
      setStartPath: (id) => set({ startPath: id }),
      complete: (userId) =>
        set((state) => ({
          completedUserIds: state.completedUserIds.includes(userId)
            ? state.completedUserIds
            : [...state.completedUserIds, userId],
        })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "onboarding",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ completedUserIds: state.completedUserIds }),
      onRehydrateStorage: (state) => () => state.setHasHydrated(true),
    },
  ),
);
