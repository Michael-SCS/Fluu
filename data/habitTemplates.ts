// --------------------------------------------------
// HABIT TEMPLATE TYPE
// Define la configuración de cada hábito
// --------------------------------------------------

export type HabitTemplate = {

  id: string

  name: string

  icon: string

  description: string

  // tipo de meta
  goalType?: "count" | "time" | "amount"

  // unidad del hábito
  unit?: string

  // pregunta que se mostrará en configuración
  question?: string

  // meta por defecto
  defaultGoal?: number

}


// --------------------------------------------------
// LISTA DE TEMPLATES
// --------------------------------------------------

export const habitTemplates: HabitTemplate[] = [

  {
    id: "drink-water",
    name: "Drink Water",
    icon: "💧",
    description: "Stay hydrated during the day",
    goalType: "count",
    unit: "glasses",
    question: "How many glasses of water per day?",
    defaultGoal: 8,
  },

  {
    id: "read-book",
    name: "Read a Book",
    icon: "📚",
    description: "Build a daily reading habit",
    goalType: "count",
    unit: "pages",
    question: "How many pages will you read?",
    defaultGoal: 10,
  },

  {
    id: "run",
    name: "Run",
    icon: "🏃",
    description: "Improve your endurance",
    goalType: "amount",
    unit: "km",
    question: "How many kilometers will you run?",
    defaultGoal: 3,
  },

  {
    id: "meditate",
    name: "Meditate",
    icon: "🧘",
    description: "Improve focus and calm",
    goalType: "time",
    unit: "minutes",
    question: "How many minutes will you meditate?",
    defaultGoal: 10,
  },

  {
    id: "save-money",
    name: "Save Money",
    icon: "💰",
    description: "Save money regularly",
    goalType: "amount",
    unit: "$",
    question: "How much will you save?",
    defaultGoal: 5,
  },

  {
    id: "listen-podcast",
    name: "Listen to Podcast",
    icon: "🎧",
    description: "Learn while listening",
    goalType: "time",
    unit: "minutes",
    question: "How long will you listen?",
    defaultGoal: 20,
  },

];