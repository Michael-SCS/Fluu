import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type Habit = {

  id: string
  name: string
  icon: string

  repeatType: "daily" | "weekly" | "once"
  repeatConfig?: number[]

  startDate: string

  completedDates: string[]

  streak: number

  goal?: number
  progress?: number
  unit?: string
}

type HabitStore = {

  habits: Habit[]

  lastProgressReset: string

  addHabit: (habit: Habit) => void

  incrementHabitProgress: (habitId: string) => void

  resetDailyProgress: () => void

  isHabitDoneToday: (habit: Habit) => boolean
}


// --------------------------------------------------

const getToday = () => {

  return new Date().toISOString().split("T")[0]

}


// --------------------------------------------------

const calculateStreak = (completedDates: string[]) => {

  const sorted = [...completedDates].sort().reverse()

  let streak = 0

  let current = new Date()

  for (let i = 0; i < sorted.length; i++) {

    const date = new Date(sorted[i])

    const diff =
      Math.floor(
        (current.getTime() - date.getTime()) /
        (1000 * 60 * 60 * 24)
      )

    if (diff === 0) {

      streak++
      current.setDate(current.getDate() - 1)

    }

    else if (diff === 1) {

      streak++
      current.setDate(current.getDate() - 1)

    }

    else {

      break

    }

  }

  return streak
}


// --------------------------------------------------

export const useHabitStore = create<HabitStore>()(

  persist(

    (set, get) => ({

      habits: [],

      lastProgressReset: getToday(),


      // --------------------------------------------------
      // CREAR HÁBITO
      // --------------------------------------------------

      addHabit: (habit) =>
        set((state) => ({
          habits: [...state.habits, habit],
        })),



      // --------------------------------------------------
      // PROGRESO DEL HÁBITO
      // --------------------------------------------------

      incrementHabitProgress: (habitId) =>
        set((state) => {

          const today = getToday()

          const habits = state.habits.map((habit) => {

            if (habit.id !== habitId) return habit

            let progress = habit.progress ?? 0
            const goal = habit.goal ?? 1

            progress++

            let completedDates = [...habit.completedDates]

            if (progress >= goal) {

              if (!completedDates.includes(today)) {

                completedDates.push(today)

              }

            }

            const newStreak = calculateStreak(completedDates)

            return {

              ...habit,

              progress: progress > goal ? goal : progress,

              completedDates,

              streak: newStreak

            }

          })

          return { habits }

        }),



      // --------------------------------------------------
      // RESET DIARIO
      // --------------------------------------------------

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

      },



      // --------------------------------------------------

      isHabitDoneToday: (habit) => {

        const today = getToday()

        return habit.completedDates.includes(today)

      },

    }),

    {
      name: "fluu-habits-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }

  )

)