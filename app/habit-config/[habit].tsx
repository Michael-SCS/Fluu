// --------------------------------------------------
// PANTALLA DE CONFIGURACIÓN DE HÁBITO
// Configuración dinámica basada en el template
// --------------------------------------------------

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { habitTemplates } from "@/data/habitTemplates";
import { useHabitStore } from "@/store/habitStore";

export default function HabitConfigScreen() {

  const { habit } = useLocalSearchParams();

  const router = useRouter();

  const template = habitTemplates.find((h) => h.id === habit);

  const addHabit = useHabitStore((state) => state.addHabit);

  const [repeatType, setRepeatType] =
    useState<"daily" | "weekly" | "once">("daily");

  const [goal, setGoal] = useState(
    template?.defaultGoal ? String(template.defaultGoal) : ""
  );

  const startDate = new Date().toISOString();

  const createHabit = () => {

    if (!template) return;

    addHabit({

      id: Date.now().toString(),

      name: template.name,

      icon: template.icon,

      startDate: startDate,

      repeatType: repeatType,

      completedDates: [],

      streak: 0,

      goal: goal ? Number(goal) : template.defaultGoal,

      progress: 0,

      unit: template.unit,

    });

    router.push("/");

  };

  if (!template) {

    return (
      <View style={styles.container}>
        <Text>Habit not found</Text>
      </View>
    );

  }

  return (

    <View style={styles.container}>

      {/* TÍTULO */}

      <Text style={styles.title}>
        {template.icon} {template.name}
      </Text>

      <Text style={styles.subtitle}>
        Choose how often you want to do this habit
      </Text>


      {/* FREQUENCY */}

      <TouchableOpacity
        style={[
          styles.option,
          repeatType === "daily" && styles.selected
        ]}
        onPress={() => setRepeatType("daily")}
      >
        <Text>Daily</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          repeatType === "weekly" && styles.selected
        ]}
        onPress={() => setRepeatType("weekly")}
      >
        <Text>Weekly</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          repeatType === "once" && styles.selected
        ]}
        onPress={() => setRepeatType("once")}
      >
        <Text>Only once</Text>
      </TouchableOpacity>


      {/* META DEL HÁBITO */}

      {template.question && (

        <View style={styles.goalContainer}>

          <Text style={styles.goalLabel}>
            {template.question}
          </Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={goal}
            onChangeText={setGoal}
          />

          {template.unit && (
            <Text style={styles.unit}>
              unit: {template.unit}
            </Text>
          )}

        </View>

      )}


      {/* BOTÓN CREAR */}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={createHabit}
      >

        <Text style={styles.saveText}>
          Create Habit
        </Text>

      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    color: "#777",
    marginBottom: 20,
  },

  option: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 10,
  },

  selected: {
    backgroundColor: "#E3F2FD",
  },

  goalContainer: {
    marginTop: 20,
  },

  goalLabel: {
    fontSize: 16,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },

  unit: {
    marginTop: 6,
    color: "#666",
  },

  saveButton: {
    marginTop: 30,
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

});