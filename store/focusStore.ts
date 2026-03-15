import { create } from "zustand";

export type FocusActivity = {
  id: string;
  title: string;
  description?: string;
  duration: number;
  breakTime: number;
  sessions: number;
  usageCount: number;
};

type FocusStore = {
  activities: FocusActivity[];

  addActivity: (activity: FocusActivity) => void;

  increaseUsage: (id: string) => void;

  deleteActivity: (id: string) => void;
};

export const useFocusStore = create<FocusStore>((set) => ({

  activities: [],

  addActivity: (activity) =>
    set((state) => ({
      activities: [...state.activities, activity],
    })),

  deleteActivity: (id) =>
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id)
    })),

  increaseUsage: (id) =>
    set((state) => ({
      activities: state.activities.map((focus) => {

        if (focus.id !== id) return focus;

        return {
          ...focus,
          usageCount: focus.usageCount + 1
        };

      })
    }))

}));
