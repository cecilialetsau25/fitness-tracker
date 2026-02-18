import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from ".";
import { updateUser } from "./userSlice";

export default function Profile() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user.name);
  const [goals, setGoals] = useState(user.goals);
  const [height, setHeight] = useState(user.height.toString());
  const [weight, setWeight] = useState(user.weight.toString());
  const [calorieGoal, setCalorieGoal] = useState(user.calorieGoal.toString());

  // Calculate BMI and fitness stats
  const stats = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w) return null;

    const bmi = w / (h / 100) ** 2;
    let category = "Normal";
    let categoryColor = "#00BCD4";

    if (bmi < 18.5) {
      category = "Underweight";
      categoryColor = "#2196F3";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal";
      categoryColor = "#4CAF50";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      categoryColor = "#FF9800";
    } else {
      category = "Obese";
      categoryColor = "#F44336";
    }

    const idealWeightMin = (18.5 * (h / 100) ** 2).toFixed(1);
    const idealWeightMax = (24.9 * (h / 100) ** 2).toFixed(1);

    return {
      bmi: bmi.toFixed(1),
      category,
      categoryColor,
      idealWeightMin,
      idealWeightMax,
    };
  }, [height, weight]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (!height || !weight) {
      Alert.alert("Error", "Please enter your height and weight");
      return;
    }

    dispatch(
      updateUser({
        name: name.trim(),
        goals: goals.trim(),
        height: Number(height),
        weight: Number(weight),
        calorieGoal: Number(calorieGoal) || 120,
      }),
    );

    Alert.alert("Success", "Profile saved successfully!");
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? "Edit Profile" : "Your Profile"}
        </Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Ionicons
            name={isEditing ? "close" : "create"}
            size={28}
            color="#FF1744"
          />
        </TouchableOpacity>
      </View>

      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={100} color="#FF1744" />
        <Text style={styles.nameDisplay}>{name}</Text>
      </View>

      {isEditing ? (
        /* EDIT MODE */
        <>
          <View style={styles.formContainer}>
            {/* Name Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#666"
              />
            </View>

            {/* Goals Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Fitness Goals</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={goals}
                onChangeText={setGoals}
                placeholder="e.g., Lose 5kg, Build muscle"
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Height and Weight Row */}
            <View style={styles.rowContainer}>
              <View style={[styles.fieldGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={height}
                  keyboardType="numeric"
                  onChangeText={setHeight}
                  placeholder="170"
                  placeholderTextColor="#666"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  keyboardType="numeric"
                  onChangeText={setWeight}
                  placeholder="70"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            {/* Calorie Goal Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Daily Calorie Goal (KCAL)</Text>
              <TextInput
                style={styles.input}
                value={calorieGoal}
                keyboardType="numeric"
                onChangeText={setCalorieGoal}
                placeholder="120"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </>
      ) : (
        /* VIEW MODE */
        <>
          {/* BMI Stats Card */}
          {stats && (
            <View style={styles.statsCard}>
              <View style={styles.bmiContainer}>
                <Text style={styles.statLabel}>BMI</Text>
                <Text style={[styles.bmiValue, { color: stats.categoryColor }]}>
                  {stats.bmi}
                </Text>
                <Text
                  style={[styles.bmiCategory, { color: stats.categoryColor }]}
                >
                  {stats.category}
                </Text>
              </View>
              <View style={styles.statsDivider} />
              <View style={styles.healthMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Height</Text>
                  <Text style={styles.metricValue}>{height} cm</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Weight</Text>
                  <Text style={styles.metricValue}>{weight} kg</Text>
                </View>
              </View>
            </View>
          )}

          {/* Health Info */}
          {stats && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Health Insights</Text>
              <Text style={styles.infoText}>
                Ideal Weight: {stats.idealWeightMin} - {stats.idealWeightMax} kg
              </Text>
              <Text style={styles.infoText}>Goals: {goals || "Not set"}</Text>
              <Text style={styles.infoText}>
                Daily Calorie Goal: {calorieGoal || "120"} KCAL
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  nameDisplay: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 12,
  },
  formContainer: {
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 12,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  multilineInput: {
    textAlignVertical: "top",
    paddingTop: 14,
  },
  rowContainer: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#FF1744",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
  statsCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FF1744",
    flexDirection: "row",
    alignItems: "center",
  },
  bmiContainer: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  bmiValue: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bmiCategory: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsDivider: {
    width: 1,
    height: 60,
    backgroundColor: "#333",
    marginHorizontal: 20,
  },
  healthMetrics: {
    flex: 1,
    gap: 12,
  },
  metric: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  infoBox: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF1744",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  infoText: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 8,
  },
});
