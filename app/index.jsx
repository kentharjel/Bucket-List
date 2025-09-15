import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, BackHandler, Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAccount } from "../hooks/useAccount";

const SignIn = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [secure, setSecure] = useState(true)

  const { fetchAccount } = useAccount()

  const signInButton = async () => {
    Keyboard.dismiss();
    const success = await fetchAccount({ username, password })

    if (success) {
      setUsername("");
      setPassword("");
      router.push("./(tabs)/list")
    } else {
      Alert.alert("Login Failed", "Wrong Username or Password")
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
      )
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#000000"]}
      style={styles.container}
      start={{ x: 0, y: 2 }}
      end={{ x: 0, y: 0 }}
    >
      <View style={styles.name_position}>
        <Text style={styles.name} allowFontScaling={false}>BUCKET LIST</Text>
      </View>

      <View style={styles.signin}>
        <Text style={styles.signin_text} allowFontScaling={false}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor='#b4b4b4ff'
          allowFontScaling={false}
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor='#b4b4b4ff'
            allowFontScaling={false}
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-off" : "eye"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={signInButton} style={styles.button}>
          <Text style={{ color: "white", fontSize: 18 }} allowFontScaling={false}>SIGN IN</Text>
        </TouchableOpacity>

        <Text style={styles.signup} allowFontScaling={false}>
          Don't have an account?{" "}
          <Link style={{ color: "skyblue" }} href={"./signup"}>
            Sign Up
          </Link>
        </Text>
      </View>

      <TouchableOpacity onPress={exitApp} style={styles.exit_button}>
          <Text style={{ color: "white", fontSize: 18 }} allowFontScaling={false}>EXIT</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 50, fontWeight: "900", color: "#eee" },
  name_position: {},
  signin: { alignItems: "center", marginBottom: 100 },
  input: {
    width: 250,
    height: 45,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 2,
    fontSize: 18,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 250,
    height: 45,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 2,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
  },
  signin_text: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "700",
    marginVertical: 50,
    color: "white",
  },
  button: {
    backgroundColor: "royalblue",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  signup: { 
    fontSize: 18, 
    marginVertical: 15, 
    color: "white",
  },
  exit_button: {
    position: 'absolute',
    bottom: 100
  }
});

export default SignIn;
