import React from "react";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StyleSheet, Text, SectionList, View, ScrollView } from "react-native";

/*

------- Page description -------

Here, the user can view a single workout that they did in the past.
The workout will be view-only.

*/
const ViewWorkout = () => {

    // workout in JSON format, constant since this page is view-only
    const workout = {
        workout_name: "Leg Day",
        username: "john_doe",
        unique_id: "12345",
        date: "2025-03-11",
        exercises: [
          {
            name: "Squats",
            sets: [
              { "set-id": "1", reps: 10, weight: "100 lbs" },
              { "set-id": "2", reps: 8, weight: "110 lbs" },
            ],
          },
          {
            name: "Lunges",
            sets: [
              { "set-id": "1", reps: 12, weight: "50 lbs" },
              { "set-id": "2", reps: 10, weight: "55 lbs" },
            ],
          },
        ],
      };

      // Format data for SectionList
    const formattedData = workout.exercises.map((exercise) => ({
        // extract exercise name
        title: exercise.name,
        // meat of data is in the sets
        data: exercise.sets,
    }));

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text style={styles.header}>{workout.workout_name}</Text>
                <Text>Hello {Number("12-14")}</Text>
                <ScrollView>
                    <SectionList
                        sections={formattedData}
                        keyExtractor={(item) => item["set-id"]}
                        renderSectionHeader={({ section }) => (
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                        )}
                        renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text>Set {item["set-id"]}: {item.reps} reps @ {item.weight}</Text>
                        </View>
                        )}
                    />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#f4f4f4",
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 16,
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: "bold",
      backgroundColor: "#ddd",
      padding: 8,
      marginTop: 10,
    },
    item: {
      padding: 8,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
  });

export default ViewWorkout;
