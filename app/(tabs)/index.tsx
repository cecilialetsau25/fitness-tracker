import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Pedometer from "expo-sensors/build/Pedometer";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setSteps } from "../store/stepsSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const steps = useSelector((state: RootState) => state.steps.count);
  const activities = useSelector((state: RootState) => state.activities.list);

  const STEP_GOAL = 10000;

  const [countdown, setCountdown] = useState<string>("--:--:--");

  // Pedometer subscription
  useEffect(() => {
    let subscription: any;

    Pedometer.isAvailableAsync().then((available) => {
      if (available) {
        subscription = Pedometer.watchStepCount((result) => {
          dispatch(setSteps(result.steps));
        });
      }
    });

    return () => subscription?.remove();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Filter future workouts
      const upcomingWorkouts = activities
        .map((a) => {
          const [h, m] = a.time.split(":").map(Number);
          const workoutDate = new Date();
          workoutDate.setHours(h, m, 0, 0);
          return workoutDate > now ? { ...a, workoutDate } : null;
        })
        .filter(Boolean) as any[];

      if (upcomingWorkouts.length > 0) {
        // Find the next workout
        const nextWorkout = upcomingWorkouts.reduce((prev, curr) =>
          prev.workoutDate < curr.workoutDate ? prev : curr,
        );
        const diff = nextWorkout.workoutDate.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      } else {
        setCountdown("--:--:--");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activities]);

  const caloriesBurned = (steps * 0.04).toFixed(1);
  const progressPercent = Math.min((steps / STEP_GOAL) * 100, 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <Text
          style={{
            color: "#64748b",
            fontSize: 12,
            fontWeight: "900",
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          OVERVIEW
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 30,
          }}
        >
          Fitness <Text style={{ color: "#EAB308" }}>Tracker</Text>
        </Text>

        {/* Steps Card */}
        <View
          style={{
            backgroundColor: "#EAB308",
            padding: 30,
            borderRadius: 40,
            marginBottom: 20,
          }}
        >
          <Ionicons
            name="footsteps"
            size={28}
            color="black"
            style={{ marginBottom: 12 }}
          />
          <Text
            style={{
              color: "black",
              fontSize: 14,
              fontWeight: "900",
              opacity: 0.6,
            }}
          >
            STEPS TODAY
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: 64,
              fontWeight: "bold",
              letterSpacing: -2,
            }}
          >
            {steps.toLocaleString()}
          </Text>

          {/* Progress Bar */}
          <View
            style={{
              height: 8,
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: 4,
              marginTop: 12,
            }}
          >
            <View
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                backgroundColor: "black",
                borderRadius: 4,
              }}
            />
          </View>
          <Text style={{ color: "black", marginTop: 6, fontWeight: "bold" }}>
            Goal: {STEP_GOAL.toLocaleString()} steps
          </Text>
        </View>

        {/* Next Workout Countdown */}
        <View
          style={{
            backgroundColor: "#111",
            padding: 20,
            borderRadius: 25,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#64748b", fontSize: 14, marginBottom: 6 }}>
            NEXT WORKOUT IN
          </Text>
          <Text style={{ color: "#EAB308", fontSize: 28, fontWeight: "bold" }}>
            {countdown}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: "row", gap: 15, marginBottom: 30 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#111",
              padding: 20,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#222",
              alignItems: "center",
            }}
          >
            <Ionicons name="flame" size={24} color="#EAB308" />
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 8,
              }}
            >
              {caloriesBurned}
            </Text>
            <Text
              style={{ color: "#64748b", fontSize: 12, fontWeight: "bold" }}
            >
              KCAL BURNED
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/explore")}
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 25,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            View Activity
          </Text>
          <Ionicons name="arrow-forward" size={18} color="black" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
