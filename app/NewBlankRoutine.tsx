import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
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
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const newBlankRoutine = () => {

    // get username from the screen we previously navigated from
    const { username } = useLocalSearchParams();

    // number of routines tied to the user
    const [numRoutines, setNumRoutines] = useState('');

    // boolean to lock useEffect after it is done for the first time, do not want to keep making calls to the server
    const [gotNumRoutines, setGotNumRoutines] = useState(false);

    // useEffect to get number of routines tied to the user
    useEffect(() => {

      // if numRoutines is not blank and has been set, load the previous routine
      if (numRoutines !== '') {
        setWorkoutPlan((prev) => ({
          ...prev,
          unique_id: `${username}-${numRoutines}`,
        }));
      }
    

      // only make server call if we haven't previously
      if (!gotNumRoutines) {

          const getNumRoutines = async () => {

              // contact server to see if login credentials are correct
              try {
                  const response = await axios.get(`http://127.0.0.1:5001/get-num-routines?username=${username}`);
                  // if successful, set variable to the routines data
                  if (response.data.message === "Successfully found user") {
                      setNumRoutines(response.data.numRoutines);
                  }
              } catch (error) {
                  console.error("Error getting user:", error);
                  return false;
              }

          }

          // call the function to make the server call
          getNumRoutines();
            
          // set boolean to true to stop the loop
          setGotNumRoutines(true);

      }

    }, [username]);

    // workout plan in JSON format, including any edits the user has made
    const [workoutPlan, setWorkoutPlan] = useState<{
        "plan_name": string;
        "username": string;
        "unique_id": string;
        "exercises": { "name": string; "sets": number; "reps": string }[];
      }>({
        plan_name: "New Workout",
        username: `${username}`,
        unique_id: `${username}-${numRoutines}`,
        exercises: [] // blank to initialize
      });

      // toggle visibility of modal to edit the workout
    const [modalVisible, setModalVisible] = useState(false);

    // track if we are editing an existing exercise, or adding a new one
    const [addingNew, setAddingNew] = useState(false);

    // user can set plan name for the routine they are creating
    const [planName, setPlanName] = useState('');
    // check that user has entered a plan name
    const [planBlank, setPlanBlank] = useState(false);
    // check that the user does not already have a plan with the same name they entered
    const [planExists, setPlanExists] = useState(false);

    // exercise to edit, selected by the user
    const [selectedExercise, setSelectedExercise] = useState<{ name: string; sets: number; reps: string } | null>(null);

    // new values for the exercise the user has entered
    const [editedName, setEditedName] = useState('');
    const [editedSets, setEditedSets] = useState('');
    const [editedReps, setEditedReps] = useState('');

    // check that values in modal have been filled out before submitting
    const [nameBlank, setNameBlank] = useState(false); // exercise name is blank
    const [setsBlank, setSetsBlank] = useState(false); // number of sets is blank
    const [repsBlank, setRepsBlank] = useState(false); // number of reps is blank

    // function called when user exits out of exercise name TextInput in modal
    async function checkExercise() {
      setNameBlank(editedName === '');
    }

    // function called when user exits out of sets TextInput in modal
    async function checkSets() {
      setSetsBlank(editedSets === '');
    }

    // function called when user exits out of reps TextInput in modal
    async function checkReps() {
      setRepsBlank(editedReps === '');
    }

    // function called when user exits out of plan name TextInput
    async function checkPlanName() {
      setPlanBlank(planName === '');

      // contact server to see if email exists in database
      try {
        const response = await axios.get(`http://127.0.0.1:5001/check-routine?username=${username}&routineName=${planName}`);
        setPlanExists(response.data.message === 'Routine already exists'); // check response message, certain message shows plan already exists
      } catch (error) {
        console.error("Error checking email:", error);
        return false; // Assume email doesn't exist if an error occurs
      }

    }

    // handle the cancellation of a modal by hiding it and changing any data validation booleans
    const cancelModal = () => {

      setModalVisible(false); // hide modal
      
      // set blank data validation booleans to true
      // to ensure that error text does not show up if user re-opens modal
      setNameBlank(false);
      setSetsBlank(false);
      setRepsBlank(false);

    }
    
    
    // open the modal and load selected exercise data
    const openEditModal = (exercise: { name: string; sets: number; reps: string }) => {
        setAddingNew(false); // not adding a new exercise, selected an existing one
        setSelectedExercise(exercise);
        setEditedName(exercise.name);
        setEditedSets(exercise.sets.toString());
        setEditedReps(exercise.reps);
        setModalVisible(true);
    };

  // open modal for adding a new exercise
  const openNewExerciseModal = () => {
    setAddingNew(true); // adding a new exercise
    // set values to blank, sincec it is new
    setEditedName("");
    setEditedSets("");
    setEditedReps("");
    setModalVisible(true);
  };

  // delete an exercise
  const deleteExercise = (exerciseName: string) => {
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

    // save routine to Routines schema
    try {

      const response = await axios.post("http://127.0.0.1:5001/workout-routines", {
        planName,
        username,
        uniqueID,
        exercises,
      });

      // increase the number of routines for the user
      // Increase the number of routines for the user **before** updating in DB
      const updatedNumRoutines = String(Number(numRoutines) + 1);
      setNumRoutines(updatedNumRoutines);

      // Update the numRoutines value in the database
      await axios.post("http://127.0.0.1:5001/update-num-routines", {
          username: username,
          numRoutines: updatedNumRoutines, // Send the updated value
      });

    } catch (error) {
      console.error("Error saving routine:", error);
    }

  };

  return (
    <SafeAreaProvider>
        <SafeAreaView>
            <TextInput
              style={styles.input}
              value={planName}
              onChangeText={setPlanName}
              onBlur={() => { checkPlanName() }}
              placeholder="Routine Name"
            />
            {planBlank && <Text>Routine must be given a name</Text>}
            {!planBlank && planExists && <Text>You already have a routine with this name. Please rename this routine</Text>}
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
            onBlur={() => { checkExercise() }}
            placeholder="Exercise Name"
            />
            {nameBlank && <Text>Exercise name cannot be blank</Text>}
            <TextInput
            style={styles.input}
            value={editedSets}
            onChangeText={setEditedSets}
            onBlur={() => { checkSets() }}
            placeholder="Sets"
            />
            {setsBlank && <Text>Number of sets cannot be blank</Text>}
            <TextInput
            style={styles.input}
            value={editedReps}
            onChangeText={setEditedReps}
            onBlur={() => { checkReps() }}
            placeholder="Reps"
            />
            {repsBlank && <Text>Number of reps cannot be blank</Text>}
            <Button title="Save" onPress={saveChanges} />
            <Button title="Cancel" color="red" onPress={() => { cancelModal() }} />
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

export default newBlankRoutine;
