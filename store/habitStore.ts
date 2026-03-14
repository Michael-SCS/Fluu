import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"



export type Habit = {

  id: string

  title: string

  description: string

  icon: string

  startDate: string

  goal: number

  progress: number

  streak: number

  repeat: "once" | "daily" | "weekly" | "monthly" | "yearly"

  weekDays?: number[]

  month?: number

  completedDates: string[]

}



type HabitStore = {

  habits: Habit[]

  lastProgressReset: string

  addHabit: (habit: Habit) => void

  incrementHabitProgress: (habitId: string) => void

  resetDailyProgress: () => void

}



const getToday = () => {
  return new Date().toISOString().split("T")[0]
}



export const useHabitStore = create<HabitStore>()(

  persist(

    (set, get) => ({

      habits: [],

      lastProgressReset: getToday(),



      addHabit: (habit) =>
        set((state) => ({
          habits: [...state.habits, habit],
        })),



      incrementHabitProgress: (habitId) =>
        set((state) => ({

          habits: state.habits.map((habit) => {

            if (habit.id !== habitId) return habit

            let progress = habit.progress + 1

            if (progress > habit.goal) progress = habit.goal

            return {
              ...habit,
              progress
            }

          })

        })),



      resetDailyProgress: () => {

        const today = getToday()

        const lastReset = get().lastProgressReset

        if (today === lastReset) return



        const habits = get().habits.map((habit) => ({
          ...habit,
          progress: 0
        }))



        set({
          habits,
          lastProgressReset: today
        })

      }

    }),

    {
      name: "fluu-habits-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }

  )

)