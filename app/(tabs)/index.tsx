import FloatingAddButton from "@/components/FloatingAddButton";
import FocusSection from "@/components/FocusSection";
import HabitsSection from "@/components/HabitsSection";
import TasksSection from "@/components/TasksSection";
import { useHabitStore } from "@/store/habitStore";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Constantes de fecha ───────────────────────────────────────────────────────
const today = new Date();

const dateString = today.toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
});

const TAB_ICONS = ["✓", "◎", "⏱"];
const TAB_LABELS = ["Tasks", "Habits", "Focus"];

// ─── Componente principal ──────────────────────────────────────────────────────
export default function TodayScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(1);

  const indicatorAnim = useRef(new Animated.Value(1)).current;

  const resetDailyProgress = useHabitStore((state) => state.resetDailyProgress);

  useEffect(() => {
    resetDailyProgress();
  }, []);

  const goToPage = (index: number) => {
    pagerRef.current?.setPage(index);
    setPage(index);
    Animated.spring(indicatorAnim, {
      toValue: index,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  };

  const onPageSelected = (e: any) => {
    const pos = e.nativeEvent.position;
    setPage(pos);
    Animated.spring(indicatorAnim, {
      toValue: pos,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  };

  const indicatorLeft = indicatorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["0%", "33.33%", "66.66%"],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" backgroundColor="#FAFAF8" translucent={false} />

      {/* ── ENCABEZADO ─────────────────────────────────────────────────── */}
      <View style={styles.headerContainer}>
        <Text style={styles.overline}>MY DAY</Text>
        <Text style={styles.header}>Today</Text>
        <View style={styles.dateRow}>
          <View style={styles.dateDot} />
          <Text style={styles.date}>{dateString}</Text>
        </View>
      </View>

      {/* ── TABS con indicador animado ──────────────────────────────────── */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          <Animated.View style={[styles.tabIndicator, { left: indicatorLeft }]} />

          {TAB_LABELS.map((label, index) => {
            const isActive = page === index;
            return (
              <TouchableOpacity
                key={label}
                style={styles.tabButton}
                onPress={() => goToPage(index)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                  {TAB_ICONS[index]}
                </Text>
                <Text style={[styles.tabText, isActive && styles.activeText]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── CONTENIDO paginado ─────────────────────────────────────────── */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={1}
        onPageSelected={onPageSelected}
      >
        <TasksSection key="1" />
        <HabitsSection key="2" />
        <FocusSection key="3" />
      </PagerView>

      <FloatingAddButton />
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF8",
  },

  // ── Encabezado ──────────────────────────────────────────────────────────────
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEB",
    marginBottom: 16,
  },

  overline: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.5,
    color: "#A78BFA",
    marginBottom: 8,
    textTransform: "uppercase",
  },

  header: {
    fontSize: 40,
    fontWeight: "800",
    color: "#1C1A17",
    letterSpacing: -1.2,
    lineHeight: 44,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },

  dateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A78BFA",
  },

  date: {
    color: "#9C9489",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // ── Tabs ────────────────────────────────────────────────────────────────────
  tabsWrapper: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F0EDE8",
    borderRadius: 18,
    padding: 5,
    position: "relative",
    borderWidth: 1,
    borderColor: "#E8E3DC",
  },

  tabIndicator: {
    position: "absolute",
    top: 5,
    bottom: 5,
    width: "33.33%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    shadowColor: "#7C3AED",
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    gap: 2,
    zIndex: 1,
  },

  tabIcon: {
    fontSize: 13,
    color: "#B5A898",
  },

  tabIconActive: {
    color: "#7C3AED",
  },

  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B5A898",
    letterSpacing: 0.3,
  },

  activeText: {
    color: "#1C1A17",
  },

  // ── Paginador ───────────────────────────────────────────────────────────────
  pager: {
    flex: 1,
  },
});