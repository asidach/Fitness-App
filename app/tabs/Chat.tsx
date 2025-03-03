import React, { useState } from "react";
import { View, TextInput, Button, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
const key = require('../../key.json');

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  // get username from global constants
  const user = useAuthStore((state) => state.username);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4", // Change to "gpt-3.5-turbo" if needed
          messages: newMessages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key.OPENAI_API_KEY}`,
          },
        }
      );

      const botMessage = response.data.choices[0].message;
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView style={{ flex: 1 }}>
        {messages.map((msg, index) => (
          <Text key={index} style={{ marginVertical: 5, color: msg.role === "user" ? "blue" : "green" }}>
            {msg.role === "user" ? "You: " : "ChatGPT: "}
            {msg.content}
          </Text>
        ))}
      </ScrollView>
      <Text>Welcome, {user?.name || "Guest"}!</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        placeholder="Type a message..."
        value={input}
        onChangeText={setInput}
      />
      <Button title="Send" onPress={sendMessage} />
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}