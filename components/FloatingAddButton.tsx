import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MENU_ITEMS = [
  { label: "New task", icon: "checkmark-circle-outline", route: "/add-task" },
  { label: "New habit", icon: "repeat-outline", route: "/add-habit" },
  { label: "New focus", icon: "timer-outline", route: "/add-focus" },
];

export default function FloatingAddButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef(MENU_ITEMS.map(() => new Animated.Value(0))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  function openMenu() {
    setOpen(true);
    Animated.timing(rotateAnim, {
      toValue: 1, duration: 200, useNativeDriver: true,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 180, useNativeDriver: true,
    }).start();
    itemAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: 1,
        delay: i * 40,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }).start();
    });
  }

  function closeMenu() {
    Animated.timing(rotateAnim, {
      toValue: 0, duration: 180, useNativeDriver: true,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 0, duration: 150, useNativeDriver: true,
    }).start();
    Animated.parallel(
      itemAnims.map((anim) =>
        Animated.timing(anim, { toValue: 0, duration: 150, useNativeDriver: true })
      )
    ).start(() => setOpen(false));
  }

  function toggle() {
    open ? closeMenu() : openMenu();
  }

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <>
      {/* backdrop tenue */}
      {open && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <Animated.View
            style={[styles.backdrop, { opacity: fadeAnim }]}
          />
        </TouchableOpacity>
      )}

      <View style={[styles.container, { bottom: insets.bottom + 24 }]}>

        {/* MENU ITEMS */}
        {open && (
          <View style={styles.menu}>
            {MENU_ITEMS.map(({ label, icon, route }, i) => {
              const translateY = itemAnims[i].interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              });
              return (
                <Animated.View
                  key={route}
                  style={{
                    opacity: itemAnims[i],
                    transform: [{ translateY }],
                  }}
                >
                  <TouchableOpacity
                    style={styles.option}
                    activeOpacity={0.8}
                    onPress={() => {
                      closeMenu();
                      setTimeout(() => router.push(route as any), 160);
                    }}
                  >
                    <View style={styles.optionIcon}>
                      <Ionicons name={icon as any} size={16} color="#7F77DD" />
                    </View>
                    <Text style={styles.optionText}>{label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* FAB */}
        <TouchableOpacity
          style={[styles.fab, open && styles.fabOpen]}
          onPress={toggle}
          activeOpacity={0.9}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="add" size={28} color="white" />
          </Animated.View>
        </TouchableOpacity>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  container: {
    position: "absolute",
    right: 24,
    alignItems: "flex-end",
    zIndex: 999,
    elevation: 10
  },

  /* ── MENU ── */
  menu: {
    marginBottom: 14,
    gap: 8,
    alignItems: "flex-end",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#E5E5E0",
  },

  optionIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#EEEDFE",
    alignItems: "center",
    justifyContent: "center",
  },

  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    letterSpacing: -0.2,
  },

  /* ── FAB ── */
  fab: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#7F77DD",
    justifyContent: "center",
    alignItems: "center",
  },

  fabOpen: {
    backgroundColor: "#534AB7",
  },
});