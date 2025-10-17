import { Stack } from "expo-router";
import { AccountProvider } from "../contexts/accountContext";
import { ListProvider } from "../contexts/listContext";

export default function RootLayout() {
  return (
    <AccountProvider>
      <ListProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="signup"/>
          <Stack.Screen name="success"/>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="theme"/>
          <Stack.Screen name="about"/>
          <Stack.Screen name="done"/>
        </Stack>
      </ListProvider>
    </AccountProvider>
  );
}
