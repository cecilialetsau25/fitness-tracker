import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // FIX: This removes the white background bar at the top
        headerShown: false,

        // STYLING: Matching your premium black/gold theme
        tabBarActiveTintColor: "#EAB308",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#050505", // Black background
          borderTopColor: "#222", // Subtle dark border
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
