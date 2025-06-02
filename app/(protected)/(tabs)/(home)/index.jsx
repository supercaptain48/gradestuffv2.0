import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../_layout";
import { AuthContext } from "@/utils/authContext";
import { router } from "expo-router";

export default function Index() {
    const [isLoading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState({});
    const { data, setData } = useContext(AppContext);
    const authContext = useContext(AuthContext);

    async function getStudent() {
        const response = await fetch(`https://vercel-gradestuff-backend.vercel.app/studentinfo-username=${authContext.username}&password=${authContext.password}/`);
        const student = await response.json();
        setStudentData(student);
        setData((prevData) => {
            const updatedData = {
                ...prevData,
                student: student
            };
            return updatedData;
        });
        setLoading(false);
    }

    useEffect(() => {
        if(data.student) {
            setStudentData(data.student);
            setLoading(false);
        }
        else {
            getStudent();
        }
    }, []);

    const name = studentData.name ? studentData.name.split(", ")[1] + " " + studentData.name.split(", ")[0] : "Student";

    return (
        <View className="p-4">
            {isLoading ? <ActivityIndicator size="large" /> : 
                <View>
                    <Text className="font-bold text-4xl">Hello, {name}</Text>
                    <Text>No updates to show</Text>
                    <TouchableOpacity className="py-4 px-8 bg-blue-600 rounded-3xl mt-4" activeOpacity={0.7} onPress={() => router.push("/schedule")}>
                        <Text className="text-white font-bold text-xl">View Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-4 px-8 bg-blue-600 rounded-3xl mt-4" activeOpacity={0.7}>
                        <Text className="text-white font-bold text-xl">View Transcript</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}