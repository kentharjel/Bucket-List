import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAccount } from "../hooks/useAccount";

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { createAccount } = useAccount()

    const signUpButton = async () => {
      Keyboard.dismiss()

      if (!username.trim() || !password.trim()) {
        Alert.alert("Error!", "Username and Password cannot be empty.");
        return;
      }

        await createAccount({ username, password });
        setUsername("");
        setPassword("");
        router.push('/success')
    }


    return (

        <LinearGradient 
        colors={["#ffffff", "#000000"]}
        style={styles.container}
        start={{ x: 0, y: 2}}
        end={{ x:0, y:0 }}
        >
        <View style={styles.name_position}>
            <Text style={styles.name}>BUCKET LIST</Text>
        </View>

        <View style={styles.signup}>
            <Text style={styles.signup_text}>Sign Up</Text>

            <TextInput 
            style={styles.input} 
            placeholder="Create Username"
            value={username}
            onChangeText={setUsername}
            />
            
            <TextInput 
            style={styles.input} 
            placeholder="Create Password"
            value={password}
            onChangeText={setPassword}
            />

            <TouchableOpacity onPress={signUpButton} style={styles.button}>
                <Text style={{color: 'white', fontSize: 18}}>SIGN UP</Text>
            </TouchableOpacity>

            <Text style={styles.signin}>Already have an account? <Link style={{ color: 'skyblue' }} href={'/'}>Sign In</Link></Text>
        </View>
        </LinearGradient>
        
    );
    }

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 50,
    fontWeight: 900,
    color: '#eee'
  },
  name_position : {
  },
  signup : {
    alignItems: 'center',
    marginBottom: 100
  },
  input : {
    width: 250,
    height: 45,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 2,
    fontSize: 18
  },
  signup_text : {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: 700,
    marginVertical: 50,
    color: 'white'
  }, 
  button: {
    backgroundColor: 'royalblue',
    padding: 10,
    marginTop: 10,
    borderRadius: 10
  },
  signin : {
    fontSize: 18,
    marginVertical: 15,
    color: 'white'
  }
})

export default SignUp;