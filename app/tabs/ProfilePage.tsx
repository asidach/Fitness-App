import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const ProfilePage = () => {

    // get username from wherever user navigated from to get to this page
    const { username } = useLocalSearchParams();

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>Username: {username}</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );

}

export default ProfilePage;
