import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/users") // Change to your server URL
      .then(response => setUsers(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <View>
      <Text>Users List</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.name} - {item.email}</Text>}
      />
    </View>
  );
};

export default App;

