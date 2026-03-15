import { useState } from "react"
import {
    Animated,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

import { useTasksStore } from "@/store/tasksStore"

export default function TaskCard({ task }: any) {
  const toggleTask = useTasksStore((s) => s.toggleTask)
  const deleteTask = useTasksStore((s) => s.deleteTask)
  const toggleItem = useTasksStore((s) => s.toggleItem)

  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const slideAnim = useState(new Animated.Value(300))[0]

  function openMenu() {
    setMenuOpen(true)
    Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start()
  }

  function closeMenu() {
    Animated.timing(slideAnim, { toValue: 300, duration: 180, useNativeDriver: true }).start(
      () => setMenuOpen(false)
    )
  }

  /* =========================
     GROCERY CARD
  ========================= */

  if (task.type === "grocery") {
    const total: number = task.items?.reduce(
      (sum: number, i: any) => sum + i.quantity * i.price, 0
    ) ?? 0

    const preview = task.items?.slice(0, 3) ?? []
    const completed = task.items?.filter((i: any) => i.checked).length ?? 0
    const itemCount = task.items?.length ?? 0
    const progress = itemCount > 0 ? completed / itemCount : 0

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => setOpen(true)}
        onLongPress={openMenu}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.cardIconWrap}>
            <Text style={styles.cardIcon}>🛒</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Grocery list</Text>
            <Text style={styles.cardMeta}>
              {completed}/{itemCount} items picked up
            </Text>
          </View>
          <Text style={styles.cardTotal}>${total.toFixed(2)}</Text>
        </View>

        {/* progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>

        {/* preview items */}
        {preview.length > 0 && (
          <View style={styles.previewList}>
            {preview.map((item: any) => (
              <View key={item.id} style={styles.previewRow}>
                <View style={[styles.previewDot, item.checked && styles.previewDotDone]} />
                <Text style={[styles.previewText, item.checked && styles.previewTextDone]}>
                  {item.name}
                </Text>
                {item.price > 0 && (
                  <Text style={styles.previewPrice}>
                    ${(item.quantity * item.price).toFixed(2)}
                  </Text>
                )}
              </View>
            ))}
            {itemCount > 3 && (
              <Text style={styles.previewMore}>+{itemCount - 3} more</Text>
            )}
          </View>
        )}

        {/* CHECKLIST MODAL */}
        <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Grocery list</Text>
                <Text style={styles.modalSubtitle}>Tap items to mark as picked up</Text>
              </View>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>{completed}/{itemCount}</Text>
              </View>
            </View>

            <FlatList
              data={task.items}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ gap: 8, paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.itemCard, item.checked && styles.itemCardChecked]}
                  onPress={() => toggleItem(task.id, item.id)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                    {item.checked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, item.checked && styles.itemNameDone]}>
                      {item.name}
                    </Text>
                    {item.price > 0 && (
                      <Text style={styles.itemMeta}>
                        {item.quantity} × ${item.price.toFixed(2)}
                      </Text>
                    )}
                  </View>
                  {item.price > 0 && (
                    <Text style={[styles.itemSubtotal, item.checked && styles.itemSubtotalDone]}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />

            <View style={styles.totalBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Items</Text>
                <Text style={styles.totalVal}>{itemCount}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Checked</Text>
                <Text style={styles.totalVal}>{completed} / {itemCount}</Text>
              </View>
              <View style={styles.totalDivider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabelBig}>Total</Text>
                <Text style={styles.totalValueBig}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={styles.closeBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* BOTTOM SHEET MENU */}
        <Modal transparent visible={menuOpen} animationType="none" onRequestClose={closeMenu}>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeMenu}>
            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.sheetHandle} />
              <TouchableOpacity style={styles.sheetButton}>
                <Text style={styles.sheetText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sheetButton}
                onPress={() => { deleteTask(task.id); closeMenu() }}
              >
                <Text style={[styles.sheetText, { color: "#E24B4A" }]}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetCancel} onPress={closeMenu}>
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      </TouchableOpacity>
    )
  }

  /* =========================
     NORMAL TASK
  ========================= */

  return (
    <TouchableOpacity
      style={[styles.card, task.completed && styles.cardCompleted]}
      activeOpacity={0.9}
      onPress={() => toggleTask(task.id)}
      onLongPress={openMenu}
    >
      <View style={styles.cardTopRow}>
        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, task.completed && styles.taskDone]}>
            {task.title}
          </Text>
          {!!task.description && (
            <Text style={styles.cardMeta}>{task.description}</Text>
          )}
        </View>
      </View>

      {/* BOTTOM SHEET MENU */}
      <Modal transparent visible={menuOpen} animationType="none" onRequestClose={closeMenu}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeMenu}>
          <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.sheetHandle} />
            <TouchableOpacity style={styles.sheetButton}>
              <Text style={styles.sheetText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetButton}
              onPress={() => { deleteTask(task.id); closeMenu() }}
            >
              <Text style={[styles.sheetText, { color: "#E24B4A" }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetCancel} onPress={closeMenu}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  )
}

const PURPLE = "#7F77DD"
const PURPLE_DARK = "#534AB7"
const GREEN = "#1D9E75"

const styles = StyleSheet.create({
  /* ── CARD ── */
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
  },
  cardCompleted: {
    opacity: 0.6,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F5F4F0",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: { fontSize: 20 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    letterSpacing: -0.2,
  },
  cardMeta: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },
  cardTotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  taskDone: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },

  /* ── PROGRESS ── */
  progressTrack: {
    height: 3,
    backgroundColor: "#F0EFEB",
    borderRadius: 99,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    backgroundColor: GREEN,
    borderRadius: 99,
  },

  /* ── PREVIEW ── */
  previewList: {
    marginTop: 10,
    gap: 6,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
  },
  previewDotDone: {
    backgroundColor: GREEN,
  },
  previewText: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
  },
  previewTextDone: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  previewPrice: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  previewMore: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    marginLeft: 14,
  },

  /* ── CHECKBOX ── */
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  checkmark: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },

  /* ── MODAL ── */
  modal: {
    flex: 1,
    backgroundColor: "#F5F4F0",
    paddingHorizontal: 20,
    paddingTop: 52,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E0",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
    letterSpacing: -0.4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  modalBadge: {
    backgroundColor: "#EEEDFE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  modalBadgeText: {
    fontSize: 12,
    color: PURPLE_DARK,
    fontWeight: "600",
  },

  /* ── ITEM CARD ── */
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
  },
  itemCardChecked: {
    opacity: 0.45,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  itemNameDone: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  itemMeta: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  itemSubtotalDone: {
    color: "#9CA3AF",
  },

  /* ── TOTAL BOX ── */
  totalBox: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
    gap: 9,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  totalVal: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111",
  },
  totalDivider: {
    height: 0.5,
    backgroundColor: "#E5E5E0",
  },
  totalLabelBig: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  totalValueBig: {
    fontSize: 22,
    fontWeight: "700",
    color: PURPLE_DARK,
    letterSpacing: -0.5,
  },

  /* ── CLOSE BUTTON ── */
  closeBtn: {
    backgroundColor: GREEN,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
    marginBottom: 32,
  },
  closeBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  /* ── BOTTOM SHEET ── */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 99,
    alignSelf: "center",
    marginVertical: 12,
  },
  sheetButton: {
    padding: 16,
    alignItems: "center",
  },
  sheetText: {
    fontSize: 16,
    color: "#111",
  },
  sheetCancel: {
    padding: 16,
    alignItems: "center",
  },
  sheetCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
})