import {
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native"

import { useTasksStore } from "@/store/tasksStore"
import TaskCard from "./TaskCard"

export default function TasksSection() {

  const allTasks = useTasksStore(state => state.tasks)

  const today = new Date().toISOString().split("T")[0]
  const todayDate = new Date()

  const day = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate()
  ).getDay()

  /* TASKS FOR TODAY */

  const tasks = allTasks.filter(task => {

    if (task.repeatType === "daily") return true

    if (task.repeatType === "weekly") {
      return task.repeatDays?.includes(day)
    }

    if (task.repeatType === "none") {
      return task.createdAt === today
    }

    return true

  })

  /* SPLIT */

  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  return (

    <View style={{ flex: 1 }}>

      {/* EMPTY STATE */}

      {tasks.length === 0 && (

        <View style={styles.header}>

          <Text style={styles.title}>
            No tasks today
          </Text>

          <Text style={styles.description}>
            Tap the + button below to create a task
          </Text>

        </View>

      )}

      {/* PENDING TASKS */}

      {pending.length > 0 && (

        <>

          <Text style={styles.section}>
            Today
          </Text>

          <FlatList
            data={pending}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard task={item} />
            )}
            scrollEnabled={false}
          />

        </>

      )}

      {/* COMPLETED TASKS */}

      {completed.length > 0 && (

        <>

          <Text style={styles.section}>
            Completed
          </Text>

          <FlatList
            data={completed}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard task={item} />
            )}
            scrollEnabled={false}
          />

        </>

      )}

    </View>

  )

}

const styles = StyleSheet.create({

  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6
  },

  description: {
    fontSize: 14,
    color: "#777",
    marginBottom: 14
  },

  section: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1
  }

})