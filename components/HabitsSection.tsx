import { FlatList, View } from "react-native"

import { useHabitStore } from "@/store/habitStore"

import HabitCard from "./HabitCard"

import { shouldShowHabitToday } from "./habitLogic"



export default function HabitsSection() {

  const habits = useHabitStore(state => state.habits)



  const todayHabits = habits.filter(habit =>
    shouldShowHabitToday(habit)
  )



  return (

    <View style={{ flex: 1 }}>

      <FlatList
        data={todayHabits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard habit={item} />
        )}
      />

    </View>

  )

}