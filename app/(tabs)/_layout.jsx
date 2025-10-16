import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ListProvider } from "../../contexts/listContext";
import { useTheme } from "../../hooks/useTheme";

export default function TabsLayout() {
  const { isDarkMode } = useTheme();

  return (
    <ListProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDarkMode ? "yellow" : "black",
          tabBarInactiveTintColor: isDarkMode ? "white" : "gray",
          tabBarActiveBackgroundColor: isDarkMode ? "#000" : "#fff",
          tabBarInactiveBackgroundColor: isDarkMode ? "#000" : "#fff",
          headerShown: false,
          tabBarAllowFontScaling: false,
        }}
      >
        <Tabs.Screen
          name="list"
          options={{
            title: "List",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "book-sharp" : "book-outline"} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "person-circle" : "person-circle-outline"} color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </ListProvider>
  );
}
