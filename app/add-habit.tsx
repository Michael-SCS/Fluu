import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { habitTemplates } from "../data/habitTemplates";

export default function AddHabit() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Add Habit</Text>

      {habitTemplates.map((section) => (
        <View key={section.category} style={styles.section}>

          <Text style={styles.category}>{section.category}</Text>

          {section.habits.map((habit) => (
            <TouchableOpacity key={habit.id} style={styles.habit}>

              <Text style={styles.icon}>{habit.icon}</Text>

              <Text style={styles.name}>
                {habit.name}
              </Text>

            </TouchableOpacity>
          ))}

        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F7F8FA",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  section: {
    marginBottom: 30,
  },

  category: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },

  habit: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 14,
    marginBottom: 10,
  },

  icon: {
    fontSize: 20,
    marginRight: 12,
  },

  name: {
    fontSize: 16,
  }

});