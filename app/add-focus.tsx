import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { focusTemplates } from "@/data/focusTemplates";
import { useFocusStore } from "@/store/focusStore";

export default function AddFocusScreen() {
  const router = useRouter();
  const addActivity = useFocusStore((state) => state.addActivity);

  const selectFocus = (focus: any) => {
    addActivity({
      id: Date.now().toString(),
      title: focus.title,
      description: focus.description ?? "",
      duration: focus.duration,
      breakTime: focus.breakTime ?? 5,
      sessions: focus.sessions ?? 1,
      usageCount: 0,
      custom: false,
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>NEW SESSION</Text>
        <Text style={styles.title}>Choose Focus{"\n"}Activity</Text>
      </View>

      <FlatList
        data={focusTemplates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => selectFocus(item)}
            activeOpacity={0.75}
          >
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.duration}</Text>
              <Text style={styles.badgeLabel}>min</Text>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#1C1A17",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },

  cardContent: {
    flex: 1,
    marginRight: 16,
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

  badge: {
    backgroundColor: "#F5F0EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 52,
  },

  badgeText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#7C6F5E",
    lineHeight: 22,
  },

  badgeLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#B5A898",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});