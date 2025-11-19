import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTheme } from "@/components/ThemeContext";

export default function Layout() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00C18A",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: isDark ? "#111" : "#FFF",
          borderTopColor: isDark ? "#222" : "#ddd",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -6,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Maps */}
      <Tabs.Screen
        name="Favorites/index"
        options={{
          title: "Mapas",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Favorites */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Account */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Conta",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
