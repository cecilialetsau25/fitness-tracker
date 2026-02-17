import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store";

export default function TabLayout() {
  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#2E86AB",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Activity",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="barbell-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </Provider>
  );
}
