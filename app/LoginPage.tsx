import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TextInput, Pressable } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const LoginPage = () => {

  const [username, setUsername] = useState(''); // username of user
  const [password, setPassword] = useState(''); // password associated with account

  const [correctLogin, setCorrectLogin] = useState(false); // boolean if user entered credentials correctly

  // string to test server capabilities
  const [message, setMessage] = useState('');

  // router to navigate between screens
  const router = useRouter();

  // if login information is correct, navigate to the home screen
  useEffect(() => {

    if (correctLogin) {
      router.push("/Chat");
    }

  });

  // check that username and password were entered correctly
  const handleLogin = async () => {

     // contact server to see if login credentials are correct
     try {
      const response = await axios.get(`http://127.0.0.1:5001/login?username=${username}&password=${password}`);
      setCorrectLogin(response.data.message === 'Successful login'); // check response message
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }

  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Username</Text>
        <TextInput
          placeholder="Username"
          style={styles.textInput}
          onChangeText={setUsername}
          value={username}
        />
        <Text>Password</Text>
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          onChangeText={setPassword}
          value={password}
        />
        <Pressable
          style={styles.button}
          onPress={handleLogin}
        >
          <Text>Login</Text>
        </Pressable>
        <Text>Don't have an account? Create one </Text>
        <Text onPress={() => router.push("/CreateAccount")}>here</Text>
        {correctLogin && <Text>Success</Text>}
        <Text>{message}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5
  },
  button: {
    height: 20,
    backgroundColor: "blue",
    margin: 20,
    alignItems: "center"
  }
})

export default LoginPage;
