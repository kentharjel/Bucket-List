import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ListProvider } from "../../contexts/listContext";

export default function TabsLayout() {
  return (
    <ListProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "yellow",
          tabBarInactiveTintColor: "white",
          tabBarActiveBackgroundColor: "black",
          tabBarInactiveBackgroundColor: "black",
          headerShown: false,
          tabBarAllowFontScaling: false,
        }}
      >
        <Tabs.Screen
          name="list"
          options={{
            title: "List",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "book-sharp" : "book-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={
                  focused ? "person-circle" : "person-circle-outline"
                }
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </ListProvider>
  );
}
