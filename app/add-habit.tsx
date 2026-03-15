import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHabitStore } from "@/store/habitStore";
import { habitTemplates } from "../data/habitTemplates";

export default function AddHabitScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const habits  = useHabitStore((s) => s.habits);

  function selectHabit(habitId: string, name: string) {
    const exists = habits.some(
      (h) => h.title.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      Alert.alert("Already added", "You already have this habit.");
      return;
    }
    router.push(`/habit-config/${habitId}` as any);
  }

  return (
    <View style={styles.container}>

      {/* ── HEADER ── */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.overline}>New habit</Text>
        <Text style={styles.title}>Choose a habit</Text>
        <Text style={styles.subtitle}>
          Pick one to configure frequency and reminders
        </Text>
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={habitTemplates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => selectHabit(item.id, item.name)}
            activeOpacity={0.75}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>

            <View style={styles.chevronWrap}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const PURPLE      = "#7F77DD";
const PURPLE_SOFT = "#EEEDFE";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4F0",
  },

  /* ── HEADER ── */
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E0",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 18,
    color: "#111",
    lineHeight: 22,
  },
  overline: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2.5,
    color: "#B0AFA8",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111",
    letterSpacing: -1,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 6,
    fontWeight: "500",
  },

  /* ── LIST ── */
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },

  /* ── CARD ── */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: PURPLE_SOFT,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  icon: {
    fontSize: 24,
  },
  cardBody: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  desc: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  chevronWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: "#F5F4F0",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chevron: {
    fontSize: 16,
    color: "#B0AFA8",
    lineHeight: 20,
  },
});