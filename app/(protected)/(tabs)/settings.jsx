import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "@/utils/authContext";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../_layout";

export default function Settings() {
    const authContext = useContext(AuthContext);
    const { data } = useContext(AppContext);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(data.student) {
            setLoaded(true);
        }
    }, [data])

    return (
        <View className="flex-1">
            <View className="p-4">
                {loaded ? <View className="bg-white rounded-2xl p-6">
                    <Text className="font-bold text-4xl mb-2">Account Info</Text>
                    <View className="flex-col gap-1">
                        <Text className="text-lg"><Text className="font-bold">Name:</Text> {data.student.name}</Text>
                        <Text className="text-lg"><Text className="font-bold">Grade:</Text> {data.student.grade}</Text>
                        <Text className="text-lg"><Text className="font-bold">Building:</Text> {data.student.building}</Text>
                        <Text className="text-lg"><Text className="font-bold">Birth Date:</Text> {data.student.birthdate}</Text>
                        <Text className="text-lg"><Text className="font-bold">Student ID:</Text> {data.student.studentId}</Text>
                    </View>
                </View> : <ActivityIndicator size="large" />}

                <TouchableOpacity onPress={authContext.logOut} className="py-2 px-8 bg-red-600 rounded-3xl mt-4" activeOpacity={0.7}>
                    <Text className="font-bold text-white text-center text-2xl">Log out</Text>
                </TouchableOpacity>
            </View>
            
            <Text className="absolute bottom-6 w-full text-center">Made by Avin Baidya</Text>
        </View>
        
    )
}