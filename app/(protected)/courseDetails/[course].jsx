import { View, Text, FlatList, SectionList, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

import Header from "@/components/Header";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../_layout";

import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

const renderAssignment = ({ item }) => {
    return (
        <View className="mt-2 mb-1 px-4 py-2 rounded-3xl flex flex-row justify-center items-center bg-white">
            <Text className="font-bold flex-1">{item.name}</Text>
            <View className={`px-3 py-2 rounded-2xl ${Number(item.score) >= 90 ? "bg-green-500" : 
                                                      Number(item.score) >= 80 ? "bg-blue-500" :
                                                      Number(item.score) >= 70 ? "bg-orange-400" :
                                                      Number(item.score) > 0 ? "bg-red-500" : "bg-gray-400"}`}>
                <Text className="text-white font-bold">{item.score ? isNaN(Number(item.score)) ? item.score.slice(0, 3) : item.score : "0.00"}</Text>
            </View>
        </View>
    )
}

const renderHeader = ({ section }) => {
    let average = 0;
    let length = 0;
    section.data.map((assignment) => (
        !isNaN(Number(assignment.score)) && (assignment.score && (average += Number(assignment.score), length++))
    ))
    average /= length;

    return (
        <View className="bg-white rounded-3xl flex flex-row px-4 py-3 items-center justify-center mb-2 border-black border-2">
            <Text className="font-bold text-2xl text-black flex-1">{section.category}</Text>
            <View className={`border-white rounded-xl px-2 py-1 ml-1 ${average >= 90 ? "bg-green-500" : 
                                                                         average >= 80 ? "bg-blue-500" :
                                                                         average >= 70 ? "bg-orange-400" :
                                                                         average > 0 ? "bg-red-500" : "bg-gray-400"}`}>
                <Text className="text-white font-bold text-xl">{average >= 100 ? average.toFixed(1) : average.toFixed(2)}</Text>
            </View>
        </View>
    )
}

export default function CourseDetails() {
    const { course, index, quarter } = useLocalSearchParams();
    const { data, setData } = useContext(AppContext);
    const [actualData, setActualData] = useState({});
    const [sectionData, setSectionData] = useState([]);

    const [predictMode, setPredictMode] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // for dropdown
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    const [assignmentName, setAssignmentName] = useState(null);
    const [assignmentScore, setAssignmentScore] = useState(null);
    const [assignmentTotal, setAssignmentTotal] = useState("100.0");

    const [erorrMessage, setErrorMessage] = useState(false);

    // difference between the actual grades and the prediction
    const [difference, setDifference] = useState(() => data[`q${quarter}Predictions`]?.[index].grade - data[`q${quarter}`]?.[index].grade || 0);

    function handleScoreChange(text) {
        const score = parseFloat(text);
        if (!isNaN(score)) {
            setAssignmentScore(score);
        }
    }

    function handleTotalChange(text) {
        const score = parseFloat(text);
        if (!isNaN(score)) {
            setAssignmentTotal(score);
        }
    }

    function addAssignment() {
        if(!value || !assignmentName || !assignmentScore || !assignmentTotal) {
            setErrorMessage(true);
            return;
        }

        const newAssignment = {
            name: assignmentName,
            score: assignmentScore / assignmentTotal * 100,
            category: value
        };

        setData((prevData) => {
            const quarterPredictions = prevData[`q${quarter}Predictions`];
            quarterPredictions[index].assignments.push(newAssignment);

            // const sum = quarterPredictions[index].assignments.reduce((accumulator, assignment) => {
            //     if (!isNaN(Number(assignment.score))) {
            //         return accumulator + ((Number(assignment.score) * Number(prevData.weights[assignment.category])) / 100);
            //     }
            //     return accumulator;
            // }, 0)

            let newGrade = 0;

            for (const category in prevData.weights) {
                const sum = quarterPredictions[index].assignments.reduce((accumulator, assignment) => {
                    if (!isNaN(Number(assignment.score)) && category == assignment.category) {
                        return accumulator + Number(assignment.score);
                    }
                    return accumulator;
                }, 0)

                const total = quarterPredictions[index].assignments.reduce((accumulator, assignment) => {
                    if(category == assignment.category) {
                        return accumulator + Number(prevData.weights[category]);
                    }
                    return accumulator;
                }, 0)

                console.log(sum, total)

                const percent = sum / total;
                newGrade += percent;
            }
            
            // const count = quarterPredictions[index].assignments.filter(assignment => !isNaN(Number(assignment.score))).length;
            // const newGrade = count > 0 ? (sum / count).toFixed(2) : "0.00";

            setDifference(newGrade - prevData[`q${quarter}`][index].grade);

            quarterPredictions[index] = {
                ...quarterPredictions[index],
                assignments: quarterPredictions[index].assignments,
                grade: newGrade.toFixed(2)
            }

            return {
                ...prevData,
                [`q${quarter}Predictions`]: quarterPredictions
            };
        });

        setModalVisible(false);
        setAssignmentName(null);
        setAssignmentScore(null);
        setAssignmentTotal("100.0");
    }
    
    useEffect(() => {
        if(!data[`q${quarter}Predictions`]) {
            setData((prevData) => ({
                ...prevData,
                [`q${quarter}Predictions`]: prevData[`q${quarter}`]
            }));
        }

        setActualData(data[`q${quarter}`][index]);

        let formattedData = {};
        data[`q${quarter}`][index].assignments.map((assignment) => {
            if(formattedData.hasOwnProperty(assignment.category)) {
                formattedData[assignment.category].push(assignment);
            } else {
                formattedData[assignment.category] = [assignment];
            }
            
        })
        setSectionData(Object.keys(formattedData).map((category) => ({
            category,
            data: formattedData[category],
        })));

        setItems(Object.keys(formattedData).map((category) => ({
            label: category,
            value: category,
        })))
    }, [])

    return (
        <View className="flex-1">
            <Stack.Screen options={{title: course.replace(".", "/"), presentation: 'modal'}} />
            <Stack.Screen options={{headerShown: true, header: Header}} />
            
            <View className="bg-blue-600 pt-6 rounded-b-2xl pb-2 px-2" style={{marginTop: -20}}>
                <TouchableOpacity className="bg-blue-800 rounded-3xl py-2 mx-16" activeOpacity={0.7} onPress={() => setPredictMode(!predictMode)}>
                    <Text className="text-white font-lg font-bold text-center">{predictMode ? "Done" : "Predict your grade"}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="flex flex-col items-center justify-center mt-4 mb-2 mx-8 bg-white rounded-2xl">
                    <Text className="font-bold text-xl mb-2">Overall Grade</Text>
                    <Text className="font-bold text-6xl">{actualData.grade}</Text>
                    {difference != 0 && <Text className={difference < 0 ? "text-red-500 font-bold text-lg" : 
                                                         difference > 0 && "text-green-500 font-bold text-lg"}>{difference > 0 && "+"}{Number(difference).toFixed(2)}</Text>}
                </View>

                {predictMode && (
                    <View className="items-center">
                        <TouchableOpacity className="mt-4 bg-blue-600 px-5 py-2 rounded-2xl" activeOpacity={0.7} onPress={() => setModalVisible(true)}>
                            <Text className="text-center text-white font-bold">Add Assignment</Text>
                        </TouchableOpacity>

                        <Text className="font-bold mt-2">Tap on assignment to edit</Text>

                        <Modal
                            animationType="fade" 
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
                                <View className="m-8 bg-white rounded-3xl py-8 px-8 shadow-xl">                             
                                    <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.7} className="absolute top-3 right-3">
                                        <Ionicons name="close" size={30} color="black" />
                                    </TouchableOpacity>

                                    <Text className="font-bold text-2xl text-center mb-2">Add Grade</Text>
                                    
                                    {erorrMessage && <Text className="text-red-500 font-bold text-center mb-2">All fields must be filled</Text>}

                                    <DropDownPicker 
                                        open={open}
                                        value={value}
                                        items={items}
                                        setOpen={setOpen}
                                        setValue={setValue}
                                        setItems={setItems}
                                        placeholder="Select Category"
                                        style={{borderColor: 'gray', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2}}
                                        textStyle={{fontSize: 14, color: 'black'}}
                                    />

                                    <TextInput 
                                        placeholder="Assignment Name"
                                        className="border border-gray-400 rounded-xl px-4 py-3 text-bs mt-4 mb-4"
                                        onChangeText={setAssignmentName}
                                    />

                                    <View className="flex flex-row items-center justify-between">
                                        <TextInput 
                                            placeholder="Score"
                                            className="border border-gray-400 rounded-xl flex-1 py-3 text-bs text-center"
                                            keyboardType="numeric"
                                            onChangeText={handleScoreChange}
                                        />
                                        <Text className="text-2xl justify-center text-center mx-2">/</Text>
                                        <TextInput 
                                            placeholder="Total Points"
                                            className="border border-gray-400 rounded-xl flex-1 py-3 text-bs text-center"
                                            keyboardType="numeric"
                                            defaultValue="100.0"
                                            onChangeText={handleTotalChange}
                                        />
                                    </View>
                                    

                                    <TouchableOpacity 
                                        className="bg-blue-600 rounded-2xl items-center mt-4 py-2 mx-16" 
                                        onPress={addAssignment}
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-white font-bold text-lg">Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    
                )}

                <SectionList 
                    sections={sectionData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={renderAssignment}
                    renderSectionHeader={renderHeader}
                    contentContainerStyle={{marginTop: 20}}
                    className="mx-4"
                    renderSectionFooter={() => (
                        <View className="mb-12"></View>
                    )}
                    scrollEnabled={false}
                />
            </ScrollView>
            
            
        </View>
    )
}