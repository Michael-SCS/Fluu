import { useRouter } from "expo-router"
import { useState } from "react"
import {
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import GroceryBuilder from "@/components/GroceryBuilder"
import { taskTemplates } from "@/data/taskTemplates"
import { useTasksStore } from "@/store/tasksStore"

const DAYS = ["S", "M", "T", "W", "T", "F", "S"]
const REPEAT_OPTIONS = [
  { label: "Once",          value: "none"   },
  { label: "Daily",         value: "daily"  },
  { label: "Specific days", value: "weekly" },
] as const

const PURPLE      = "#7F77DD"
const PURPLE_SOFT = "#EEEDFE"
const PURPLE_DARK = "#534AB7"

export default function AddTask() {
  const router          = useRouter()
  const insets          = useSafeAreaInsets()
  const addTask         = useTasksStore((s) => s.addTask)
  const addGroceryTask  = useTasksStore((s) => s.addGroceryTask)

  const [title, setTitle]                   = useState("")
  const [description, setDescription]       = useState("")
  const [showCustom, setShowCustom]         = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [openGrocery, setOpenGrocery]       = useState(false)
  const [repeatType, setRepeatType]         = useState<"none" | "daily" | "weekly">("none")
  const [repeatDays, setRepeatDays]         = useState<number[]>([])

  /* ── GROCERY ── */
  if (openGrocery) {
    return (
      <View style={{ flex: 1 }}>
        <GroceryBuilder
          onFinish={(items: any) => {
            addGroceryTask(items)
            router.back()
          }}
        />
      </View>
    )
  }

  function createTask() {
    if (!title.trim()) return
    addTask(title, description, "Custom", repeatType, repeatDays)
    router.back()
  }

  function toggleDay(day: number) {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const groupedTemplates = taskTemplates.reduce((acc: any, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})

  /* ── REPEAT PICKER (reutilizable) ── */
  function RepeatPicker({
    onAdd,
    addLabel,
  }: {
    onAdd: () => void
    addLabel: string
  }) {
    return (
      <View style={styles.repeatBlock}>
        <Text style={styles.fieldLabel}>REPEAT</Text>
        <View style={styles.repeatRow}>
          {REPEAT_OPTIONS.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={[styles.repeatChip, repeatType === value && styles.repeatChipActive]}
              onPress={() => setRepeatType(value)}
            >
              <Text style={[styles.repeatChipText, repeatType === value && styles.repeatChipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {repeatType === "weekly" && (
          <View style={styles.daysRow}>
            {DAYS.map((d, i) => {
              const active = repeatDays.includes(i)
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayBtn, active && styles.dayBtnActive]}
                  onPress={() => toggleDay(i)}
                >
                  <Text style={[styles.dayText, active && styles.dayTextActive]}>{d}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addBtnText}>{addLabel}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.overline}>New task</Text>
          <Text style={styles.title}>Add a task</Text>
          <Text style={styles.subtitle}>Pick a template or create your own</Text>
        </View>

        {/* ── CUSTOM TASK ── */}
        <TouchableOpacity
          style={[styles.customToggle, showCustom && styles.customToggleOpen]}
          onPress={() => setShowCustom(!showCustom)}
          activeOpacity={0.8}
        >
          <View style={styles.customToggleIcon}>
            <Text style={styles.customToggleIconText}>✏️</Text>
          </View>
          <Text style={[styles.customToggleText, showCustom && styles.customToggleTextOpen]}>
            Create your own task
          </Text>
          <Text style={[styles.customToggleChevron, showCustom && styles.customToggleTextOpen]}>
            {showCustom ? "↑" : "↓"}
          </Text>
        </TouchableOpacity>

        {showCustom && (
          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>TITLE *</Text>
              <TextInput
                placeholder="What do you need to do?"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DESCRIPTION</Text>
              <TextInput
                placeholder="Optional details..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />
            </View>

            <RepeatPicker onAdd={createTask} addLabel="Create task" />
          </View>
        )}

        {/* ── TEMPLATES ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Templates</Text>
        </View>

        {Object.entries(groupedTemplates).map(([category, templates]: any) => (
          <View key={category} style={styles.categoryBlock}>
            <Text style={styles.categoryLabel}>{category}</Text>

            {templates.map((template: any) => {
              const isOpen    = selectedTemplate?.id === template.id
              const isGrocery = template.title.includes("Grocery")

              return (
                <View key={template.id} style={[styles.templateCard, isOpen && styles.templateCardOpen]}>
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedTemplate(isOpen ? null : template)
                    }
                    activeOpacity={0.75}
                  >
                    <View style={styles.templateRow}>
                      <View style={styles.templateBody}>
                        <Text style={styles.templateTitle}>{template.title}</Text>
                        <Text style={styles.templateDesc} numberOfLines={isOpen ? undefined : 1}>
                          {template.description}
                        </Text>
                      </View>
                      <View style={[styles.chevronWrap, isOpen && styles.chevronWrapActive]}>
                        <Text style={[styles.chevron, isOpen && styles.chevronActive]}>
                          {isOpen ? "↑" : "›"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {isOpen && (
                    isGrocery ? (
                      <TouchableOpacity
                        style={styles.personalizeBtn}
                        onPress={() => setOpenGrocery(true)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.personalizeIcon}>
                          <Text style={{ fontSize: 14 }}>🛒</Text>
                        </View>
                        <Text style={styles.personalizeBtnText}>Personalize grocery list</Text>
                        <Text style={styles.personalizeChevron}>›</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.divider}>
                        <RepeatPicker
                          onAdd={() => {
                            addTask(
                              template.title,
                              template.description,
                              template.category,
                              repeatType,
                              repeatDays
                            )
                            router.back()
                          }}
                          addLabel="Add task"
                        />
                      </View>
                    )
                  )}
                </View>
              )
            })}
          </View>
        ))}

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4F0",
  },
  body: {
    paddingHorizontal: 20,
    gap: 8,
  },

  /* ── HEADER ── */
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E0",
    marginBottom: 4,
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

  /* ── CUSTOM TOGGLE ── */
  customToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
  },
  customToggleOpen: {
    borderColor: "#CECBF6",
    backgroundColor: PURPLE_SOFT,
  },
  customToggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F4F0",
    alignItems: "center",
    justifyContent: "center",
  },
  customToggleIconText: {
    fontSize: 16,
  },
  customToggleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    letterSpacing: -0.2,
  },
  customToggleTextOpen: {
    color: PURPLE_DARK,
  },
  customToggleChevron: {
    fontSize: 16,
    color: "#B0AFA8",
  },

  /* ── FORM CARD ── */
  formCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#B0AFA8",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F5F4F0",
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
    borderRadius: 10,
    padding: 11,
    fontSize: 14,
    color: "#111",
    fontFamily: undefined,
  },

  /* ── REPEAT PICKER ── */
  repeatBlock: {
    gap: 10,
  },
  repeatRow: {
    flexDirection: "row",
    gap: 8,
  },
  repeatChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "#F5F4F0",
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
  },
  repeatChipActive: {
    backgroundColor: PURPLE_SOFT,
    borderColor: "#CECBF6",
  },
  repeatChipText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  repeatChipTextActive: {
    color: PURPLE_DARK,
    fontWeight: "600",
  },
  daysRow: {
    flexDirection: "row",
    gap: 6,
  },
  dayBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F4F0",
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
    alignItems: "center",
    justifyContent: "center",
  },
  dayBtnActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  dayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  dayTextActive: {
    color: "white",
  },
  addBtn: {
    backgroundColor: PURPLE,
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 2,
  },
  addBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  /* ── SECTION HEADER ── */
  sectionHeader: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    letterSpacing: -0.4,
  },

  /* ── CATEGORY ── */
  categoryBlock: {
    gap: 8,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B0AFA8",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    paddingHorizontal: 2,
    marginTop: 4,
  },

  /* ── TEMPLATE CARD ── */
  templateCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
  },
  templateCardOpen: {
    borderColor: "#CECBF6",
  },
  templateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  templateBody: {
    flex: 1,
    gap: 3,
  },
  templateTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    letterSpacing: -0.2,
  },
  templateDesc: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  chevronWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#F5F4F0",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronWrapActive: {
    backgroundColor: PURPLE_SOFT,
  },
  chevron: {
    fontSize: 16,
    color: "#B0AFA8",
    lineHeight: 20,
  },
  chevronActive: {
    color: PURPLE,
  },
  divider: {
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5E0",
    marginTop: 12,
    paddingTop: 14,
  },

  /* ── PERSONALIZE ── */
  personalizeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: PURPLE_SOFT,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: "#CECBF6",
  },
  personalizeIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  personalizeBtnText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: PURPLE_DARK,
  },
  personalizeChevron: {
    fontSize: 18,
    color: PURPLE,
  },
})