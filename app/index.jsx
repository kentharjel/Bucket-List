import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAccount } from "../hooks/useAccount";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ✅ pull fetchAccount from context
  const { fetchAccount } = useAccount();

  const signInButton = async () => {
    const success = await fetchAccount({ username, password });
    Keyboard.dismiss();

    if (success) {
      setUsername("");
      setPassword("");
      router.push("./(tabs)/list");
    } else {
      Alert.alert("Login Failed", "Wrong Username or Password");
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
        <Text style={styles.name}>BUCKET LIST</Text>
      </View>

      <View style={styles.signin}>
        <Text style={styles.signin_text}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={signInButton} style={styles.button}>
          <Text style={{ color: "white", fontSize: 18 }}>SIGN IN</Text>
        </TouchableOpacity>

        <Text style={styles.signup}>
          Don't have an account?{" "}
          <Link style={{ color: "skyblue" }} href={"./signup"}>
            Sign Up
          </Link>
        </Text>
      </View>
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
  signup: { fontSize: 18, marginVertical: 15, color: "white" },
});

export default SignIn;
