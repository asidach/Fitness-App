import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

const SetUnits = () => {

    // booleans to see which units have been selected
    const [pounds, setPounds] = useState(false);
    const [miles, setMiles] = useState(false);
    const [inches, setInches] = useState(false);

    // retrieve username from previous page that was used to navigate to this page
    const { username } = useLocalSearchParams();

    // when the user clicks the submit button, update their default units in the backend
    const updateUnits = async () => {

        // save strings representing the units depending on the values of the useState booleans
        const weightUnits = pounds ? "lbs" : "kgs";
        const distanceUnits = miles ? "miles" : "kms";
        const measurementsUnits = inches ? "ins" : "cms";

        // for testing purposes, if there is no username, assign default value
        const usernameNonBlank = username ? username : "test";

        // save units to the user's record
        try {

            const response = await axios.post("http://127.0.0.1:5001/set-units", {
                usernameNonBlank,
                weightUnits,
                distanceUnits,
                measurementsUnits
              });

        } catch  (error) {
            console.error("Error saving units:", error);
        }

    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>Set Units</Text>
                <Text>Weight</Text>
                <View style={styles.rowcontainer}>
                    <Pressable
                        style={pounds ? styles.nonPressedButton : styles.pressedButton}
                        onPress={() => setPounds(false)}
                    >
                        <Text>kgs</Text>
                    </Pressable>
                    <Pressable
                        style={pounds ? styles.pressedButton : styles.nonPressedButton}
                        onPress={() => setPounds(true)}
                    >
                        <Text>lbs</Text>
                    </Pressable>
                </View>
                <Text>Distance</Text>
                <View style={styles.rowcontainer}>
                    <Pressable
                        style={miles ? styles.nonPressedButton : styles.pressedButton}
                        onPress={() => setMiles(false)}
                    >
                        <Text>kms</Text>
                    </Pressable>
                    <Pressable
                        style={miles ? styles.pressedButton : styles.nonPressedButton}
                        onPress={() => setMiles(true)}
                    >
                        <Text>miles</Text>
                    </Pressable>
                </View>
                <Text>Measurements</Text>
                <View style={styles.rowcontainer}>
                    <Pressable
                        style={inches ? styles.nonPressedButton : styles.pressedButton}
                        onPress={() => setInches(false)}
                    >
                        <Text>cms</Text>
                    </Pressable>
                    <Pressable
                        style={inches ? styles.pressedButton : styles.nonPressedButton}
                        onPress={() => setInches(true)}
                    >
                        <Text>ins</Text>
                    </Pressable>
                </View>
                <Pressable
                    style={styles.pressedButton}
                    onPress={() => updateUnits}
                >
                    <Text>Submit</Text>
                </Pressable>
            </SafeAreaView>
        </SafeAreaProvider>
    );

}

const styles = StyleSheet.create({
    rowcontainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    nonPressedButton: {
        height: 20,
        backgroundColor: "gray",
        margin: 20,
        alignItems: "center"
    },
    pressedButton: {
        height: 20,
        backgroundColor: "blue",
        margin: 20,
        alignItems: "center"
    }
});

export default SetUnits;
