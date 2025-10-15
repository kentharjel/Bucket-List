import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccount } from "../hooks/useAccount";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false); // 🔹 Loading state
  const fadeAnim = useState(new Animated.Value(0))[0];

  const { fetchAccount } = useAccount();

  // 🔹 Fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // 🔹 Handle Sign In
  const signInButton = async () => {
    if (loading) return; // prevent double clicks
    Keyboard.dismiss();

    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    setLoading(true);
    const success = await fetchAccount({ username, password });
    setLoading(false);

    if (success) {
      setUsername("");
      setPassword("");
      router.push("./(tabs)/list");
    } else {
      Alert.alert("Login Failed", "Wrong Username or Password");
    }
  };

  // 🔹 Exit App confirmation
  const exitApp = () => {
    if (Platform.OS === "android") {
      Alert.alert(
        "Exit App",
        "Are you sure you want to exit?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#192a56"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title} allowFontScaling={false}>
              BUCKET LIST
            </Text>
          </View>

          {/* 🔹 Show Loading Spinner when signing in */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Signing in...</Text>
            </View>
          ) : (
            <>
              {/* Sign In Form Section */}
              <View style={styles.formContainer}>
                <Text style={styles.signinText} allowFontScaling={false}>
                  Sign In
                </Text>

                {/* Username Input */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="gray"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#b4b4b4"
                    allowFontScaling={false}
                    value={username}
                    onChangeText={setUsername}
                    editable={!loading}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="gray"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#b4b4b4"
                    allowFontScaling={false}
                    secureTextEntry={secure}
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setSecure(!secure)}
                    style={styles.eyeIconContainer}
                    disabled={loading}
                  >
                    <Ionicons
                      name={secure ? "eye-off" : "eye"}
                      size={22}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  onPress={signInButton}
                  style={[
                    styles.button,
                    loading && { opacity: 0.7 },
                  ]}
                  disabled={loading}
                >
                  <Text style={styles.buttonText} allowFontScaling={false}>
                    SIGN IN
                  </Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <Text style={styles.signupText} allowFontScaling={false}>
                  Don't have an account?{" "}
                  <Link style={styles.signupLink} href="./signup">
                    Sign Up
                  </Link>
                </Text>
              </View>

              {/* Exit Button */}
              <TouchableOpacity
                onPress={exitApp}
                style={styles.exitButton}
                disabled={loading}
              >
                <Text
                  style={styles.exitButtonText}
                  allowFontScaling={false}
                >
                  EXIT
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
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
  signinText: {
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
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#000" },
  eyeIconContainer: { padding: 5 },
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
  signupText: {
    fontSize: 16,
    marginTop: 15,
    color: "#ffffff",
    textAlign: "center",
  },
  signupLink: { color: "skyblue", fontWeight: "600" },
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 15,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
    fontWeight: "600",
  },
});

export default SignIn;
