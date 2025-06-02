import { useContext } from "react";
import { AppContext } from "../_layout";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Link, router, Stack } from "expo-router";

const schoolYearButton = ({ item }) => {
     return (
        <Link 
            className="mt-2 mb-2 px-4 py-3 rounded-3xl flex flex-row justify-center items-center bg-white"
            href={{
                pathname: `editGpa/gradeLevel`,
                params: {gradeLevel: item.gradeLevel, scales: JSON.stringify(item.courses)}
            }}
        >
            <Text className="font-bold flex-1 text-2xl">Grade: {item.gradeLevel}</Text>
        </Link>
    )
}

export default function EditScales() {
    const { data, setData } = useContext(AppContext);

    return (
        <View className="p-2">
            <FlatList 
                data={data.scales}
                renderItem={schoolYearButton}
                keyExtractor={(item) => item.gradeLevel}
            />

            <TouchableOpacity 
                className="bg-blue-600 rounded-3xl p-2 mt-8" 
                onPress={() => router.replace("/gpa")}
                activeOpacity={0.7}
            >
                <Text className="text-white font-bold text-center text-2xl">Done</Text>
            </TouchableOpacity>
        </View>
    )
}