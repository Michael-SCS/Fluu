// --------------------------------------------------
// TAB LAYOUT
// Navegación inferior optimizada para Android/iOS
// Maneja safe areas + navigation bar + status bar
// --------------------------------------------------

import { Tabs } from "expo-router";
import React, { useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import * as NavigationBar from "expo-navigation-bar";

import { Platform } from "react-native";

export default function TabLayout() {

  // Detectar modo claro / oscuro
  const colorScheme = useColorScheme();

  // Detectar safe areas del dispositivo
  const insets = useSafeAreaInsets();

  // Tema actual
  const theme = Colors[colorScheme ?? "light"];

  // --------------------------------------------------
  // CONTROLAR BARRA DE NAVEGACIÓN ANDROID
  // --------------------------------------------------

  useEffect(() => {

    if (Platform.OS === "android") {

      // Color de la barra inferior
      NavigationBar.setBackgroundColorAsync(theme.background);

      // Color de los botones
      NavigationBar.setButtonStyleAsync(
        colorScheme === "dark" ? "light" : "dark"
      );

    }

  }, [colorScheme]);

  return (

    <>

      {/* -------------------------------------------------- */}
      {/* STATUS BAR SUPERIOR */}
      {/* -------------------------------------------------- */}

      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={theme.background}
      />

      {/* -------------------------------------------------- */}
      {/* TAB NAVIGATION */}
      {/* -------------------------------------------------- */}

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

            // altura total = base + safe area
            height: 60 + insets.bottom,

            // padding inferior para que no choque con nav bar
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

    </>

  );
}