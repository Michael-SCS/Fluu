import { useTasksStore } from "@/store/tasksStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const addTask = useTasksStore((state) => state.addTask);
  const router = useRouter();

  const handleCreateTask = () => {
    if (!title.trim()) return;
    addTask(title);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>TASKS</Text>
        <Text style={styles.title}>New Task</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.inputLabel}>What do you need to do?</Text>
        <TextInput
          placeholder="Write your task..."
          placeholderTextColor="#C4BAAF"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, !title.trim() && styles.buttonDisabled]}
          onPress={handleCreateTask}
          activeOpacity={0.75}
        >
          <Text style={styles.buttonText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF8",
  },

  header: {
    paddingTop: 16,
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

  body: {
    padding: 24,
    gap: 12,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#B5A898",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  input: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    fontSize: 16,
    color: "#1C1A17",
    borderWidth: 1,
    borderColor: "#F0EDE8",
    shadowColor: "#1C1A17",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    minHeight: 100,
    textAlignVertical: "top",
  },

  button: {
    marginTop: 8,
    backgroundColor: "#1C1A17",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#D6D0C8",
  },

  buttonText: {
    color: "#FAFAF8",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});