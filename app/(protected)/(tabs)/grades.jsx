import { FlatList, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback, useContext } from "react";
import { router } from "expo-router";
import { AppContext } from "../_layout";
import { AuthContext } from "@/utils/authContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const RenderClass = ({ item, index, quarter }) => {
    const navigate = () => {
        router.navigate({
            pathname: `courseDetails/${item.name.replace("/", ".")}`,
            params: {data: JSON.stringify(item), index: index, quarter: quarter}
        })
    }

    return (
        <TouchableOpacity className="mt-2 mb-2 px-4 py-3 rounded-3xl flex flex-row justify-center items-center bg-white" 
                          onPress={navigate} 
                          activeOpacity={1}>
            <Text className="font-bold flex-1 text-xl">{item.name}</Text>
            <View className={`px-3 py-2 rounded-2xl ${Number(item.grade) >= 90 ? "bg-green-500" : 
                                                      Number(item.grade) >= 80 ? "bg-blue-500" :
                                                      Number(item.grade) >= 70 ? "bg-orange-400" :
                                                      Number(item.grade) > 0 ? "bg-red-500" : "bg-gray-400"}`}>
                <Text className="text-center font-bold text-xl text-white">
                    {item.grade ? Number(item.grade) >= 100 ? Number(item.grade).toFixed(1) : item.grade : "0.00"}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default function Grades() {
    const [isLoading, setLoading] = useState(true);
    const [gradesData, setGradesData] = useState([]);
    const [quarter, setQuarter] = useState();
    const { data, setData } = useContext(AppContext);
    const authContext = useContext(AuthContext);

    async function getGrades(q) {
        const response = await fetch(`https://vercel-gradestuff-backend.vercel.app/assignments-username=${authContext.username}&password=${authContext.password}/${q ? `?quarter=${q}` : ""}`);
        if(response.ok) {
            const grades = await response.json();
            setLoading(false);
            !q && setGradesData(grades["grades"]);
            !q && setQuarter(Number(grades["quarter"]));
            setData((prevData) => {
                const updatedData = {
                    ...prevData,
                    [`q${grades["quarter"]}`]: grades["grades"],
                    weights: grades["weights"],
                };

                if(!q) {
                    updatedData.currentQuarter = grades["quarter"];
                }

                return updatedData;
            });
        }
        else {
            setData((prevData) => {
                const updatedData = {
                    ...prevData,
                    currentQuarter: 0,
                }

                return updatedData;
            })
            setLoading(false)
        }
    }

    const renderQuarter = (isQuarter, index) => {
        const handlePress = useCallback(() => {
            setQuarter(index + 1);

            if(data[`q${index + 1}`]) {
                setLoading(false);
                setGradesData(data[`q${index + 1}`]);
            } else {
                setLoading(true);
                getGrades(index + 1);
            }
        }, [index, data])

        return (
            <TouchableOpacity 
                className={`flex-1 ${isQuarter && "bg-white rounded-2xl"}`} 
                key={index} 
                onPress={() => {
                    setQuarter(index + 1);

                    if(data[`q${index + 1}`]) {
                        setLoading(false);
                        setGradesData(data[`q${index + 1}`]);
                    } else {
                        setLoading(true);
                        getGrades(index + 1);
                    }
                }}>
                <Text className={`text-center font-bold ${isQuarter ? "text-black rounded-2xl" : "text-white"}`}>Q{index + 1}</Text>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        data.currentQuarter !== undefined ? (console.log(data.currentQuarter), setLoading(false), setQuarter(data.currentQuarter)) : getGrades();
    }, []);

    useEffect(() => {
        setGradesData(data[`q${quarter}`]);
    })

    useEffect(() => {
        if(data.currentQuarter >= 0) {
            setQuarter(data.currentQuarter)
            setLoading(false)
        }
        if (data[`q${data.currentQuarter}`]) {
            setGradesData(data[`q${data.currentQuarter}`]);
            setQuarter(data.currentQuarter);
            setLoading(false);
        }
    }, [data.currentQuarter])

    const quarters = [false, false, false, false]

    quarters[quarter - 1] = true;

    return (
        <View className="flex-1">
            {data.currentQuarter > 0 ? 
                <View className="bg-blue-600 pt-6 rounded-b-2xl pb-2 px-2" style={{marginTop: -20}}>
                    {/* <Text className="text-white text-center font-bold mb-4 text-lg">Prediction mode</Text> */}
                    <View className="flex flex-row">
                        {quarters.map(renderQuarter)}
                    </View>
                </View> : 
            <View></View>}

            {isLoading ? <ActivityIndicator size="large" /> : 
                data.currentQuarter == 0 ? 
                    <View className="flex-1 items-center justify-center p-4">
                        <View className="bg-white rounded-2xl p-4 items-center">
                            <Ionicons name="alert-circle" size={28} color={"red"} />
                            <Text className="text-center font-bold text-xl my-2">Unable to load grades. This may be because they are unavailable in HAC.</Text>
                            <Ionicons name="alert-circle" size={28} color={"red"} />
                            <TouchableOpacity 
                                className="bg-blue-600 px-12 py-2 mt-2 rounded-2xl" 
                                activeOpacity={0.7} 
                                onPress={() => {
                                    setLoading(true)
                                    getGrades()
                                }}
                            >
                                <Text className="font-bold text-white text-xl">Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    </View> :
                    <FlatList 
                        data={gradesData} 
                        renderItem={({ item, index }) => <RenderClass item={item} index={index} quarter={quarter} />}
                        keyExtractor={(item) => item.name}
                        showsVerticalScrollIndicator={false}
                        className="mx-4"
                    />}
        </View>
    )
}