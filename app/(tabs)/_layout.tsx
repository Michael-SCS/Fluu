// --------------------------------------------------
// TAB LAYOUT
// Navegación inferior optimizada para Android/iOS
// Maneja correctamente navigation bar y safe areas
// --------------------------------------------------

import { Tabs } from "expo-router";
import React from "react";

import { Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {

  // Detectar modo claro / oscuro
  const colorScheme = useColorScheme();

  // Detectar safe areas del dispositivo
  const insets = useSafeAreaInsets();

  // Tema actual
  const theme = Colors[colorScheme ?? "light"];

  return (

    <Tabs
      screenOptions={{

        headerShown: false,

        tabBarButton: HapticTab,

        tabBarActiveTintColor: theme.tint,

        tabBarInactiveTintColor: "#8e8e93",

        // --------------------------------------------------
        // TAB BAR STYLE
        // --------------------------------------------------

        tabBarStyle: {

          // altura total = altura base + safe area
          height: 60 + insets.bottom,

          // padding inferior solo para iconos
          paddingBottom: insets.bottom,

          paddingTop: 6,

          backgroundColor: theme.background,

          borderTopWidth: 0,

          elevation: 8,

        },

        tabBarLabelStyle: {

          fontSize: 12,

        },

      }}
    >

      {/* TODAY */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Today",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "today" : "today-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* CALENDAR */}

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

    </Tabs>

  );
}