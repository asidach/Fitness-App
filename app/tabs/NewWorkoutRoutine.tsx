import React, { useState } from "react";
import { Text, StyleSheet, Modal, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useAuthStore } from "../store/authStore";

const NewWorkoutRoutine = () => {

  // toggle visibility of exercises modal
  const [exerModalVisible, setExerModalVisible] = useState(false);

  // toggle visibility of routines modal
  const [routModalVisible, setRoutModalVisible] = useState(false);

  // router to navigate between screens
  const router = useRouter();

  // get username from global constants
  const user = useAuthStore((state) => state.username);
  
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Workout</Text>
        <Pressable
            style={styles.button}
            onPress={() => setExerModalVisible(true)}
        >
            <Text>Create Workout</Text>
        </Pressable>
        <Modal
        animationType="fade"
        transparent={true}
        visible={exerModalVisible}
        onRequestClose={() => setExerModalVisible(false)}
      >
        <Pressable
            style={styles.overlay}
            onPress={() => setExerModalVisible(false)}
        >
            <Pressable
              style={styles.popup}
              onPress={(e) => e.stopPropagation()}
            >
              <Pressable onPress={() => setExerModalVisible(false)}>
                <Text>x</Text>
              </Pressable>
              <Pressable
                style={styles.button}
               >
                <Text>Create from existing routine</Text>
                </Pressable>
                <Pressable
                style={styles.button}
                >
                    <Text>Create from chat bot</Text>
                </Pressable>
                <Pressable
                style={styles.button}
                >
                    <Text>Create blank workout</Text>
                </Pressable>
            </Pressable>
        </Pressable>
      </Modal>
        <Text>Routine</Text>
        <Pressable
            style={styles.button}
            onPress={() => { router.push({ pathname: "/ExistingRoutines", params: { username: user?.name } }) }}
        >
            <Text>Existing Routines</Text>
        </Pressable>
        <Pressable
            style={styles.button}
            onPress={() => setRoutModalVisible(true)}
        >
            <Text>Create New Routine</Text>
        </Pressable>
        <Modal
        animationType="fade"
        transparent={true}
        visible={routModalVisible}
        onRequestClose={() => setRoutModalVisible(false)}
      >
        <Pressable
            style={styles.overlay}
            onPress={() => setRoutModalVisible(false)}
        >
            <Pressable
              style={styles.popup}
              onPress={(e) => e.stopPropagation()}
            >
              <Pressable onPress={() => setRoutModalVisible(false)}>
                <Text>x</Text>
              </Pressable>
                <Pressable
                style={styles.button}
                >
                    <Text>Create from chat bot</Text>
                </Pressable>
                <Pressable
                style={styles.button}
                >
                    <Text>Create blank routine</Text>
                </Pressable>
            </Pressable>
        </Pressable>
      </Modal>
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
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darken background
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  popupText: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#6200EE",
    borderRadius: 5,
  },
})

export default NewWorkoutRoutine;
