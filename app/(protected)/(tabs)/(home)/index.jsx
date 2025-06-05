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

    useEffect(() => {
        async function fetchAssignments(quarter) {
            if(!data[`q${quarter}`]) {
                fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=${quarter}`)
                    .then(response => response.json())
                    .then(quarterData => {
                        console.log(quarter)
                        console.log(`Fetched Q${quarter} data:`, quarterData);
                        setData((prevData) => {
                            const updatedData = {
                                ...prevData,
                                [`q${quarter}`]: quarterData["grades"]
                            };
                            return updatedData;
                        });
                    })
                    .catch(error => console.error(`Error fetching Q${quarter} data:`, error));
            }
        }

        if(!data.currentQuarter) {
            fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/`)
                .then(response => response.json())
                .then(quarterData => {
                    console.log("Fetched Q4 data:", quarterData);
                    setData((prevData) => {
                        const updatedData = {
                            ...prevData,
                            [`q${quarterData["quarter"]}`]: quarterData["grades"],
                            currentQuarter: quarterData["quarter"]
                        };
                        return updatedData;
                    });
                })
                .catch(error => console.error("Error fetching Q4 data:", error));
        }
        let quarter = data.currentQuarter;
        while(quarter > 0) {
            fetchAssignments(quarter);
            quarter--;
        }
    }, [])

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