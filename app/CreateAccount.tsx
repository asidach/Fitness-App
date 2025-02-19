import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TextInput, Pressable, NativeSyntheticEvent, TextInputEndEditingEventData } from "react-native";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const CreateAccount = () => {

  // variables to store username information
  const [username, setUsername] = useState(''); // unique username
  const [usernameBlank, setUsernameBlank] = useState(false); // check if user entered a username
  const [userLengthBad, setUserLengthBad] = useState(false); // check that username length is proper
  const [userInvalidCharacters, setUserInvalidCharacters] = useState(false); // check that username only contains valid characters

  // variables to store email information
  const [email, setEmail] = useState(''); // personal email of user, will be used for notifications
  const [emailBlank, setEmailBlank] = useState(false); // check if user entered an email
  const [emailInvalidCharacters, setEmailInvalidCharacters] = useState(false); // check that email matches proper format

  // variables to store password information
  const [password, setPassword] = useState(''); // password for account security
  const [passwordBlank, setPasswordBlank] = useState(false); // check if user entered a password
  const [passwordLengthBad, setPasswordLengthBad] = useState(false); // check that password length is proper

  // variables to store confirmed password information
  const [confirmPass, setConfirmPass] = useState(''); // compare to password to ensure it is entered correctly
  const [passwordsMismatch, setPasswordsMismatch] = useState(false); // check that the password fields match each other

  // check data validations on username
  // if all good, push username to database
  async function checkUsername() {

    // username cannot be blank
    setUsernameBlank(username.trim() === '');

    // username must be between 4 and 30 characters
    setUserLengthBad(username.length < 4 || username.length > 30);

    // username must only be alphanumeric
    // only other special characters allowed are "-", ".", and "_"
    if (username !== '') {
        const usernamePattern = /^[a-zA-Z0-9\-._]+$/;
        setUserInvalidCharacters(!usernamePattern.test(username));
    }

  }

  // check data validations on email
  // if all good, push email to database
  async function checkEmail() {

    // email cannot be blank
    setEmailBlank(email.trim() === '');

    // email must be of the format <text>@<text>.<text>
    if (email != '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailInvalidCharacters(!emailPattern.test(email));
    }

  }

  // check data validations on password
  // if all good, push password to database
  async function checkPassword() {

    // password cannot be blank
    setPasswordBlank(password.trim() === '');

    // password must be within 8 and 40 characters
    setPasswordLengthBad(password.length < 8 || password.length > 40);

  }

  // check that password fields match each other
  async function comparePasswords() {

    // strings must equal each other
    setPasswordsMismatch(password !== confirmPass);

  }
  

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Username</Text>
        <TextInput
          placeholder="Enter Username"
          style={styles.textInput}
          onChangeText={setUsername}
          onBlur={() => { checkUsername() }}
          value={username}
        />
        {usernameBlank && <Text>Username cannot be blank</Text>}
        {!usernameBlank && userLengthBad && <Text>Username must be between 4 and 30 characters</Text>}
        {!usernameBlank && !userLengthBad && userInvalidCharacters && <Text>Username must only contain letters, numbers, or special characters: - _ .</Text>}
        <Text>Email Address</Text>
        <TextInput
          placeholder="Enter Email"
          style={styles.textInput}
          onChangeText={setEmail}
          onBlur={() => { checkEmail() }}
          value={email}
        />
        {emailBlank && <Text>Email cannot be blank</Text>}
        {!emailBlank && emailInvalidCharacters && <Text>Please enter a valid email</Text>}
        <Text>Password</Text>
        <TextInput
          placeholder="Enter Password"
          style={styles.textInput}
          onChangeText={setPassword}
          secureTextEntry={true}
          onBlur={() => { checkPassword() }}
          value={password}
        />
        {passwordBlank && <Text>Password cannot be blank</Text>}
        {!passwordBlank && passwordLengthBad && <Text>Password must be between 8 and 40 characters</Text>}
        <Text>Confirm Password</Text>
        <TextInput
          placeholder="Confirm Password"
          style={styles.textInput}
          onChangeText={setConfirmPass}
          secureTextEntry={true}
          onBlur={() => { comparePasswords() }}
          value={confirmPass}
        />
        {passwordsMismatch && <Text>Passwords do not match</Text>}
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
