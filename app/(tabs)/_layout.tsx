import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          headerTitleStyle: {
            color: Colors[colorScheme ?? "light"].text,
            textAlign: "center",
            fontFamily: "Serif",
            fontSize: 25,
          },
          headerTitleAlign: "center",
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="pencil-square-o" color={color} />
          ),
          headerShadowVisible: false,
          tabBarShowLabel: false,
          headerLeft: () => null,
        }}
      />
      <Tabs.Screen
        name="entries"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="book" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
