import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TextInput, Pressable } from "react-native";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const CreateAccount = () => {

  const [username, setUsername] = useState(''); // unique username
  const [email, setEmail] = useState(''); // personal email of user, will be used for notifications
  const [password, setPassword] = useState(''); // password for account security
  const [confirmPass, setConfirmPass] = useState(''); // compare to password to ensure it is entered correctly

  useEffect(() => {
    axios.get("http://localhost:5001/users") // Change to your server URL
      .then(response => setPassword(response.data))
      .catch(error => console.log(error));
  }, []);
  

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Username</Text>
        <TextInput
          placeholder="Enter Username"
          style={styles.textInput}
          onChangeText={setUsername}
        />
        <Text>Email Address</Text>
        <TextInput
          placeholder="Enter Email"
          style={styles.textInput}
          onChangeText={setEmail}
        />
        <Text>Password</Text>
        <TextInput
          placeholder="Enter Password"
          style={styles.textInput}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Text>Confirm Password</Text>
        <TextInput
          placeholder="Confirm Password"
          style={styles.textInput}
          onChangeText={setConfirmPass}
          secureTextEntry={true}
        />
        <Pressable
          style={styles.button}
        >
          <Text>Create Account</Text>
        </Pressable>
        <Text>Already have an account? Log in here</Text>
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

export default CreateAccount;
