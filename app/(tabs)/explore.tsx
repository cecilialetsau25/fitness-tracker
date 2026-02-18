import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addActivity } from "../store/activitiesSlice";

export default function Activity() {
  const dispatch = useDispatch<AppDispatch>();
  const activities = useSelector((state: RootState) => state.activities.list);
  const steps = useSelector((state: RootState) => state.steps.count);

  const [modalVisible, setModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutTime, setWorkoutTime] = useState(""); // "HH:MM"

  // Configure notifications on startup
  useEffect(() => {
    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Request notification permissions
    Notifications.requestPermissionsAsync();
  }, []);

  const handleSaveWorkout = async () => {
    if (!workoutName || !workoutTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate time format HH:MM
    const timeParts = workoutTime.split(":");
    if (timeParts.length !== 2) {
      Alert.alert("Error", "Time must be in HH:MM format");
      return;
    }

    const hours = Number(timeParts[0]);
    const minutes = Number(timeParts[1]);
    if (isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59) {
      Alert.alert("Error", "Invalid time entered");
      return;
    }

    const newWorkout = {
      id: Math.random().toString(),
      name: workoutName,
      calories: 0,
      time: workoutTime,
    };

    dispatch(addActivity(newWorkout));

    // Schedule reminder notification for the workout time
    try {
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0);
      scheduledTime.setSeconds(0);

      const now = new Date();
      let secondsUntilWorkout = Math.round(
        (scheduledTime.getTime() - now.getTime()) / 1000,
      );

      // If time has already passed, schedule for tomorrow
      if (secondsUntilWorkout < 0) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
        secondsUntilWorkout = Math.round(
          (scheduledTime.getTime() - now.getTime()) / 1000,
        );
      }

      if (secondsUntilWorkout > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Time for ${workoutName}! 🏋️`,
            body: "Your scheduled workout starts now!",
          },
          trigger: {
            type: "timeInterval" as any,
            seconds: secondsUntilWorkout,
          },
        } as any);
      }
    } catch (error) {
      console.log("Notification scheduling error:", error);
    }

    Alert.alert(
      "Success",
      `Workout "${workoutName}" scheduled for ${workoutTime}`,
    );

    setModalVisible(false);
    setWorkoutName("");
    setWorkoutTime("");
  };

  const caloriesFromSteps = steps * 0.04;
  const totalCalories =
    activities.reduce((sum, a) => sum + a.calories, 0) + caloriesFromSteps;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
      <View style={{ padding: 24, flex: 1 }}>
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

        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={cardStyle}>
              <View style={iconBoxStyle}>
                <Ionicons name="fitness" size={24} color="#EAB308" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  {item.name}
                </Text>
                <Text style={{ color: "#64748b", fontSize: 12 }}>
                  Scheduled: {item.time}
                </Text>
              </View>
              <Ionicons
                name="notifications-outline"
                size={18}
                color="#EAB308"
              />
            </View>
          )}
        />

        <View
          style={{
            marginVertical: 20,
            padding: 20,
            backgroundColor: "#111",
            borderRadius: 25,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Steps Today: {steps.toLocaleString()}
          </Text>
          <Text style={{ color: "#EAB308", fontWeight: "bold" }}>
            Calories from Steps: {caloriesFromSteps.toFixed(1)}
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Total Calories: {totalCalories.toFixed(1)}
          </Text>
        </View>

        <TouchableOpacity
          style={buttonStyle}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ fontWeight: "900", textTransform: "uppercase" }}>
            Schedule Workout
          </Text>
        </TouchableOpacity>

        {/* Modal for Adding Workout */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.8)",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#111",
                padding: 30,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                New Workout
              </Text>

              <TextInput
                placeholder="Workout Name"
                placeholderTextColor="#666"
                value={workoutName}
                onChangeText={setWorkoutName}
                style={inputStyle}
              />

              <TextInput
                placeholder="Time (HH:MM)"
                placeholderTextColor="#666"
                value={workoutTime}
                onChangeText={setWorkoutTime}
                style={inputStyle}
                keyboardType="numbers-and-punctuation"
              />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1, padding: 15, alignItems: "center" }}
                >
                  <Text style={{ color: "#64748b" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveWorkout}
                  style={{
                    flex: 1,
                    backgroundColor: "#EAB308",
                    padding: 15,
                    borderRadius: 15,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Set Reminder</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// Styles
const cardStyle: any = {
  backgroundColor: "#111",
  padding: 20,
  borderRadius: 25,
  marginBottom: 12,
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#222",
};
const iconBoxStyle: any = {
  backgroundColor: "rgba(234, 179, 8, 0.1)",
  padding: 12,
  borderRadius: 15,
  marginRight: 15,
};
const buttonStyle: any = {
  backgroundColor: "#EAB308",
  padding: 20,
  borderRadius: 25,
  alignItems: "center",
};
const inputStyle: any = {
  backgroundColor: "#000",
  color: "white",
  padding: 15,
  borderRadius: 15,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: "#222",
};
