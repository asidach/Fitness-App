import React, { useState } from "react";
import { Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
    View,
    TextInput,
    Button
 } from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const sampleRoutine = require('./sampleRoutine.json'); // import sample workout while working on OpenAI logic

const ViewRoutine = () => {

    // workout plan in JSON format, including any edits the user has made
    const [workoutPlan, setWorkoutPlan] = useState<{
        "goal": string;
        "plan_name": string;
        "muscle_group": string;
        "username": string;
        "unique_id": string;
        "exercises": { "name": string; "sets": number; "reps": string }[];
      }>({
        goal: "Build Muscle",
        plan_name: "Push 1",
        muscle_group: "Chest",
        username: "sidaca",
        unique_id: "sidaca-1",
        exercises: [
          {
            name: "Flat Barbell Bench Press",
            sets: 4,
            reps: "6-8"
          },
          {
            name: "Incline Dumbbell Press",
            sets: 3,
            reps: "8-10"
          },
          {
            name: "Chest Dips",
            sets: 3,
            reps: "10-12"
          },
          {
            name: "Cable Flys",
            sets: 3,
            reps: "12-15"
          },
          {
            name: "Push-Ups (Finisher)",
            sets: 2,
            reps: "To Failure"
          }
        ]
      });
    
    // toggle visibility of modal to edit the workout
    const [modalVisible, setModalVisible] = useState(false);

    // exercise to edit, selected by the user
    const [selectedExercise, setSelectedExercise] = useState<{ name: string; sets: number; reps: string } | null>(null);

    // new values for the exercise the user has entered
    const [editedName, setEditedName] = useState('');
    const [editedSets, setEditedSets] = useState('');
    const [editedReps, setEditedReps] = useState('');

    // Open the modal and load selected exercise data
  const openEditModal = (exercise: { name: string; sets: number; reps: string }) => {
    setSelectedExercise(exercise);
    setEditedName(exercise.name);
    setEditedSets(exercise.sets.toString());
    setEditedReps(exercise.reps);
    setModalVisible(true);
  };

    // Save the changes and update JSON
  const saveChanges = () => {
    if (selectedExercise) {
        setWorkoutPlan((prev) => {
          // Ensure prev is defined and has exercises
          if (!prev || !prev.exercises) {
            console.log("FAILED");
            return prev
          }; 
    
          return {
            ...prev,
            exercises: prev.exercises.map((ex) =>
              ex.name === selectedExercise.name
                ? { ...ex, name: editedName, sets: parseInt(editedSets) || 0, reps: editedReps }
                : ex
            )
          };
        });
        setModalVisible(false);
      }
  };

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>{workoutPlan.plan_name}</Text>
                <FlatList
                    data={workoutPlan.exercises}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                    <TouchableOpacity style={styles.exerciseCard} onPress={() => openEditModal(item)}>
                        <Text style={styles.exerciseName}>{item.name}</Text>
                        <Text style={styles.exerciseDetails}>Sets: {item.sets}</Text>
                        <Text style={styles.exerciseDetails}>Reps: {item.reps}</Text>
                    </TouchableOpacity>
        )}
                />
                {/* Modal for Editing */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Exercise</Text>
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Exercise Name"
            />
            <TextInput
              style={styles.input}
              value={editedSets}
              onChangeText={setEditedSets}
              placeholder="Sets"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editedReps}
              onChangeText={setEditedReps}
              placeholder="Reps"
            />
            <Button title="Save" onPress={saveChanges} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      },
      modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
      },
      input: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 10,
        fontSize: 16,
        paddingVertical: 5
      }
  });

export default ViewRoutine;
