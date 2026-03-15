import { useRouter } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { useHabitStore } from "@/store/habitStore"

import DeleteHabitModal from "./DeleteHabitModal"
import HabitActionModal from "./HabitActionModal"

export default function HabitCard({ habit }: any) {
  const router             = useRouter()
  const increment          = useHabitStore((s) => s.incrementHabitProgress)
  const deleteHabit        = useHabitStore((s) => s.deleteHabit)
  const deleteHabitForToday = useHabitStore((s) => s.deleteHabitForToday)

  const [menuVisible,   setMenuVisible]   = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)

  const done     = habit.progress >= habit.goal
  const progress = Math.min(habit.progress / habit.goal, 1)

  return (
    <>
      <TouchableOpacity
        style={[styles.card, done && styles.cardDone]}
        onPress={() => increment(habit.id)}
        onLongPress={() => setMenuVisible(true)}
        activeOpacity={0.75}
      >
        {/* icon */}
        <View style={[styles.iconWrap, done && styles.iconWrapDone]}>
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>

        {/* body */}
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.title, done && styles.titleDone]}>
            {habit.title}
          </Text>
          <Text style={[styles.description, done && styles.descDone]} numberOfLines={1}>
            {habit.description}
          </Text>

          {/* progress bar */}
          <View style={[styles.track, done && styles.trackDone]}>
            <View
              style={[
                styles.fill,
                done && styles.fillDone,
                { width: `${progress * 100}%` as any },
              ]}
            />
          </View>
        </View>

        {/* counter pill */}
        <View style={[styles.pill, done && styles.pillDone]}>
          <Text style={[styles.pillText, done && styles.pillTextDone]}>
            {habit.progress}/{habit.goal}
          </Text>
          {done && <Text style={styles.pillCheck}>✓</Text>}
        </View>
      </TouchableOpacity>

      <HabitActionModal
        visible={menuVisible}
        habitTitle={habit.title}
        onClose={() => setMenuVisible(false)}
        onEdit={() => {
          setMenuVisible(false)
          router.push(`/habit-config/${habit.templateId}?id=${habit.id}`)
        }}
        onDelete={() => {
          setMenuVisible(false)
          setDeleteVisible(true)
        }}
      />

      <DeleteHabitModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        onDeleteToday={() => {
          deleteHabitForToday(habit.id)
          setDeleteVisible(false)
        }}
        onDeleteAll={() => {
          deleteHabit(habit.id)
          setDeleteVisible(false)
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardDone: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },

  /* icon */
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#F5F4F0",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconWrapDone: {
    backgroundColor: "#DCFCE7",
  },
  icon: {
    fontSize: 24,
  },

  /* text */
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    letterSpacing: -0.2,
  },
  titleDone: {
    color: "#166534",
  },
  description: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  descDone: {
    color: "#4ADE80",
  },

  /* progress bar */
  track: {
    height: 3,
    backgroundColor: "#F0EFEB",
    borderRadius: 99,
    marginTop: 2,
    overflow: "hidden",
  },
  trackDone: {
    backgroundColor: "#BBF7D0",
  },
  fill: {
    height: 3,
    backgroundColor: "#7F77DD",
    borderRadius: 99,
  },
  fillDone: {
    backgroundColor: "#22C55E",
  },

  /* pill */
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F4F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
    flexShrink: 0,
  },
  pillDone: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC",
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  pillTextDone: {
    color: "#166534",
  },
  pillCheck: {
    fontSize: 11,
    color: "#22C55E",
    fontWeight: "700",
  },
})