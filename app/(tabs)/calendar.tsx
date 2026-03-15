import { useHabitStore } from "@/store/habitStore"
import { useTasksStore } from "@/store/tasksStore"
import { useState } from "react"
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
const CELL_SIZE = Math.floor((Dimensions.get("window").width - 40) / 7)
// 40 = padding horizontal total (20 * 2)
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
const WEEKDAYS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]

function fmt(date: Date) {

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`

}

function getWeekStart(date: Date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay()) // domingo = 0
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekDays(start: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const days: { date: Date; otherMonth: boolean }[] = []

  // Días del mes anterior para completar la primera semana
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, prevMonthDays - i), otherMonth: true })
  }

  // Días del mes actual
  for (let i = 1; i <= totalDays; i++) {
    days.push({ date: new Date(year, month, i), otherMonth: false })
  }

  // Días del mes siguiente para completar la última semana
  const remaining = (7 - (days.length % 7)) % 7
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), otherMonth: true })
  }

  return days
}

export default function CalendarScreen() {
  const habits = useHabitStore(state => state.habits)
  const tasks = useTasksStore(state => state.tasks)
  const now = new Date()

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )

  const [expanded, setExpanded] = useState(false)
  const [selectedDate, setSelectedDate] = useState(fmt(today))
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const weekStart = getWeekStart(today)
  const weekDays = getWeekDays(weekStart).map(d => ({ date: d, otherMonth: false }))
  const monthGrid = getMonthGrid(viewYear, viewMonth)

  const daysToRender = expanded ? monthGrid : weekDays

  const todayStr = fmt(today)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const habitsForDay = habits.filter(h => !h.skippedDates?.includes(selectedDate))

  const [year, month, dayNum] = selectedDate.split("-").map(Number)
  const day = new Date(year, month - 1, dayNum).getDay()

  const tasksForDay = tasks.filter(task => {

    if (task.repeatType === "daily") return true

    if (task.repeatType === "weekly") {
      return task.repeatDays?.includes(day)
    }

    if (task.repeatType === "none") {
      return task.createdAt === selectedDate
    }

    return true

  })


  const selDate = new Date(year, month - 1, dayNum)

  const formattedSelected = selDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <View style={styles.container}>

      {/* HEADER NAV */}
      <View style={styles.header}>
        {expanded
          ? <TouchableOpacity style={styles.navBtn} onPress={prevMonth}>
            <Text style={styles.navArrow}>‹</Text>
          </TouchableOpacity>
          : <View style={styles.navBtnPlaceholder} />
        }

        <Text style={styles.title}>
          {MONTHS[viewMonth]} {viewYear}
        </Text>

        {expanded
          ? <TouchableOpacity style={styles.navBtn} onPress={nextMonth}>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
          : <View style={styles.navBtnPlaceholder} />
        }
      </View>

      {/* NOMBRES DE DÍAS */}
      <View style={styles.weekdays}>
        {WEEKDAYS.map(d => (
          <Text key={d} style={styles.weekdayLabel}>{d}</Text>
        ))}
      </View>

      {/* GRID DE DÍAS */}
      <View style={styles.grid}>
        {daysToRender.map(({ date, otherMonth }) => {
          const dateStr = fmt(date)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const hasCompleted = habits.some(h => h.completedDates.includes(dateStr))

          return (
            <TouchableOpacity
              key={dateStr + (otherMonth ? "-other" : "")}
              onPress={() => setSelectedDate(dateStr)}
              style={[
                styles.day,
                isSelected && styles.daySelected,
              ]}
            >
              <Text style={[
                styles.dayText,
                otherMonth && styles.dayOtherMonth,
                isToday && !isSelected && styles.dayToday,
                isSelected && styles.dayTextSelected,
              ]}>
                {date.getDate()}
              </Text>

              {hasCompleted && !isToday && (
                <View style={[styles.dot, isSelected && styles.dotSelected]} />
              )}

              {isToday && !isSelected && (
                <View style={styles.todayDot} />
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      {/* BOTÓN EXPANDIR */}
      <TouchableOpacity
        style={styles.expandBtn}
        onPress={() => {
          if (expanded) {
            setViewYear(today.getFullYear())
            setViewMonth(today.getMonth())
          }
          setExpanded(!expanded)
        }}
      >
        <Text style={styles.expandText}>
          {expanded ? "Ver semana  ▲" : "Ver mes completo  ▼"}
        </Text>
      </TouchableOpacity>

      {/* DETALLE DEL DÍA */}
      <Text style={styles.selectedDateText}>{formattedSelected}</Text>
      <Text style={styles.sectionLabel}>Hábitos</Text>

      <FlatList
        data={habitsForDay}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const done = item.completedDates.includes(selectedDate)
          return (
            <View style={styles.card}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.habitName}>{item.title}</Text>
              <View style={[styles.badge, done ? styles.badgeDone : styles.badgePending]}>
                <Text style={[styles.badgeText, done ? styles.badgeTextDone : styles.badgeTextPending]}>
                  {done ? "Hecho" : "Pendiente"}
                </Text>
              </View>
            </View>
          )
        }}
      />
      <Text style={styles.sectionLabel}>Tareas</Text>

      <FlatList
        data={tasksForDay}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {

          return (

            <View style={styles.card}>

              <Text style={styles.icon}>
                ✓
              </Text>

              <Text style={styles.habitName}>
                {item.title}
              </Text>

              <View style={[
                styles.badge,
                item.completed ? styles.badgeDone : styles.badgePending
              ]}>

                <Text style={[
                  styles.badgeText,
                  item.completed ? styles.badgeTextDone : styles.badgeTextPending
                ]}>

                  {item.completed ? "Hecho" : "Pendiente"}

                </Text>

              </View>

            </View>

          )

        }}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "600" },
  navBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 0.5, borderColor: "#E0DFDA", alignItems: "center", justifyContent: "center" },
  navBtnPlaceholder: { width: 32 },
  navArrow: { fontSize: 18, color: "#333" },

  weekdays: { flexDirection: "row", marginBottom: 4 },
  weekdayLabel: { flex: 1, textAlign: "center", fontSize: 11, fontWeight: "500", color: "#888", paddingVertical: 4 },

  grid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  day: { width: CELL_SIZE, height: CELL_SIZE, aspectRatio: 1, alignItems: "center", justifyContent: "center", borderRadius: 10, position: "relative" },
  daySelected: { backgroundColor: "#7F77DD" },
  dayText: { fontSize: 14, color: "#1a1a1a", fontWeight: "400" },
  dayTextSelected: { color: "#fff", fontWeight: "600" },
  dayToday: { color: "#7F77DD", fontWeight: "600" },
  dayOtherMonth: { opacity: 0.3 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#AFA9EC", position: "absolute", bottom: 5 },
  dotSelected: { backgroundColor: "rgba(255,255,255,0.7)" },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#7F77DD", position: "absolute", bottom: 5 },

  expandBtn: { alignSelf: "center", borderWidth: 0.5, borderColor: "#E0DFDA", borderRadius: 20, paddingVertical: 5, paddingHorizontal: 18, marginVertical: 12 },
  expandText: { fontSize: 12, color: "#888" },

  selectedDateText: { fontSize: 15, fontWeight: "500", marginBottom: 14, textTransform: "capitalize" },
  sectionLabel: { fontSize: 12, fontWeight: "500", color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },

  card: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F5F4F0", padding: 12, borderRadius: 10, marginBottom: 8 },
  icon: { fontSize: 16, width: 22, textAlign: "center" },
  habitName: { flex: 1, fontSize: 14, fontWeight: "500" },
  badge: { paddingVertical: 3, paddingHorizontal: 9, borderRadius: 20 },
  badgeDone: { backgroundColor: "#EEEDFE" },
  badgePending: { backgroundColor: "#F5F4F0", borderWidth: 0.5, borderColor: "#E0DFDA" },
  badgeText: { fontSize: 11, fontWeight: "500" },
  badgeTextDone: { color: "#534AB7" },
  badgeTextPending: { color: "#888" },
})