import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TextInput, Pressable } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';


const CreateAccount = () => {

  // variables to store username information
  const [username, setUsername] = useState(''); // unique username
  const [usernameBlank, setUsernameBlank] = useState(false); // check if user entered a username
  const [userLengthBad, setUserLengthBad] = useState(false); // check that username length is proper
  const [userInvalidCharacters, setUserInvalidCharacters] = useState(false); // check that username only contains valid characters
  const [userInUse, setUserInUse] = useState(false); // check that username is not in use by any other users

  // variables to store email information
  const [email, setEmail] = useState(''); // personal email of user, will be used for notifications
  const [emailBlank, setEmailBlank] = useState(false); // check if user entered an email
  const [emailInvalidCharacters, setEmailInvalidCharacters] = useState(false); // check that email matches proper format
  const [emailInUse, setEmailInUse] = useState(false); // check that email is not in use by any other users

  // variables to store password information
  const [password, setPassword] = useState(''); // password for account security
  const [passwordBlank, setPasswordBlank] = useState(false); // check if user entered a password
  const [passwordLengthBad, setPasswordLengthBad] = useState(false); // check that password length is proper
  const [passwordInvalid, setPasswordInvalid] = useState(false); // check that password meets compplexity requirements

  // variables to store confirmed password information
  const [confirmPass, setConfirmPass] = useState(''); // compare to password to ensure it is entered correctly
  const [passwordsMismatch, setPasswordsMismatch] = useState(false); // check that the password fields match each other

  // check that all data validations are met in order to create a user
  const [userCreatable, setUserCreatable] = useState(false);
  const [correctCreation, setCorrectCreation] = useState(false); // check if user was created correctly

  // check if Create Account button has been clicked yet
  // used to hide "fix errors" message if the button has not been clicked yet
  const [buttonClicked, setButtonClicked] = useState(false);

  // error message for server testing tasks
  const [message, setMessage] = useState('');

  // router to navigate between screens
  const router = useRouter();


  // if account information is correct, navigate to the home screen
  useEffect(() => {

    // if items are blank but the user has not clicked into any of the TextInputs, set booleans to true
    // this is to ensure that the user cannot continue if they have not entered any information
    if (username === '') {
      setUsernameBlank(true);
      setUserCreatable(false);
    }

    if (email === '') {
      setEmailBlank(true);
      setUserCreatable(false);
    }

    if (password === '') {
      setPasswordBlank(true);
      setUserCreatable(false);
    }

    // combine all data validation booleans to see if user is creatable
    setUserCreatable(!usernameBlank && !userLengthBad && !userInvalidCharacters && !userInUse
      && !emailBlank && !emailInvalidCharacters && !emailInUse
      && !passwordBlank && !passwordLengthBad && !passwordInvalid && !passwordsMismatch
    )

    // if all data validations pass and the user has been correctly added to the database, go to the homescreen
    if (correctCreation) {
      router.push({ pathname: "/Chat", params: { username: username } });
    }

  });


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

    // contact server to see if username exists in database
    try {
      const response = await axios.get(`http://127.0.0.1:5001/check-username?username=${username}`);
      setUserInUse(response.data.message === 'Username already exists'); // check response message
    } catch (error) {
      console.error("Error checking username:", error);
      return false; // Assume username doesn't exist if an error occurs
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

    // contact server to see if email exists in database
    try {
      const response = await axios.get(`http://127.0.0.1:5001/check-email?email=${email}`);
      setEmailInUse(response.data.message === 'Email already exists'); // check response message
    } catch (error) {
      console.error("Error checking email:", error);
      return false; // Assume email doesn't exist if an error occurs
    }

  }

  // check data validations on password
  // if all good, push password to database
  async function checkPassword() {

    // password cannot be blank
    setPasswordBlank(password.trim() === '');

    // password must be within 8 and 40 characters
    setPasswordLengthBad(password.length < 8 || password.length > 40);

    // password must have at least one uppercase, one lowercase, and one number
    if (password !== '') {
        const uppercasePattern = /[A-Z]/; // uppercase
        const lowercasePattern = /[a-z]/; // lowercase
        const numberPattern = /[0-9]/; // number
        setPasswordInvalid(!uppercasePattern.test(password) && lowercasePattern.test(password) && numberPattern.test(password));
    }

  }

  // check that password fields match each other
  async function comparePasswords() {

    // strings must equal each other
    setPasswordsMismatch(password !== confirmPass);

  }

  // check that all fields entered match data validations
  // if not, display an error message saying errors must be fixed
  // if all good, create the user in the database
  const handleRegister = async () => {

    // set button clicked to true
    setButtonClicked(true);

    // only add user to database if all data validations are good
    if (userCreatable) {

      try {
        const response = await axios.post("http://127.0.0.1:5001/register", {
          username,
          email,
          password,
        });
        setCorrectCreation(response.data.message === 'User created successfully!')
        setMessage(response.data.message);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setMessage("Error: " + (error.response?.data?.error || error.message));
        } else if (error instanceof Error) {
          setMessage("Error: " + error.message);
        } else {
          setMessage("An unknown error occurred.");
        }
      }

    }

  };
  

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
        {buttonClicked && usernameBlank && <Text>Username cannot be blank</Text>}
        {!usernameBlank && userLengthBad && <Text>Username must be between 4 and 30 characters</Text>}
        {!usernameBlank && !userLengthBad && userInvalidCharacters && <Text>Username must only contain letters, numbers, or special characters: - _ .</Text>}
        {!usernameBlank && !userLengthBad && !userInvalidCharacters && userInUse && <Text>Username is unavailable. Please use a different username, or log in if you already have an account</Text>}
        <Text>Email Address</Text>
        <TextInput
          placeholder="Enter Email"
          style={styles.textInput}
          onChangeText={setEmail}
          onBlur={() => { checkEmail() }}
          value={email}
        />
        {buttonClicked && emailBlank && <Text>Email cannot be blank</Text>}
        {!emailBlank && emailInvalidCharacters && <Text>Please enter a valid email</Text>}
        {!emailBlank && !emailInvalidCharacters && emailInUse && <Text>Email is unavailable. Please use a different email, or log in if you already have an account</Text>}
        <Text>Password</Text>
        <TextInput
          placeholder="Enter Password"
          style={styles.textInput}
          onChangeText={setPassword}
          secureTextEntry={true}
          onBlur={() => { checkPassword() }}
          value={password}
        />
        {buttonClicked && passwordBlank && <Text>Password cannot be blank</Text>}
        {!passwordBlank && passwordLengthBad && <Text>Password must be between 8 and 40 characters</Text>}
        {!passwordBlank && !passwordLengthBad && passwordInvalid && <Text>Password must contain at least one uppercase letter, one lowercase letter, and one number</Text>}
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
          onPress={handleRegister}
        >
          <Text>Create Account</Text>
        </Pressable>
        <Text>Already have an account? Log in </Text>
        <Text onPress={() => router.push("/LoginPage")}>here</Text>
        {!userCreatable && buttonClicked && <Text>Please fix the above errors before creating an account</Text>}
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
