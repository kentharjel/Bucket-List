import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Success = () => {
    return(
        <LinearGradient
            style={styles.container}
            colors={['yellow', '#000000']}
            start={{ x:0, y:3 }}
            end={{ x:0, y:0 }}
        >
            <Text style={styles.first}>You Have</Text>
            <Text style={styles.second}>Successfully</Text>
            <Text style={styles.third}>Signed Up!</Text>

            <TouchableOpacity 
                style={styles.back}
                onPress={()=> router.push('/')}
            >
                <Text style={styles.back_text}>Go back to Sign In</Text>
            </TouchableOpacity>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    first: {
        fontSize: 45,
        fontWeight: 900,
        color: '#ffffff'
    },
    second: {
        color: 'green',
        fontSize: 75,
        fontWeight: 900
    },
    third: {
        color: '#ffffff',
        fontSize: 45,
        fontWeight: 900
    },
    back: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        marginVertical: 50
    },
    back_text: {
        fontWeight: 900,
        fontSize: 18
    }
})

export default Success;