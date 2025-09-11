import { Stack } from "expo-router";
import { AccountProvider } from "../contexts/accountContext";

export default function RootLayout() {
  return (
    <AccountProvider>
       <Stack>
        <Stack.Screen name="index" options={{headerShown: false}}/>
        <Stack.Screen name="signup" options={{headerShown: false}}/>
        <Stack.Screen name="success" options={{headerShown: false}}/>
      </Stack>
    </AccountProvider>
  )
}
