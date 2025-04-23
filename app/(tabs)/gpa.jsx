import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native"
import { AppContext } from "../_layout"
import { useContext, useEffect, useState } from "react"
import { findCurrentWeighted, findCurrentUnweighted, findCumulativeWeighted } from "@/actions/gpaCalculator";

const RenderCurrentGpa = ({ label, gpa }) => {
    return (
        <View className="flex-1 bg-white py-4 rounded-3xl">
            <Text className="text-center mb-4 text-lg font-bold">{label}</Text>
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

    async function getTranscript() {
        const response = await fetch('https://vercel-gradestuff-backend.vercel.app/transcript-username=203499&password=superCaptain8!/');
        const transcript = await response.json();
        console.log(JSON.stringify(transcript));
        setLoadingTranscript(false);
        setData((prevData) => {
            const updatedData = {
                ...prevData,
                transcript: transcript,
            };
            return updatedData;
        });
    }

    async function getGrades() {
        const response = await fetch('https://vercel-gradestuff-backend.vercel.app/assignments-username=203499&password=superCaptain8!/');
        const grades = await response.json();
        setData((prevData) => {
            const updatedData = {
                ...prevData,
                [`q${grades["quarter"]}`]: grades["grades"],
                currentQuarter: grades["quarter"],
            };
            return updatedData;
        });
        setLoadingCurrentGrades(false);
    }

    useEffect(() => {
        data.currentQuarter ? (setLoadingCurrentGrades(false), 
                               setCurrentWeighted(findCurrentWeighted(data)),
                               setCurrentUnweighted(findCurrentUnweighted(data))) : getGrades();
        data.transcript ? (setLoadingTranscript(false),
                           setCumulativeWeighted(findCumulativeWeighted(data))) : getTranscript();
    }, [isLoadingCurrentGrades, isLoadingTranscript])

    return (
        <View>
            {isLoadingCurrentGrades ? <ActivityIndicator size='large' /> : 
                <View className="flex flex-row justify-center mt-4 mx-4 gap-4">
                    <RenderCurrentGpa label="Weighted GPA" gpa={currentWeighted} />
                    <RenderCurrentGpa label="Unweighted GPA" gpa={currentUnweighted} />
                </View>
            }
            {isLoadingTranscript ? <ActivityIndicator size='large' /> :
                <View className="flex flex-row justify-center mt-4 mx-4 gap-4">
                    <RenderCurrentGpa label="Cumulative GPA" gpa={cumulativeWeighted} />
                </View>
            }
            <TouchableOpacity className="bg-gray-300 rounded-3xl px-4 py-4 mt-4 mx-4">
                <Text className="font-bold text-2xl">Edit GPA scales</Text>
            </TouchableOpacity>
        </View>
    )
}