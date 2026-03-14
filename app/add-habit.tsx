import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useHabitStore } from "@/store/habitStore";
import { habitTemplates } from "../data/habitTemplates";

export default function AddHabitScreen() {
  const router = useRouter();
  const habits = useHabitStore((state) => state.habits);

  const selectHabit = (habitId: string, name: string) => {
    /*
    Verifica si ya existe un hábito con el mismo nombre
    */
    const exists = habits.some(
      (h) => h.title.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      Alert.alert("Habit already exists", "You already added this habit.");
      return;
    }

    router.push(`/habit-config/${habitId}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>NEW HABIT</Text>
        <Text style={styles.title}>Choose a{"\n"}Habit</Text>
      </View>

      <FlatList
        data={habitTemplates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => selectHabit(item.id, item.name)}
            activeOpacity={0.75}
          >
            <View style={styles.iconWrapper}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF8",
  },

  header: {
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEB",
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.5,
    color: "#B5A898",
    marginBottom: 8,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1C1A17",
    lineHeight: 40,
    letterSpacing: -0.5,
  },

  list: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#1C1A17",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },

  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F5F0EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  icon: {
    fontSize: 26,
  },

  textContainer: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1A17",
    marginBottom: 4,
    letterSpacing: -0.2,
  },

  description: {
    fontSize: 13,
    color: "#9C9489",
    lineHeight: 18,
  },
});