import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"

import DateTimePicker from "@react-native-community/datetimepicker"

import { habitTemplates } from "@/data/habitTemplates"
import { useHabitStore } from "@/store/habitStore"



export default function HabitConfigScreen() {

  const router = useRouter()

  const { habit } = useLocalSearchParams<{ habit: string }>()

  const template = habitTemplates.find(h => h.id === habit)

  const addHabit = useHabitStore(s => s.addHabit)



  const [date, setDate] = useState(new Date())

  const [showCalendar, setShowCalendar] = useState(false)

  const [goal, setGoal] = useState(template?.defaultGoal ?? 8)

  const [repeat, setRepeat] = useState<"once" | "daily" | "weekly" | "monthly" | "yearly">("daily")

  const [weekDays, setWeekDays] = useState<number[]>([])

  const [month, setMonth] = useState(date.getMonth())



  function toggleDay(day: number) {

    if (weekDays.includes(day)) {

      setWeekDays(weekDays.filter(d => d !== day))

    } else {

      setWeekDays([...weekDays, day])

    }

  }



  function saveHabit() {

    if (!template) return

    addHabit({

      id: Date.now().toString(),

      title: template.name,

      description: template.description,

      icon: template.icon,

      startDate: date.toISOString(),

      goal,

      progress: 0,

      streak: 0,

      repeat,

      weekDays,

      month,

      completedDates: []

    })

    router.back()

  }



  if (!template) {

    return (

      <View style={styles.container}>

        <Text>Habit not found</Text>

      </View>

    )

  }



  return (

    <View style={styles.container}>


      <Text style={styles.title}>
        {template.icon} {template.name}
      </Text>



      {/* START DATE */}


      <Text style={styles.label}>Start Date</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowCalendar(true)}
      >

        <Text>{date.toDateString()}</Text>

      </TouchableOpacity>



      {showCalendar && (

        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selected) => {

            setShowCalendar(false)

            if (selected) setDate(selected)

          }}
        />

      )}



      {/* GOAL */}



      <View style={styles.goalRow}>

        <Text style={styles.label}>
          {template.question ?? "Goal"}
        </Text>


        <TouchableOpacity
          onPress={() => Alert.alert(
            "Water recommendation",
            `The general recommendation is about 8 glasses of water per day (~2L).

It varies by weight, activity and climate.

Women: 2 – 2.7L
Men: 2.5 – 3.7L

Exercise/Heat: 3 – 3.5L`
          )}
        >

          <Text style={styles.info}>i</Text>

        </TouchableOpacity>

      </View>



      <View style={styles.goalSelector}>

        <TouchableOpacity onPress={() => setGoal(goal - 1)}>
          <Text style={styles.goalButton}>-</Text>
        </TouchableOpacity>

        <Text style={styles.goalValue}>{goal}</Text>

        <TouchableOpacity onPress={() => setGoal(goal + 1)}>
          <Text style={styles.goalButton}>+</Text>
        </TouchableOpacity>

      </View>



      {/* REPEAT */}



      <Text style={styles.label}>Repeat</Text>

      <View style={styles.repeatRow}>

        {["once", "daily", "weekly", "monthly", "yearly"].map(r => (

          <TouchableOpacity
            key={r}
            style={[
              styles.repeatButton,
              repeat === r && styles.repeatActive
            ]}
            onPress={() => setRepeat(r as any)}
          >

            <Text>{r}</Text>

          </TouchableOpacity>

        ))}

      </View>



      {/* WEEKLY */}



      {repeat === "weekly" && (

        <View style={styles.weekContainer}>

          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ].map((day, i) => (

            <TouchableOpacity
              key={i}
              style={[
                styles.weekDayCard,
                weekDays.includes(i) && styles.weekDayActive
              ]}
              onPress={() => toggleDay(i)}
            >

              <Text
                style={[
                  styles.weekDayText,
                  weekDays.includes(i) && styles.weekDayTextActive
                ]}
              >
                {day}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

      )}



      {/* MONTHLY */}



      {repeat === "monthly" && (

        <Text style={styles.monthInfo}>
          This habit will repeat every month on day {date.getDate()}
        </Text>

      )}



      {/* YEARLY */}



      {repeat === "yearly" && (

        <View style={styles.monthGrid}>

          {[
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ].map((m, i) => (

            <TouchableOpacity
              key={i}
              style={[
                styles.month,
                month === i && styles.monthActive
              ]}
              onPress={() => setMonth(i)}
            >

              <Text>{m}</Text>

            </TouchableOpacity>

          ))}

        </View>

      )}



      <TouchableOpacity
        style={styles.save}
        onPress={saveHabit}
      >

        <Text style={{ color: "white" }}>
          Create Habit
        </Text>

      </TouchableOpacity>


    </View>

  )

}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 20
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20
  },

  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6
  },

  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20
  },

  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  info: {
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 20,
    width: 24,
    textAlign: "center"
  },

  goalSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20
  },

  goalButton: {
    fontSize: 24,
    padding: 10
  },

  goalValue: {
    fontSize: 20,
    fontWeight: "600"
  },

  repeatRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20
  },

  repeatButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8
  },

  repeatActive: {
    backgroundColor: "#6366F1"
  },
weekContainer: {
  marginBottom: 20
},

weekDayCard: {
  backgroundColor: "#eee",
  padding: 14,
  borderRadius: 10,
  marginBottom: 10
},

weekDayActive: {
  backgroundColor: "#6366F1"
},

weekDayText: {
  fontSize: 15
},

weekDayTextActive: {
  color: "white",
  fontWeight: "600"
},
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  day: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    width: 40,
    alignItems: "center"
  },

  dayActive: {
    backgroundColor: "#6366F1"
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },

  month: {
    width: "25%",
    padding: 10,
    alignItems: "center"
  },

  monthActive: {
    backgroundColor: "#6366F1"
  },

  monthInfo: {
    marginBottom: 20,
    color: "#555"
  },

  save: {
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30
  }


})