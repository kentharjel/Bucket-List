import { Ionicons } from "@expo/vector-icons"; // Added for success icon
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef } from "react"; // Added for animation
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Success() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in animation

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Smooth 0.5-second fade-in
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={["#34831dff", "#236991ff"]} // Subtle modern gradient for a professional look
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.contentContainer}>
          <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
            <Ionicons name="checkmark-circle-outline" size={80} color="#ffffff" accessibilityLabel="Success icon" />
            <Text style={styles.successText}>
              You have successfully signed up!
            </Text>
            <Text style={styles.subText}>
              Sign In and Start exploring now.
            </Text>
          </Animated.View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/")}
            accessibilityLabel="Go back to sign in"
            accessibilityRole="button"
            activeOpacity={0.7} // Subtle press effect
          >
            <Ionicons name="arrow-back" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Go back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Subtle card effect
    borderRadius: 15,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Subtle elevation for modernity
    width: "90%", // Responsive width
  },
  successText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
  },
  subText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    textAlign: "center",
    opacity: 0.8, // Subtle fade for secondary text
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4c669f", // Matching the gradient for cohesion
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 30,
    width: "80%", // Full-width for easy access
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
