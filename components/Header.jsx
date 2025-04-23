import { View, Text, StatusBar } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from "react";

export default function Header({ navigation, route, options }) {
    const fontSize = options.title.length > 7 ? 'text-2xl' : 'text-5xl';
    const includeBack = options.title.length > 7;

    

    return (
        <View className="bg-blue-600 px-8 py-10 rounded-b-3xl justify-center">
            <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
            {includeBack && <Text className="text-white absolute top-1 left-2 font-bold text-base" onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={16} color="white" /> Back
                            </Text>}
            <Text className={`text-white ${fontSize} text-center font-bold`}>{options.title == "Home" ? 'gradestuff' : options.title}</Text>
        </View>
    );
}