import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MENU_ITEMS = [
  { label: "Create Task",  route: "/add-task"  },
  { label: "Create Habit", route: "/add-habit" },
  { label: "Create Focus", route: "/add-focus" },
];

export default function FloatingAddButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* BOTONES DEL MENÚ */}
      {open && (
        <View style={styles.menu}>
          {MENU_ITEMS.map(({ label, route }) => (
            <TouchableOpacity
              key={route}
              style={styles.option}
              activeOpacity={0.75}
              onPress={() => {
                setOpen(false);
                router.push(route as any);
              }}
            >
              <Text style={styles.optionText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* BOTÓN + */}
      <TouchableOpacity
        style={[styles.button, open && styles.buttonOpen]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.85}
      >
        <Ionicons
          name={open ? "close" : "add"}
          size={26}
          color="#FAFAF8"
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 24,
    bottom: 40,
    alignItems: "flex-end",
  },

  menu: {
    marginBottom: 12,
    gap: 8,
    alignItems: "flex-end",
  },

  option: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0EDE8",
    shadowColor: "#1C1A17",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  optionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1A17",
    letterSpacing: -0.1,
  },

  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#1C1A17",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1C1A17",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  buttonOpen: {
    backgroundColor: "#3D3A35",
  },

  optionIcon: {
    fontSize: 14,
  },
});