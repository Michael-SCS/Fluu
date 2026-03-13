// --------------------------------------------------
// STORE GLOBAL DE HÁBITOS
// Usamos Zustand para manejar el estado global
// --------------------------------------------------

import { create } from "zustand"

// --------------------------------------------------
// TIPO HABIT
// Define la estructura de cada hábito
// --------------------------------------------------

export type Habit = {

  // ID único del hábito
  id: string

  // Nombre del hábito
  name: string

  // Icono del hábito (viene del template)
  icon: string

  // Tipo de repetición
  repeatType: "daily" | "weekly" | "once"

  // Configuración para hábitos semanales
  // Ejemplo: [1,3,5] = lunes, miércoles, viernes
  repeatConfig?: number[]

  // Fecha en la que empieza el hábito
  startDate: string

  // Lista de fechas en las que el hábito fue completado
  // Formato: YYYY-MM-DD
  completedDates: string[]

  // Streak actual
  streak: number
}

// --------------------------------------------------
// TIPO DEL STORE
// Define todas las funciones disponibles
// --------------------------------------------------

type HabitStore = {

  // Lista de hábitos creados
  habits: Habit[]

  // Función para agregar un nuevo hábito
  addHabit: (habit: Habit) => void

  // Función para marcar o desmarcar un hábito
  toggleHabitCompletion: (habitId: string) => void

  // Función para saber si el hábito está completado hoy
  isHabitDoneToday: (habit: Habit) => boolean
}

// --------------------------------------------------
// HELPER → OBTENER FECHA DE HOY
// --------------------------------------------------

const getToday = () => {

  const today = new Date()

  // Convertimos a formato YYYY-MM-DD
  return today.toISOString().split("T")[0]

}

// --------------------------------------------------
// FUNCIÓN PARA CALCULAR EL STREAK
// --------------------------------------------------

const calculateStreak = (completedDates: string[]) => {

  // Copiamos y ordenamos las fechas
  const sorted = [...completedDates].sort().reverse()

  // Streak inicial
  let streak = 0

  // Fecha actual
  let current = new Date()

  // Recorremos las fechas completadas
  for (let i = 0; i < sorted.length; i++) {

    const date = new Date(sorted[i])

    // Calculamos diferencia en días
    const diff =
      Math.floor(
        (current.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      )

    // Si es el mismo día
    if (diff === 0) {

      streak++

      // retrocedemos un día
      current.setDate(current.getDate() - 1)

    }

    // Si fue ayer
    else if (diff === 1) {

      streak++

      current.setDate(current.getDate() - 1)

    }

    // Si hay un salto de días → rompemos streak
    else {

      break

    }

  }

  return streak

}

// --------------------------------------------------
// CREAR STORE DE ZUSTAND
// --------------------------------------------------

export const useHabitStore = create<HabitStore>((set, get) => ({

  // Estado inicial del store
  habits: [],

  // --------------------------------------------------
  // AGREGAR HÁBITO
  // --------------------------------------------------

  addHabit: (habit) =>
    set((state) => ({
      habits: [...state.habits, habit],
    })),

  // --------------------------------------------------
  // SABER SI UN HÁBITO ESTÁ COMPLETADO HOY
  // --------------------------------------------------

  isHabitDoneToday: (habit) => {

    const today = getToday()

    // Revisamos si la fecha de hoy está en completedDates
    return habit.completedDates.includes(today)

  },

  // --------------------------------------------------
  // MARCAR / DESMARCAR HÁBITO
  // --------------------------------------------------

  toggleHabitCompletion: (habitId) =>
    set((state) => {

      const today = getToday()

      const habits = state.habits.map((habit) => {

        // Si no es el hábito tocado lo dejamos igual
        if (habit.id !== habitId) return habit

        // Copiamos las fechas completadas
        let updatedDates = [...habit.completedDates]

        // Revisamos si ya estaba completado hoy
        const alreadyDone = updatedDates.includes(today)

        // Si ya estaba completado → lo quitamos
        if (alreadyDone) {

          updatedDates = updatedDates.filter((d) => d !== today)

        }

        // Si no estaba completado → lo agregamos
        else {

          updatedDates.push(today)

        }

        // Recalculamos el streak
        const newStreak = calculateStreak(updatedDates)

        // Devolvemos el hábito actualizado
        return {

          ...habit,

          completedDates: updatedDates,

          streak: newStreak,

        }

      })

      return { habits }

    }),

}))