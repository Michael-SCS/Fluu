export function shouldShowHabitToday(habit: any) {

  const today = new Date()

  const todayDay = today.getDay()
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()

  const startDate = new Date(habit.startDate)

  if (today < startDate) return false



  switch (habit.repeat) {

    case "once":
      return today.toDateString() === startDate.toDateString()

    case "daily":
      return true

    case "weekly":
      return habit.weekDays?.includes(todayDay)

    case "monthly":
      return todayDate === startDate.getDate()

    case "yearly":
      return (
        todayDate === startDate.getDate() &&
        todayMonth === habit.month
      )

    default:
      return false
  }

}