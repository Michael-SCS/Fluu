import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { focusTemplates } from "@/data/focusTemplates";
import { useFocusStore } from "@/store/focusStore";

export default function AddFocusScreen() {
  const router       = useRouter();
  const insets       = useSafeAreaInsets();
  const addActivity  = useFocusStore((s) => s.addActivity);

  function calculateTotal(duration: number, breakTime: number, sessions: number) {
    return duration * sessions + breakTime * (sessions - 1);
  }

  function formatMinutes(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  function selectTemplate(template: any) {
    addActivity({
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      duration: template.duration,
      breakTime: template.breakTime,
      sessions: template.sessions,
      usageCount: 0,
    });
    router.back();
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
        <Text style={styles.overline}>New focus</Text>
        <Text style={styles.title}>Choose a mode</Text>
        <Text style={styles.subtitle}>
          Select a template or build your own session
        </Text>
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={focusTemplates}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 32 },
        ]}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.customCard}
            onPress={() => router.push("/create-focus")}
            activeOpacity={0.8}
          >
            <View style={styles.customIcon}>
              <Text style={styles.customIconText}>+</Text>
            </View>
            <Text style={styles.customText}>Create your own focus</Text>
            <View style={styles.chevronWrap}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        }
        renderItem={({ item }) => {
          const total = calculateTotal(item.duration, item.breakTime, item.sessions);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => selectTemplate(item)}
              activeOpacity={0.75}
            >
              {/* top row */}
              <View style={styles.cardTop}>
                <View style={styles.cardBody}>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.desc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <View style={styles.totalPill}>
                  <Text style={styles.totalText}>{formatMinutes(total)}</Text>
                </View>
              </View>

              {/* chips row */}
              <View style={styles.chipsRow}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>⏱ {item.duration} min</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>☕ {item.breakTime} min break</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>◎ {item.sessions} sessions</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

    </View>
  );
}

const PURPLE      = "#7F77DD";
const PURPLE_SOFT = "#EEEDFE";
const PURPLE_DARK = "#534AB7";

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
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
    gap: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    letterSpacing: -0.2,
  },
  desc: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  totalPill: {
    backgroundColor: PURPLE_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    alignSelf: "flex-start",
  },
  totalText: {
    fontSize: 12,
    fontWeight: "600",
    color: PURPLE_DARK,
  },

  /* chips */
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    backgroundColor: "#F5F4F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
  },
  chipText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },

  /* ── CUSTOM CARD ── */
  customCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#CECBF6",
    gap: 14,
    marginTop: 4,
  },
  customIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: PURPLE_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  customIconText: {
    fontSize: 24,
    color: PURPLE,
    fontWeight: "300",
    lineHeight: 28,
  },
  customText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: PURPLE_DARK,
    letterSpacing: -0.2,
  },
  chevronWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: PURPLE_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: {
    fontSize: 16,
    color: PURPLE,
    lineHeight: 20,
  },
});