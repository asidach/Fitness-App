import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const ExistingRoutines = () => {

    // get username from the screen we previously navigated from
    const { username } = useLocalSearchParams();

    return (

        <View>
            <Text>{username}</Text>
        </View>

    );

}

export default ExistingRoutines;
