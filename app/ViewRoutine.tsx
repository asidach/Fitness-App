import React, { useState } from "react";
import { Text, FlatList, View, StyleSheet } from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const sampleRoutine = require('./sampleRoutine.json'); // import sample workout while working on OpenAI logic

const ViewRoutine = () => {

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>{sampleRoutine.workout_plan.plan_name}</Text>
                <FlatList
                    data={sampleRoutine.workout_plan.exercises}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                    <View style={styles.exerciseCard}>
                        <Text style={styles.exerciseName}>{item.name}</Text>
                        <Text style={styles.exerciseDetails}>Sets: {item.sets}</Text>
                        <Text style={styles.exerciseDetails}>Reps: {item.reps}</Text>
                    </View>
        )}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f4f4f4"
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20
    },
    exerciseCard: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3
    },
    exerciseName: {
      fontSize: 18,
      fontWeight: "bold"
    },
    exerciseDetails: {
      fontSize: 16,
      color: "#555"
    }
  });

export default ViewRoutine;
