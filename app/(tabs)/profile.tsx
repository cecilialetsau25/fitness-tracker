import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Profile() {
  // Pulling stats from your Redux store to make it "work"
  const activities = useSelector((state: RootState) => state.activities.list);
  const steps = useSelector((state: RootState) => state.steps.count);

  const totalWorkouts = activities.length;
  const totalCalories =
    activities.reduce((sum, a) => sum + a.calories, 0) + steps * 0.04;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
      <ScrollView style={{ padding: 24, flex: 1 }}>
        <Text
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 30,
          }}
        >
          Your Profile
        </Text>

        {/* User Header Section */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#111",
              borderWidth: 2,
              borderColor: "#EAB308",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 15,
            }}
          >
            <Ionicons name="person" size={50} color="#EAB308" />
          </View>
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            John Doe
          </Text>
          <Text style={{ color: "#64748b", fontSize: 14 }}>Pro Athlete</Text>
        </View>

        {/* Stats Grid - Matching the Explore Card Style */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#111",
              padding: 20,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: "#222",
              alignItems: "center",
            }}
          >
            <Ionicons name="flame" size={24} color="#EAB308" />
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 8,
              }}
            >
              {totalCalories.toFixed(0)}
            </Text>
            <Text
              style={{ color: "#64748b", fontSize: 10, fontWeight: "bold" }}
            >
              KCAL
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#111",
              padding: 20,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: "#222",
              alignItems: "center",
            }}
          >
            <Ionicons name="fitness" size={24} color="#EAB308" />
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 8,
              }}
            >
              {totalWorkouts}
            </Text>
            <Text
              style={{ color: "#64748b", fontSize: 10, fontWeight: "bold" }}
            >
              WORKOUTS
            </Text>
          </View>
        </View>

        {/* Personal Details Section */}
        <View
          style={{
            backgroundColor: "#111",
            padding: 20,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: "#222",
            marginBottom: 20,
          }}
        >
          <Text
            style={{ color: "#EAB308", fontWeight: "bold", marginBottom: 15 }}
          >
            Bio Metrics
          </Text>

          <DetailRow icon="body" label="Height" value="175 cm" />
          <DetailRow icon="speedometer" label="Weight" value="70 kg" />
          <DetailRow icon="trophy" label="Goal" value="Lose 5kg" />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={{
            backgroundColor: "#EAB308",
            padding: 20,
            borderRadius: 25,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: "900", textTransform: "uppercase" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            padding: 20,
            borderRadius: 25,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ef4444",
          }}
        >
          <Text style={{ color: "#ef4444", fontWeight: "bold" }}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for the rows
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Ionicons name={icon} size={20} color="#64748b" />
        <Text style={{ color: "white", fontWeight: "500" }}>{label}</Text>
      </View>
      <Text style={{ color: "white", fontWeight: "bold" }}>{value}</Text>
    </View>
  );
}
