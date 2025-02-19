import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TextInput, Pressable, NativeSyntheticEvent, TextInputEndEditingEventData } from "react-native";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const CreateAccount = () => {

  const [username, setUsername] = useState(''); // unique username
  const [usernameBlank, setUsernameBlank] = useState(false); // check if user entered a username

  const [email, setEmail] = useState(''); // personal email of user, will be used for notifications
  const [emailBlank, setEmailBlank] = useState(false); // check if user entered an email

  const [password, setPassword] = useState(''); // password for account security
  const [confirmPass, setConfirmPass] = useState(''); // compare to password to ensure it is entered correctly

  // check data validations on username
  // if all good, push username to database
  async function checkUsername(e) {

    // username cannot be blank
    setUsernameBlank(username.trim() === '');

  }

  // check data validations on email
  // if all good, push email to database
  async function checkEmail(e) {



  }
  

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Username</Text>
        <TextInput
          placeholder="Enter Username"
          style={styles.textInput}
          onChangeText={setUsername}
          onBlur={(e) => { checkUsername(e) }}
          value={username}
        />
        {usernameBlank && <Text>Username cannot be blank</Text>}
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
