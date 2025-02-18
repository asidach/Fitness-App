import React, { useEffect, useState } from "react";
import { Text, FlatList, TextInput } from "react-native";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const LoginPage = () => {

  const [userOrEmail, setUserOrEmail] = useState(''); // user can enter their username or email address
  const [password, setPassword] = useState(''); // password associated with account

  /*
  Example code to call from MongoDB

  useEffect(() => {
    axios.get("http://localhost:5001/users") // Change to your server URL
      .then(response => setUsers(response.data))
      .catch(error => console.log(error));
  }, []);
  */

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Users List</Text>
        <TextInput
          onChangeText={setUserOrEmail}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LoginPage;

