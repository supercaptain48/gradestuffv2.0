import { Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "@/utils/authContext";
import { useContext } from "react";

export default function Settings() {
    const authContext = useContext(AuthContext);

    return (
        <View className="flex-1 items-center p-4">
            <TouchableOpacity onPress={authContext.logOut} className="py-4 px-8 bg-red-600 rounded-3xl" activeOpacity={0.7}>
                <Text className="font-bold text-white text-center text-2xl">Log out</Text>
            </TouchableOpacity>
            <Text className="">Made by Avin Baidya</Text>
        </View>
    )
}