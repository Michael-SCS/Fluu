export const habitTemplates = [
  {
    category: "Health",
    habits: [
      { id: "water", name: "Drink Water", icon: "💧", type: "counter", defaultGoal: 8 },
      { id: "exercise", name: "Exercise", icon: "🏃", type: "check" },
      { id: "sleep", name: "Sleep Early", icon: "😴", type: "check" },
    ],
  },

  {
    category: "Mind",
    habits: [
      { id: "meditate", name: "Meditate", icon: "🧘", type: "timer", defaultGoal: 10 },
      { id: "read", name: "Read", icon: "📚", type: "counter", defaultGoal: 20 },
      { id: "journal", name: "Journal", icon: "📝", type: "check" },
    ],
  },

  {
    category: "Finance",
    habits: [
      { id: "save", name: "Save Money", icon: "💰", type: "progress", defaultGoal: 200 },
    ],
  },
];