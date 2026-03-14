import { useHabitStore } from "@/store/habitStore"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"



export default function HabitCard({ habit }: any) {

  const increment = useHabitStore(s => s.incrementHabitProgress)

  return (

    <TouchableOpacity
      style={styles.card}
      onPress={() => increment(habit.id)}
    >

      <View style={styles.row}>

        <Text style={styles.icon}>
          {habit.icon}
        </Text>

        <View style={{ flex: 1 }}>

          <Text style={styles.title}>
            {habit.title}
          </Text>

          <Text style={styles.description}>
            {habit.description}
          </Text>

          <Text style={styles.progress}>
            {habit.progress} / {habit.goal}
          </Text>

        </View>

      </View>

    </TouchableOpacity>

  )

}



const styles = StyleSheet.create({

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 12
  },

  row: {
    flexDirection: "row",
    alignItems: "center"
  },

  icon: {
    fontSize: 26,
    marginRight: 12
  },

  title: {
    fontSize: 16,
    fontWeight: "600"
  },

  description: {
    color: "#666",
    marginTop: 2
  },

  progress: {
    marginTop: 6,
    fontWeight: "500"
  }

})