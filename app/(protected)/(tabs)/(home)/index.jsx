import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../_layout";
import { AuthContext } from "@/utils/authContext";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Index() {
    const [isLoading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState({});
    const { data, setData } = useContext(AppContext);
    const authContext = useContext(AuthContext);
    const [loadGrades, setLoadGrades] = useState(false);

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
        setLoadGrades(true);
    }

    useEffect(() => {
        if(data.student) {
            setStudentData(data.student);
            setLoading(false);
            setLoadGrades(true);
        }
        else {
            getStudent();
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            let q = 0;

            async function fetchAssignments(quarter) {
                console.log("fetching...")
                if(!data[`q${quarter}`] || !quarter) {
                    console.log("BOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
                    const response = await fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/${quarter ? `?quarter=${quarter}` : ""}`)
                    if(response.ok) {
                        const quarterData = await response.json()
                        console.log(quarter)
                        console.log(`Fetched Q${quarter} data:`, quarterData);
                        setData((prevData) => {
                            const updatedData = {
                                ...prevData,
                                [`q${quarter}`]: quarterData["grades"]
                            };

                            if(!quarter) {
                                updatedData.currentQuarter = quarterData["quarter"];
                                updatedData.weights = quarterData["weights"];
                            } 
                            q = quarterData["quarter"];
                            return updatedData;
                        });
                    }
                    else {
                        setData((prevData) => {
                            const updatedData = {
                                ...prevData,
                                currentQuarter: 0,
                            }
                            q = 0;
                            return updatedData;
                        })
                        console.log("done!")
                    }
                }
            }

            const fetcher = async () => {
                let quarter = q;
                console.log("QUARTER: ", q)
                while(quarter > 0) {
                    console.log("bruh")
                    await fetchAssignments(quarter);
                    quarter--;
                }
            }

            if(!(data.currentQuarter >= 0) && loadGrades) {
                fetchAssignments();
            }
            fetcher();
            setLoadGrades(false);
        }, [loadGrades])
    )

    const name = studentData.name ? studentData.name.split(", ")[1] + " " + studentData.name.split(", ")[0] : "Student";

    return (
        <View className="p-4">
            {isLoading ? <ActivityIndicator size="large" /> : 
                <View>
                    <Text className="font-bold text-4xl">Hello, {name}</Text>
                    {data.currentQuarter >= 0 ? 
                        data.currentQuarter == 0 ?
                            <View className="bg-white rounded-2xl p-4 items-center my-4">
                                <Ionicons name="alert-circle" size={28} color={"red"} />
                                <Text className="text-center font-bold text-xl my-2">Unable to load grades. This may be because they are unavailable in HAC.</Text>
                                <Ionicons name="alert-circle" size={28} color={"red"} />
                                {/* <TouchableOpacity 
                                    className="bg-blue-600 px-12 py-2 mt-2 rounded-2xl" 
                                    activeOpacity={0.7} 
                                    onPress={() => {
                                        setLoadGrades(true);
                                    }}
                                >
                                    <Text className="font-bold text-white text-xl">Try Again</Text>
                                </TouchableOpacity> */}
                            </View> :
                        <Text className="my-8">No updates to show (THIS FEATURE IS CURRENTLY UNDER DEVELOPMENT)</Text> : 
                    <ActivityIndicator size="large" className="my-4" />}
                    <TouchableOpacity className="py-4 px-8 bg-blue-600 rounded-3xl mt-4" activeOpacity={0.7} onPress={() => router.push("/schedule")}>
                        <Text className="text-white font-bold text-xl">View Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-4 px-8 bg-blue-600 rounded-3xl mt-4" activeOpacity={0.7} onPress={() => router.push("/transcript")}>
                        <Text className="text-white font-bold text-xl">View Transcript</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}