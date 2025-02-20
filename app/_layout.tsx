import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (<Stack>
    <Stack.Screen name="CreateAccount" options={{ title: "CreateAccount" }} />
    <Stack.Screen name="LoginPage" options={{ title: "Login" }} />
  </Stack>);
}
