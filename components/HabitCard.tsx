import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useHabitStore } from "@/store/habitStore";

type HabitCardProps = {
  id: string
  icon: string
  name: string
  progress?: number
  goal?: number
  unit?: string
  streak?: number
}

export default function HabitCard({
  id,
  icon,
  name,
  progress,
  goal,
  unit,
  streak
}: HabitCardProps) {

  const incrementHabitProgress =
    useHabitStore((state) => state.incrementHabitProgress)

  const percent =
    goal ? (progress ?? 0) / goal : 0

  return (

    <TouchableOpacity
      style={styles.card}
      onPress={() => incrementHabitProgress(id)}
    >

      <View style={styles.row}>

        <Text style={styles.icon}>{icon}</Text>

        <Text style={styles.name}>{name}</Text>

      </View>


      {goal && (

        <>
          <Text style={styles.progressText}>
            {progress ?? 0} / {goal} {unit}
          </Text>

          <View style={styles.progressBar}>

            <View
              style={[
                styles.progressFill,
                { width: `${percent * 100}%` }
              ]}
            />

          </View>
        </>

      )}


      {streak ? (

        <Text style={styles.streak}>
          🔥 {streak} day streak
        </Text>

      ) : null}

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  icon: {
    fontSize: 22,
    marginRight: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  progressText: {
    fontSize: 14,
    color: "#666",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 6,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },

  streak: {
    marginTop: 6,
    color: "#FF6B00",
    fontWeight: "600",
  },

});