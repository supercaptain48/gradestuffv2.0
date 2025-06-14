import { Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "@/utils/authContext";
import React, { useContext } from "react";

export default function Settings() {
    const authContext = useContext(AuthContext);

    return (
        <View className="flex-1 justify-between p-4">
            <View className="items-center">
                <TouchableOpacity onPress={authContext.logOut} className="py-4 px-8 bg-red-600 rounded-3xl" activeOpacity={0.7}>
                    <Text className="font-bold text-white text-center text-2xl">Log out</Text>
                </TouchableOpacity>
            </View>

            
            <Text className="text-center">Made by Avin Baidya</Text>
        </View>
        
    )
}