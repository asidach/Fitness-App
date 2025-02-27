import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function RootLayout() {
  
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="NewWorkoutRoutine" 
        options={{
          title: "NewWorkoutRoutine",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home" size={24} color={focused ? "blue" : "gray"} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="Chat" 
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="search" size={24} color={focused ? "blue" : "gray"} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="ProfilePage" 
        options={{
          title: "ProfilePage",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person" size={24} color={focused ? "blue" : "gray"} />
          ),
        }} 
      />
    </Tabs>
  );

}
