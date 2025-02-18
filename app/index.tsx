import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TextInput, Pressable } from "react-native";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const LoginPage = () => {

  const [userOrEmail, setUserOrEmail] = useState(''); // user can enter their username or email address
  const [password, setPassword] = useState(''); // password associated with account

  useEffect(() => {
    axios.get("http://localhost:5001/users") // Change to your server URL
      .then(response => setPassword(response.data))
      .catch(error => console.log(error));
  }, []);
  

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Username or Email</Text>
        <TextInput
          placeholder="Username or Email"
          style={styles.textInput}
          onChangeText={setUserOrEmail}
        />
        <Text>Password</Text>
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          onChangeText={setUserOrEmail}
        />
        <Pressable
          style={styles.button}
        >
          <Text>Login</Text>
        </Pressable>
        <Text>Don't have an account? Create one here</Text>
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
