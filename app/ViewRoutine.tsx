import React, { useState, useEffect } from "react";
import { Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
    View,
    TextInput,
    Button,
    Pressable
 } from "react-native";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";


const ViewRoutine = () => {

    // workout plan in JSON format, including any edits the user has made
    const [workoutPlan, setWorkoutPlan] = useState<{
        "plan_name": string;
        "username": string;
        "unique_id": string;
        "exercises": { "name": string; "sets": number; "reps": string }[];
      }>({
        plan_name: "Push 1",
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

    // track if any button has been clicked or not
    // used in useEffect, so that when screen is first loaded, it pulls from database
    // do not want to be constantly pulling from the database
    // if any changes are made (by clicking on any screen elements), want to reflect the changes the user just made
    const [submitClicked, setSubmitClicked] = useState(false);

    // track if we are editing an existing exercise, or adding a new one
    const [addingNew, setAddingNew] = useState(false);

    // exercise to edit, selected by the user
    const [selectedExercise, setSelectedExercise] = useState<{ name: string; sets: number; reps: string } | null>(null);

    // new values for the exercise the user has entered
    const [editedName, setEditedName] = useState('');
    const [editedSets, setEditedSets] = useState('');
    const [editedReps, setEditedReps] = useState('');

    // for testing purposes, test if routine was saved correctly
    const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

    // unique ID of the routine we are looking at
    const { routineID } = useLocalSearchParams();

    // load the initial routine from this unique id
    useEffect(() => {

      // only load directly from database if the user has not edited anything
      if (!submitClicked) {
        const getRoutine = async () => {

          // contact server to get routine
          try {
              const response = await axios.get(`http://127.0.0.1:5001/get-single-routine?unique_id=${routineID}`);
              // if successful, set variable to the routine data
              if (response.data.message === "Successfully got routine") {
                  
              let routine = response.data.routine;

              // Ensure exercises is an array and not a string
            if (typeof routine.exercises === "string") {
              try {
                routine.exercises = JSON.parse(routine.exercises);  // Convert string to array
              } catch (error) {
                console.error("Failed to parse exercises:", error);
                routine.exercises = [];  // Fallback to an empty array
              }
          }

            setWorkoutPlan(routine);

        }

          } catch (error) {
              console.error("Error logging in:", error);
              return false;
          }

      }

      getRoutine();
    }

    });

    // open the modal and load selected exercise data
  const openEditModal = (exercise: { name: string; sets: number; reps: string }) => {
    setAddingNew(false); // not adding a new exercise, selected an existing one
    setSubmitClicked(true); // user may have edited something
    setSelectedExercise(exercise);
    setEditedName(exercise.name);
    setEditedSets(exercise.sets.toString());
    setEditedReps(exercise.reps);
    setModalVisible(true);
  };

  // open modal for adding a new exercise
  const openNewExerciseModal = () => {
    setAddingNew(true); // adding a new exercise
    setSubmitClicked(true); // user may have edited something
    // set values to blank, sincec it is new
    setEditedName("");
    setEditedSets("");
    setEditedReps("");
    setModalVisible(true);
  };

  // delete an exercise
  const deleteExercise = (exerciseName: string) => {
    setSubmitClicked(true); // user may have edited something
    setWorkoutPlan((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.name !== exerciseName)
    }));
  };

    // Save the changes and update JSON
  const saveChanges = () => {
    if (addingNew) {
        // add new exercise to JSON
        setWorkoutPlan((prev) => ({
          ...prev,
          exercises: [
            ...prev.exercises,
            { name: editedName, sets: parseInt(editedSets) || 0, reps: editedReps }
          ]
        }));
      } else if (selectedExercise) {
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
      }
      // close modal when done editing
      setModalVisible(false);
  };

  // when the user clicks the save button, push it to the database
  // TODO: based on unique_id, update an existing record rather than creating a new one
  const saveRoutineToDB = async () => {

    // save parameters in strings
    const planName = workoutPlan.plan_name;
    const username = workoutPlan.username;
    const uniqueID = workoutPlan.unique_id;
    const exercises = JSON.stringify(workoutPlan.exercises);

    try {
      const response = await axios.post("http://127.0.0.1:5001/workout-routines", {
        planName,
        username,
        uniqueID,
        exercises,
      });
      setCreatedSuccessfully(response.data.message === "Workout routine saved!");
      setSubmitClicked(true);
    } catch (error) {
      console.error("Error saving routine:", error);
    }
  };

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>{workoutPlan.plan_name}</Text>
                <FlatList
                    data={workoutPlan.exercises}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    renderItem={({ item }) => (
                        <View style={styles.exerciseCard}>
                        {/* Exercise Info */}
                        <TouchableOpacity style={styles.exerciseInfo} onPress={() => openEditModal(item)}>
                          <Text style={styles.exerciseName}>{item.name}</Text>
                          <Text style={styles.exerciseDetails}>Sets: {item.sets}</Text>
                          <Text style={styles.exerciseDetails}>Reps: {item.reps}</Text>
                        </TouchableOpacity>
            
                        {/* Trash Icon for Deletion */}
                        <TouchableOpacity onPress={() => deleteExercise(item.name)}>
                          <Ionicons name="trash" size={24} color="red" />
                        </TouchableOpacity>
                      </View>
                    )}
                />
            <TouchableOpacity style={styles.addButton} onPress={openNewExerciseModal}>
                <Text style={styles.addButtonText}>+ Add Exercise</Text>
            </TouchableOpacity>
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
        <Pressable
          style={styles.button}
          onPress={saveRoutineToDB}
        >
          <Text>Submit</Text>
        </Pressable>
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
        flexDirection: "row", // Row layout for text + trash icon
        justifyContent: "space-between",
        alignItems: "center",
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
      exerciseInfo: {
        flex: 1 // Ensures text takes up remaining space
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
      },
      addButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20
      },
      addButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff"
      },
      button: {
        height: 20,
        backgroundColor: "blue",
        margin: 20,
        alignItems: "center"
      }
  });

export default ViewRoutine;
