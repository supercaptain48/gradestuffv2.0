import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native"
import { AppContext } from "../_layout"
import { useContext, useEffect, useState } from "react"
import { findCurrentWeighted, findCurrentUnweighted, findCumulativeWeighted, findCumulativeUnweighted } from "@/actions/gpaCalculator";
import { AuthContext } from "@/utils/authContext";

const RenderCurrentGpa = ({ label, gpa }) => {
    return (
        <View className="flex-1 bg-white py-4 rounded-3xl">
            <Text className="text-center mb-4 text-base font-bold">{label}</Text>
            <Text className="text-center text-5xl font-bold">{gpa}</Text>
        </View>
    )
}

export default function Gpa() {
    const { data, setData } = useContext(AppContext);
    const [isLoadingCurrentGrades, setLoadingCurrentGrades] = useState(true);
    const [isLoadingTranscript, setLoadingTranscript] = useState(true);
    const [currentWeighted, setCurrentWeighted] = useState(0.000);
    const [currentUnweighted, setCurrentUnweighted] = useState(0.000);
    const [cumulativeWeighted, setCumulativeWeighted] = useState(0.000);
    const [cumulativeUnweighted, setCumulativeUnweighted] = useState(0.000);
    const authContext = useContext(AuthContext);

    async function getAllGrades() {
        const [q1Res, q2Res, q3Res, q4Res, transcriptRes] = await Promise.all([
            fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=1`),
            fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=2`),
            fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=3`),
            fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=4`),
            fetch(`https://vercel-gradestuff-backend.vercel.app/transcript-username=${authContext.username}&password=${authContext.password}/`)
        ])

        const [q1, q2, q3, q4, transcript] = await Promise.all([
            q1Res.json(),
            q2Res.json(),
            q3Res.json(),
            q4Res.json(),
            transcriptRes.json()
        ])

        setData((prevData) => {
            const updatedData = {
                ...prevData,
                q1: q1["grades"],
                q2: q2["grades"],
                q3: q3["grades"],
                q4: q4["grades"],
                transcript: transcript,
                currentQuarter: q4 ? 4 : q3 ? 3 : q2 ? 2 : 1,
            };
            return updatedData;
        });

        setLoadingCurrentGrades(false);
        setLoadingTranscript(false);
    }

    useEffect(() => {
        // data.currentQuarter ? (setLoadingCurrentGrades(false), 
        //                        setCurrentWeighted(findCurrentWeighted(data)),
        //                        setCurrentUnweighted(findCurrentUnweighted(data))) : getGrades();
        data.transcript ? (setCurrentWeighted(findCurrentWeighted(data)),
                           setCurrentUnweighted(findCurrentUnweighted(data)),
                           setLoadingCurrentGrades(false),
                           setLoadingTranscript(false),
                           setCumulativeWeighted(findCumulativeWeighted(data)),
                           setCumulativeUnweighted(findCumulativeUnweighted(data))) : getAllGrades();
    }, [isLoadingCurrentGrades, isLoadingTranscript])

    return (
        <View>
            <Text className="bg-gray-500 text-white text-center text-4xl font-bold mt-4 mx-4 rounded-xl p-2">Current</Text>
            {isLoadingCurrentGrades ? <ActivityIndicator size='large' /> : 
                <View className="flex flex-row justify-center mt-4 mx-4 gap-4">
                    <RenderCurrentGpa label="Weighted GPA" gpa={currentWeighted} />
                    <RenderCurrentGpa label="Unweighted GPA" gpa={currentUnweighted} />
                </View>
            }
            <Text className="bg-gray-500 text-white text-center text-4xl font-bold mt-8 mx-4 rounded-xl p-2">Cumulative</Text>
            {isLoadingTranscript ? <ActivityIndicator size='large' /> :
                <View className="flex flex-row justify-center mt-4 mx-4 gap-4">
                    <RenderCurrentGpa label="Weighted GPA" gpa={cumulativeWeighted} />
                    <RenderCurrentGpa label="Unweighted GPA" gpa={cumulativeUnweighted} />
                </View>
            }
            <TouchableOpacity className="bg-gray-300 rounded-3xl px-4 py-4 mt-8 mx-4">
                <Text className="font-bold text-2xl">Edit GPA scales</Text>
            </TouchableOpacity>
        </View>
    )
}