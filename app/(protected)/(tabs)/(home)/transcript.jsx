import { AuthContext } from "@/utils/authContext";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import { AppContext } from "../../_layout";

const DisplayGradeLevel = ({ gradeLevel }) => {
    return (
        <View className="bg-white rounded-3xl p-4 mb-4">
            <Text className="font-bold text-2xl">Grade: {gradeLevel.gradeLevel}</Text>

            <View className="flex-row items-center justify-between mb-2 mt-4">
                <Text className="font-bold flex-1 text-xl">Course</Text>
                <Text className="w-12 font-bold text-center">SEM1</Text>
                <Text className="w-12 font-bold text-center">SEM2</Text>
                <Text className="w-14 font-bold text-center">Credit</Text>
            </View>
            {gradeLevel.courses.map((course) => {
                return (
                    <View className="flex-row items-center justify-between mb-2" key={course.courseName}>
                        <Text className="font-bold flex-1">{course.courseName}</Text>
                        <Text className="w-12 text-center">{course.sem1Grade}</Text>
                        <Text className="w-12 text-center">{course.sem2Grade}</Text>
                        <Text className="w-14 text-center">{course.credit}</Text>
                    </View>
                )
            })}
        </View>
    )
}

export default function Transcript() {
    const authContext = useContext(AuthContext);
    const { data, setData } = useContext(AppContext);
    const [isLoading, setLoading] = useState(true);

    async function fetchTranscript() {
        const response = await fetch(`https://vercel-gradestuff-backend.vercel.app/transcript-username=${authContext.username}&password=${authContext.password}/`);
        const transcript = await response.json();

        setData((prevData) => {
            const updatedData = {
                ...prevData,
                transcript: transcript
            };
            return updatedData;
        })
        setLoading(false);
    }

    useEffect(() => {
        if(data.transcript) {
            setLoading(false);
        } else {
            fetchTranscript();
        }
    }, [])

    return (
        <View className="flex-1 px-4">
            {isLoading ? <ActivityIndicator size='large' /> :
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="flex-col justify-between mb-4 mt-4 bg-white p-4 rounded-3xl">
                        <Text className="font-bold text-lg">Weighted GPA: {data.transcript[0].weightedGpa}</Text>
                        <Text className="font-bold text-lg">College GPA: {data.transcript[0].collegeGpa}</Text>
                        <Text className="font-bold text-lg">Rank: {data.transcript[0].rank}</Text>
                    </View>
                    <FlatList 
                        data={data.transcript.slice(1)} // Skip the first item which is the GPA and rank
                        keyExtractor={(item) => item.gradeLevel}
                        renderItem={({ item }) => <DisplayGradeLevel gradeLevel={item} />}
                        scrollEnabled={false}
                    />
                </ScrollView>
            }
        </View>
    )
}