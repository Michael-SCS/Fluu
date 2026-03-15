import { useRef, useState } from "react"
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

type GroceryItem = {
  id: string
  name: string
  quantity: number
  price: number
  checked: boolean
}

export default function GroceryBuilder({ onFinish }: { onFinish: (items: GroceryItem[]) => void }) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [items, setItems] = useState<GroceryItem[]>([])

  const nameRef = useRef<TextInput>(null)
  const qtyRef = useRef<TextInput>(null)
  const priceRef = useRef<TextInput>(null)

  function addItem() {
    if (!name.trim()) { nameRef.current?.focus(); return }
    setItems((prev) => [
      {
        id: Date.now().toString(),
        name: name.trim(),
        quantity: Number(quantity) || 1,
        price: Number(price) || 0,
        checked: false,
      },
      ...prev,
    ])
    setName("")
    setQuantity("")
    setPrice("")
    nameRef.current?.focus()
  }

  function toggleItem(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)))
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clearChecked() {
    setItems((prev) => prev.filter((i) => !i.checked))
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0)
  const checkedCount = items.filter((i) => i.checked).length

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Grocery list</Text>
            <Text style={styles.subtitle}>Tap to mark as picked up</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {items.length} {items.length === 1 ? "item" : "items"}
            </Text>
          </View>
        </View>

        <View style={styles.inputCard}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>PRODUCT</Text>
            <TextInput
              ref={nameRef}
              placeholder="e.g. Whole milk"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              onSubmitEditing={() => qtyRef.current?.focus()}
              returnKeyType="next"
              style={styles.input}
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>QTY</Text>
              <TextInput
                ref={qtyRef}
                placeholder="1"
                placeholderTextColor="#9CA3AF"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                onSubmitEditing={() => priceRef.current?.focus()}
                returnKeyType="next"
                style={styles.input}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>PRICE</Text>
              <TextInput
                ref={priceRef}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                onSubmitEditing={addItem}
                returnKeyType="done"
                style={styles.input}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addItem} activeOpacity={0.85}>
            <Text style={styles.addButtonText}>+ Add item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listLabel}>ITEMS</Text>
            {checkedCount > 0 && (
              <TouchableOpacity onPress={clearChecked}>
                <Text style={styles.clearText}>Remove checked</Text>
              </TouchableOpacity>
            )}
          </View>
          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No items yet — add something above</Text>
            </View>
          ) : (
            items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={() => toggleItem(item.id)}
                onDelete={() => deleteItem(item.id)}
              />
            ))
          )}
        </View>

        {items.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Checked</Text>
              <Text style={styles.summaryValue}>{checkedCount} / {items.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.doneButton, items.length === 0 && styles.doneButtonDisabled]}
          onPress={() => onFinish(items)}
          disabled={items.length === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.doneButtonText}>Finish shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function ItemRow({
  item,
  onToggle,
  onDelete,
}: {
  item: GroceryItem
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <TouchableOpacity
      style={[styles.itemRow, item.checked && styles.itemRowChecked]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
        {item.checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.checked && styles.itemNameChecked]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemMeta}>
          {item.quantity} {item.quantity === 1 ? "unit" : "units"}
          {item.price > 0 ? ` · $${item.price.toFixed(2)} each` : ""}
        </Text>
      </View>
      {item.price > 0 && (
        <Text style={[styles.itemSubtotal, item.checked && styles.itemSubtotalChecked]}>
          ${(item.quantity * item.price).toFixed(2)}
        </Text>
      )}
      <TouchableOpacity
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteBtnText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const PURPLE = "#7F77DD"
const PURPLE_DARK = "#534AB7"
const GREEN = "#1D9E75"

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F4F0" },
  scroll: { flex: 1 },
  container: { padding: 20, paddingBottom: 48, gap: 14 },

  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: "#E5E5E0" },
  title: { fontSize: 24, fontWeight: "600", color: "#111", letterSpacing: -0.4 },
  subtitle: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },
  badge: { backgroundColor: "#EEEDFE", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 },
  badgeText: { fontSize: 12, color: PURPLE_DARK, fontWeight: "600" },

  inputCard: { backgroundColor: "white", borderRadius: 14, padding: 14, gap: 12, borderWidth: 0.5, borderColor: "#E5E5E0" },
  field: { gap: 4 },
  fieldLabel: { fontSize: 10, fontWeight: "600", color: "#9CA3AF", letterSpacing: 0.7 },
  input: { backgroundColor: "#F9F9F7", borderWidth: 0.5, borderColor: "#E5E5E0", borderRadius: 10, padding: 10, fontSize: 14, color: "#111" },
  row: { flexDirection: "row", gap: 10 },

  addButton: { backgroundColor: PURPLE, padding: 12, borderRadius: 10, alignItems: "center" },
  addButtonText: { color: "white", fontSize: 14, fontWeight: "600" },

  listSection: { gap: 8 },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 2 },
  listLabel: { fontSize: 10, fontWeight: "600", color: "#9CA3AF", letterSpacing: 0.7 },
  clearText: { fontSize: 12, color: "#E24B4A" },

  emptyState: { borderWidth: 0.5, borderStyle: "dashed", borderColor: "#D1D5DB", borderRadius: 14, padding: 28, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#9CA3AF" },

  itemRow: { backgroundColor: "white", borderWidth: 0.5, borderColor: "#E5E5E0", borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  itemRowChecked: { opacity: 0.45 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: PURPLE, alignItems: "center", justifyContent: "center" },
  checkboxChecked: { backgroundColor: PURPLE, borderColor: PURPLE },
  checkmark: { color: "white", fontSize: 11, fontWeight: "700" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: "500", color: "#111" },
  itemNameChecked: { textDecorationLine: "line-through", color: "#9CA3AF" },
  itemMeta: { fontSize: 12, color: "#9CA3AF", marginTop: 1 },
  itemSubtotal: { fontSize: 14, fontWeight: "600", color: "#111" },
  itemSubtotalChecked: { color: "#9CA3AF" },
  deleteBtn: { padding: 4 },
  deleteBtnText: { fontSize: 13, color: "#C4C4BF" },

  summaryCard: { backgroundColor: "white", borderRadius: 14, padding: 16, borderWidth: 0.5, borderColor: "#E5E5E0", gap: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 13, color: "#6B7280" },
  summaryValue: { fontSize: 13, fontWeight: "500", color: "#111" },
  divider: { height: 0.5, backgroundColor: "#E5E5E0" },
  totalLabel: { fontSize: 15, fontWeight: "600", color: "#111" },
  totalValue: { fontSize: 22, fontWeight: "700", color: PURPLE_DARK, letterSpacing: -0.5 },

  doneButton: { backgroundColor: GREEN, padding: 14, borderRadius: 14, alignItems: "center" },
  doneButtonDisabled: { backgroundColor: "#E5E7EB" },
  doneButtonText: { color: "white", fontSize: 15, fontWeight: "600" },
})