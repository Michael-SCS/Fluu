import { FlatList, StyleSheet, Text, View } from "react-native"

import { useHabitStore } from "@/store/habitStore"
import HabitCard from "./HabitCard"

import { shouldShowHabitToday } from "@/utils/shouldShowHabitToday"



export default function HabitsSection() {

  const habits = useHabitStore(state => state.habits)

  // 🔹 hábitos que corresponden a hoy
  const todayHabits = habits.filter(habit =>
    shouldShowHabitToday(habit)
  )



  // 🔹 empty state
  if (todayHabits.length === 0) {

    return (

      <View style={styles.emptyContainer}>

        <Text style={styles.emptyTitle}>
          No habits today
        </Text>

        <Text style={styles.emptyText}>
          Start building your routine

          Tap + to create a habit
        </Text>

      </View>

    )

  }



  return (

    <FlatList
      data={todayHabits}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <HabitCard habit={item} />
      )}
    />

  )

}



const styles = StyleSheet.create({

  list:{
    paddingTop:10,
    paddingBottom:120
  },

  emptyContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    paddingHorizontal:40
  },

  emptyTitle:{
    fontSize:18,
    fontWeight:"600",
    marginBottom:6
  },

  emptyText:{
    fontSize:14,
    color:"#888",
    textAlign:"center",
    lineHeight:20
  }

})
