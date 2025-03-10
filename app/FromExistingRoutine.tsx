import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";

const FromExistingRoutine = () => {

    // get username from the screen we previously navigated from
    const { username } = useLocalSearchParams();

    // hold routines retrieved from the server
    const [routines, setRoutines] = useState([]);

    // router to push to specific routine page
    const router = useRouter();

    // useEffect to load the existing routines automatically
    useEffect(() => {

        const getRoutines = async () => {

            // contact server to see if login credentials are correct
            try {
                const response = await axios.get(`http://127.0.0.1:5001/get-routines?username=${username}`);
                // if successful, set variable to the routines data
                if (response.data.message === "Successfully got routines") {
                    setRoutines(response.data.routines);
                }
            } catch (error) {
                console.error("Error logging in:", error);
                return false;
            }

        }

        getRoutines();

    }, [username]);

    // get the routine name based on the routine that the user clicked
    // navigate to the full view for that single routine
    const getRoutine = (uniqueRoutineName: string) => {

        router.push({ pathname: "/ViewRoutine", params: { routineID: uniqueRoutineName }});
    }

    return (

        <View>
            <Text>{username}</Text>
            <FlatList
                data={routines}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                <View style={styles.listItem}>
                    <TouchableOpacity onPress={() => { getRoutine(item.unique_id) }}>
                        <Text style={styles.planText}>{item.plan_name}</Text>
                    </TouchableOpacity>
                </View>
                )}
            />
        </View>

    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    listItem: {
      padding: 15,
      marginVertical: 5,
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
    },
    planText: {
      fontSize: 16,
    },
  });

export default FromExistingRoutine;
