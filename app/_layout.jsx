import { Stack } from "expo-router";
import { AccountProvider } from "../contexts/accountContext";
import { ListProvider } from "../contexts/listContext";

export default function RootLayout() {
  return (
    <AccountProvider>
      <ListProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="success" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ListProvider>
    </AccountProvider>
  );
}
