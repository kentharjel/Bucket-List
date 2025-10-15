import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Animated, BackHandler, Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccount } from "../hooks/useAccount";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0]; // For fade-in animation

  const { createAccount } = useAccount();
  const router = useRouter(); // Ensure router is used correctly

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const signUpButton = async () => {
    Keyboard.dismiss();

    if (!username.trim() || !password.trim()) {
      Alert.alert("Error!", "Username and Password cannot be empty.");
      return;
    }

    const success = await createAccount({ username, password });
    
    if (success) {
      setUsername("");
      setPassword("");
      router.push('/success')
    } else {
      Alert.alert("Error!", "Username is already taken. Please choose another one.");
    }
  };

  const exitApp = () => {
    if (Platform.OS === "android") {
      Alert.alert(
        "Exit App",
        "Are you sure you want to exit?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() }
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <LinearGradient
      colors={["#ffffffff", "#000000ff"]} // Refined gradient for modernity
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={{ opacity: fadeAnim, flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} allowFontScaling={false}>
              BUCKET LIST
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.signupText} allowFontScaling={false}>
              Sign Up
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="gray" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create Username"
                placeholderTextColor="#b4b4b4"
                allowFontScaling={false}
                value={username}
                onChangeText={setUsername}
                accessibilityLabel="Username input"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create Password"
                placeholderTextColor="#b4b4b4"
                allowFontScaling={false}
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Password input"
              />
              <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeIconContainer}>
                <Ionicons name={secure ? "eye-off" : "eye"} size={22} color="gray" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={signUpButton} style={styles.button}>
              <Text style={styles.buttonText} allowFontScaling={false}>
                SIGN UP
              </Text>
            </TouchableOpacity>

            <Text style={styles.signinText} allowFontScaling={false}>
              Already have an account?{" "}
              <Link style={styles.signinLink} href="/">
                Sign In
              </Link>
            </Text>
          </View>

          <TouchableOpacity onPress={exitApp} style={styles.exitButton}>
            <Text style={styles.exitButtonText} allowFontScaling={false}>
              EXIT
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  formContainer: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  signupText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  eyeIconContainer: {
    padding: 5,
  },
  button: {
    backgroundColor: "royalblue",
    width: "100%",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  signinText: {
    fontSize: 16,
    marginTop: 15,
    color: "#ffffff",
    textAlign: "center",
  },
  signinLink: {
    color: "skyblue",
    fontWeight: "600",
  },
  exitButton: {
    marginTop: 20,
    backgroundColor: "gray",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    alignItems: "center",
  },
  exitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SignUp;
