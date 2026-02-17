import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  Activity as ActivityType,
  addActivity,
} from "../store/activitiesSlice";

export default function Activity() {
  const dispatch = useDispatch<AppDispatch>();

  // Get activities and steps from Redux
  const activities = useSelector((state: RootState) => state.activities.list);
  const steps = useSelector((state: RootState) => state.steps.count);

  // Total calories = sum of activity calories + calories from steps
  const caloriesFromSteps = steps * 0.04;
  const totalCalories =
    activities.reduce((sum, a) => sum + a.calories, 0) + caloriesFromSteps;

  // Add new workout
  const handleAddWorkout = () => {
    const newWorkout: ActivityType = {
      id: (activities.length + 1).toString(),
      name: "New Workout",
      calories: 0,
      time: new Date().toLocaleTimeString(),
    };
    dispatch(addActivity(newWorkout));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
      <View style={{ padding: 24, flex: 1 }}>
        {/* Header */}
        <Text
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Your Activities
        </Text>

        {/* List of activities */}
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#111",
                padding: 20,
                borderRadius: 25,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#222",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(234, 179, 8, 0.1)",
                  padding: 12,
                  borderRadius: 15,
                  marginRight: 15,
                }}
              >
                <Ionicons name="fitness" size={24} color="#EAB308" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  {item.name}
                </Text>
                <Text style={{ color: "#64748b", fontSize: 12 }}>
                  {item.time}
                </Text>
              </View>

              <Text style={{ color: "#EAB308", fontWeight: "bold" }}>
                +{item.calories} kcal
              </Text>
            </View>
          )}
        />

        {/* Steps & Calories Summary */}
        <View
          style={{
            marginBottom: 20,
            padding: 20,
            backgroundColor: "#111",
            borderRadius: 25,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Steps Today: {steps.toLocaleString()}
          </Text>
          <Text style={{ color: "#EAB308", fontWeight: "bold" }}>
            Calories Burned from Steps: {caloriesFromSteps.toFixed(1)}
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Total Calories (Workouts + Steps): {totalCalories.toFixed(1)}
          </Text>
        </View>

        {/* Add Workout Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#EAB308",
            padding: 20,
            borderRadius: 25,
            alignItems: "center",
          }}
          onPress={handleAddWorkout}
        >
          <Text
            style={{
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Add New Workout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
