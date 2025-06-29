import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native"
import { AppContext } from "../_layout";
import { useContext, useEffect, useState } from "react"
import { findCurrentWeighted, findCurrentUnweighted, findCumulativeWeighted, findCumulativeUnweighted } from "@/actions/gpaCalculator";
import { AuthContext } from "@/utils/authContext";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const gpasStorageKey = "gpaScalesCredits";

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
    const [isLoadingGrades, setLoadingGrades] = useState(true);
    const [currentWeighted, setCurrentWeighted] = useState(0.000);
    const [currentUnweighted, setCurrentUnweighted] = useState(0.000);
    const [cumulativeWeighted, setCumulativeWeighted] = useState(0.000);
    const [cumulativeUnweighted, setCumulativeUnweighted] = useState(0.000);
    const authContext = useContext(AuthContext);

    const [isGpaLoaded, setIsGpaLoaded] = useState(false);

    async function getAllGrades() {
        let quarter = 1;
        while(quarter < 5) {
            if(!data[`q${quarter}`]) {
                const res = await fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=${quarter}`);
                if(res.ok) {
                    const actual = await res.json();
                    setData((prevData) => {
                        const updatedData = {
                            ...prevData,
                            [`q${quarter}`]: actual["grades"]
                        }
                        return updatedData;
                    })
                }
            }
            console.log("just checking bruh")
            quarter++;
        }

        if(!data.transcript) {
            const res = await fetch(`https://vercel-gradestuff-backend.vercel.app/transcript-username=${authContext.username}&password=${authContext.password}/`);
            const transcript = await res.json();
            setData((prevData) => {
                const updatedData = {
                    ...prevData,
                    transcript: transcript
                }
                return updatedData;
            })
        }
        // const q1Res = await fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=1`);
        // const q2Res = await fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=2`);
        // const q3Res = await fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=3`);
        // const q4Res = await fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/?quarter=4`);
        // const transcriptRes = await fetch(`https://vercel-gradestuff-backend.vercel.app/transcript-username=${authContext.username}&password=${authContext.password}/`);

        // console.log(q1Res)

        // const [q1, q2, q3, q4, transcript] = await Promise.all([
        //     q1Res.json(),
        //     q2Res.json(),
        //     q3Res.json(),
        //     q4Res.json(),
        //     transcriptRes.json()
        // ])

        console.log("not here tho?")

        setData((prevData) => {
            const updatedData = {
                ...prevData,
                gpaLoaded: true,
                currentQuarter: prevData.q4 ? 4 : prevData.q3 ? 3 : prevData.q2 ? 2 : prevData.q1 ? 1 : 0
            };
            return updatedData;
        });

        setLoadingGrades(false);
    }

    useEffect(() => {
        const getGpa = async () => {
            try {
                const gpaJson = await AsyncStorage.getItem(gpasStorageKey);
                if(gpaJson != null && !(data.scales && data.credits)) {
                    const { scales, credits } = JSON.parse(gpaJson);
                    setData((prevData) => ({
                        ...prevData,
                        scales: scales,
                        credits: credits,
                    }));
                }
            } catch (error) {
                console.error("Error retrieving GPA scales and credits from AsyncStorage:", error);
            } finally {
                setIsGpaLoaded(true);
            }
        }

        if(data.gpaLoaded) {
            setLoadingGrades(false);
        }

        getGpa();
    }, [])

    useEffect(() => {
        const storeGpa = async (scales, credits) => {
            try {
                const gpaJson = JSON.stringify({scales, credits});
                await AsyncStorage.setItem(gpasStorageKey, gpaJson);
            } catch (error) {
                console.error("Error saving GPA scales and credits to AsyncStorage:", error);
            }
        }

        if(!isGpaLoaded) return;

        if(!isLoadingGrades) {
            // cw stands for cumulative weighted
            // the findCumulativeWeighted function is the one that creates the list of scales and credits
            const [cw, scales, credits] = findCumulativeWeighted(data);
            setCumulativeWeighted(cw);

            setCumulativeUnweighted(findCumulativeUnweighted(data));

            if(data[`q${data.currentQuarter}`]) {
                const weighted = findCurrentWeighted(data);
                setCurrentWeighted(weighted);
                setCurrentUnweighted(findCurrentUnweighted(data));
            } else{
                setCurrentWeighted("0.000");
                setCurrentUnweighted("0.000");
            }
        

            // add the gpa scales to the data
            if(!data.scales || !data.credits) {
                setData((prevData) => {
                    const updatedData = {
                        ...prevData,
                        scales: scales,
                        credits: credits,
                    };
                    return updatedData;
                });
            }

            storeGpa(scales, credits);
        }
        else {
            getAllGrades();
        }
    }, [isLoadingGrades, isGpaLoaded]);

    return (
        <View>
            <Text className="bg-gray-500 text-white text-center text-4xl font-bold mt-4 mx-4 rounded-xl p-2">Current</Text>
            {isLoadingGrades ? <ActivityIndicator size='large' /> : 
                <View className="flex flex-row justify-center mt-4 mx-4 gap-4">
                    <RenderCurrentGpa label="Weighted GPA" gpa={currentWeighted} />
                    <RenderCurrentGpa label="Unweighted GPA" gpa={currentUnweighted} />
                </View>
            }
            <Text className="bg-gray-500 text-white text-center text-4xl font-bold mt-8 mx-4 rounded-xl p-2">Cumulative</Text>
            {isLoadingGrades ? <ActivityIndicator size='large' /> :
                <View className="flex flex-row justify-center mt-4 mx-4 gap-4">
                    <RenderCurrentGpa label="Weighted GPA" gpa={cumulativeWeighted} />
                    <RenderCurrentGpa label="Unweighted GPA" gpa={cumulativeUnweighted} />
                </View>
            }
            {!isLoadingGrades && 
                <TouchableOpacity 
                    className="bg-gray-300 rounded-3xl px-4 py-2 mt-8 mx-4" 
                    onPress={() => {
                        router.replace("editGpa/editScales");
                    }}
                    activeOpacity={0.7}
                >
                    <Text className="font-bold text-2xl text-center">Edit GPA scales and credits</Text>
                </TouchableOpacity>
            }
        </View>
    )
}