import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Dashboard() {
  const router = useRouter();
  const steps = useSelector((state: RootState) => state.steps.count);
  const distance = steps * 0.0008;
  const STEP_GOAL = 10000;
  const CALORIE_GOAL = 120;
  const calories = Math.min((steps / STEP_GOAL) * CALORIE_GOAL, CALORIE_GOAL);

  // Progress Ring Calculations
  const radius = 90;
  const strokeWidth = 20;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const progress = Math.min(steps / STEP_GOAL, 1);
  const strokeDashoffset = circumference * (1 - progress);

  const dayOfWeek = dayjs().format("dddd, DD MMM").toUpperCase();

  return (
    <ScrollView style={styles.container}>
      {/* Date Header */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{dayOfWeek}</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle" size={40} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Summary</Text>

      {/* Main Activity Ring Section */}
      <View style={styles.mainCard}>
        <View style={styles.ringContainer}>
          <Svg width={radius * 2} height={radius * 2}>
            {/* Background Circle */}
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              stroke="#1a1a1a"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Move (Steps) Progress Ring */}
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              stroke="#FF1744"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${radius}, ${radius}`}
            />
          </Svg>
          <View style={styles.ringLabel}>
            <Ionicons name="arrow-forward" size={24} color="#FF1744" />
          </View>
        </View>

        {/* Quick Stats inside Main Card */}
        <View style={styles.mainStats}>
          <Text style={styles.moveLabel}>Move</Text>
          <Text style={styles.calorieValue}>
            {Math.round(calories)}/
            <Text style={styles.calorieGoal}>{CALORIE_GOAL}</Text>
            <Text style={styles.calorieUnit}> KCAL</Text>
          </Text>
        </View>
      </View>

      {/* Metric Grid Section */}
      <View style={styles.grid}>
        <MetricCard
          icon="footsteps"
          label="Step Count"
          value={steps.toLocaleString()}
          unit=""
        />
        <MetricCard
          icon="navigate"
          label="Step Distance"
          value={distance.toFixed(2)}
          unit="KM"
        />
      </View>
    </ScrollView>
  );
}

// Helper component for the Metric Cards
function MetricCard({ icon, label, value, unit }: any) {
  return (
    <View style={styles.statBox}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#666"
          style={{ marginLeft: "auto" }}
        />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {unit && <Text style={styles.unitText}>{unit}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  dateText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },

  header: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 24,
  },

  // Main Activity Card Styling
  mainCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  ringContainer: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  ringLabel: { position: "absolute" },
  mainStats: { marginLeft: 24, flex: 1 },
  moveLabel: {
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  calorieValue: { color: "#FF1744", fontSize: 28, fontWeight: "bold" },
  calorieGoal: { color: "#FF1744" },
  calorieUnit: { fontSize: 14, color: "#666", marginLeft: 4 },

  // Grid Layout for metrics
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: "#1a1a1a",
    flex: 1,
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
    justifyContent: "space-between",
  },
  statHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  statLabel: { color: "#999", fontSize: 13, fontWeight: "500" },
  statValue: {
    color: "#9C27B0",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  unitText: { fontSize: 13, color: "#666" },
});
