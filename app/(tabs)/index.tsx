import FloatingAddButton from "@/components/FloatingAddButton";
import FocusSection from "@/components/FocusSection";
import HabitsSection from "@/components/HabitsSection";
import TasksSection from "@/components/TasksSection";

import { useHabitStore } from "@/store/habitStore";
import { useTasksStore } from "@/store/tasksStore";

import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useEffect, useRef, useState } from "react";

import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PagerView from "react-native-pager-view";

const today = new Date();
const weekday  = today.toLocaleDateString("en-US", { weekday: "long" });
const monthDay = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

const TABS = [
  { label: "Tasks",  icon: "✓" },
  { label: "Habits", icon: "◎" },
  { label: "Focus",  icon: "⏱" },
];

export default function Index() {
  const insets = useSafeAreaInsets();

  const pagerRef      = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const indicatorAnim   = useRef(new Animated.Value(0)).current;

  const resetDailyProgress = useHabitStore((s) => s.resetDailyProgress);
  const refreshDailyTasks  = useTasksStore((s) => s.refreshDailyTasks);

  useEffect(() => {
    resetDailyProgress();
    refreshDailyTasks();
  }, []);

  function goToPage(index: number) {
    pagerRef.current?.setPage(index);
    setPage(index);
    Animated.spring(indicatorAnim, {
      toValue: index,
      useNativeDriver: false,
      tension: 70,
      friction: 11,
    }).start();
  }

  function onPageSelected(e: any) {
    const pos = e.nativeEvent.position;
    setPage(pos);
    Animated.spring(indicatorAnim, {
      toValue: pos,
      useNativeDriver: false,
      tension: 70,
      friction: 11,
    }).start();
  }

  const indicatorLeft = indicatorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["0%", "33.33%", "66.66%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={{ height: insets.top }} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.overline}>{weekday}</Text>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.date}>{monthDay}</Text>
        <View style={styles.headerRule}>
          <View style={styles.ruleLine} />
          <View style={styles.ruleDot} />
          <View style={styles.ruleLine} />
        </View>
      </View>

      {/* ── TABS ── */}
      <View style={styles.tabsOuter}>
        <View style={styles.tabsTrack}>
          <Animated.View style={[styles.tabIndicator, { left: indicatorLeft }]} />
          {TABS.map(({ label, icon }, index) => {
            const active = page === index;
            return (
              <TouchableOpacity
                key={label}
                style={styles.tabBtn}
                onPress={() => goToPage(index)}
                activeOpacity={0.75}
              >
                <View style={styles.tabInner}>
                  <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
                    {icon}
                  </Text>
                  <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.dotsRow}>
          {TABS.map((_, i) => (
            <View key={i} style={[styles.dot, page === i && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* ── CONTENT ── */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        <TasksSection key="1" />
        <HabitsSection key="2" />
        <FocusSection key="3" />
      </PagerView>

      <FloatingAddButton />
    </View>
  );
}

const PURPLE = "#7F77DD";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4F0",
  },

  /* ── HEADER ── */
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
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
    fontSize: 44,
    fontWeight: "700",
    color: "#111",
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  date: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 4,
  },
  headerRule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    width: "50%",
  },
  ruleLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#DDDBD5",
  },
  ruleDot: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: PURPLE,
    opacity: 0.5,
  },

  /* ── TABS ── */
  tabsOuter: {
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 8,
  },
  tabsTrack: {
    flexDirection: "row",
    backgroundColor: "#ECEAE4",
    borderRadius: 16,
    padding: 4,
    position: "relative",
    borderWidth: 0.5,
    borderColor: "#E0DED8",
  },
  tabIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    width: "33.33%",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
  },
  tabBtn: {
    flex: 1,
    zIndex: 1,
    alignItems: "center",
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  tabIcon: {
    fontSize: 13,
    color: "#B0AFA8",
  },
  tabIconActive: {
    color: PURPLE,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B0AFA8",
  },
  tabLabelActive: {
    color: "#111",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: "#DDDBD5",
  },
  dotActive: {
    width: 16,
    backgroundColor: PURPLE,
  },

  /* ── PAGER ── */
  pager: {
    flex: 1,
  },
});