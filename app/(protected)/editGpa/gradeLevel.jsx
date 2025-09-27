import { Stack, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { Button, FlatList, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { AppContext } from "../_layout";

const CourseComponent = ({ course, onScaleEdit, onCreditEdit }) => {
    return (
        <View>
            <View className="mt-2 mb-2 px-4 py-3 rounded-3xl flex flex-row justify-center items-center bg-white">
                <Text className="font-bold flex-1 text-base">{course.name}</Text>
                <TouchableOpacity 
                    onPress={onScaleEdit}
                    className="bg-gray-300 rounded-xl px-4 py-2"
                    activeOpacity={1}
                >
                    <Text className="text-sm text-center">Scale</Text>
                    <Text className="font-bold text-center">{course.scale.toFixed(1)}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={onCreditEdit}
                    className="bg-gray-300 rounded-xl px-4 py-2 ml-2"
                    activeOpacity={1}
                >
                    <Text className="text-sm text-center">Credit</Text>
                    <Text className="font-bold text-center">{course.credit.toFixed(1)}</Text>
                </TouchableOpacity>
            </View>
        </View>
        
    )
}

export default function GradeLevel() {
    const { gradeLevel, scales } = useLocalSearchParams();
    const { data, setData } = useContext(AppContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [scale, setScale] = useState(null);
    const [credit, setCredit] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    function openScalesModal(course, index) {
        setSelectedCourse(course);
        setSelectedIndex(index);
        setScale(course.scale);
        setSelectedType("scale");
        setModalVisible(true);
    }

    function openCreditsModal(course, index) {
        setSelectedCourse(course);
        setSelectedIndex(index);
        setCredit(course.credit);
        setSelectedType("credit");
        setModalVisible(true);
    }

    function handleChangeText(text) {
        const parsedText = parseFloat(text);
        if (!isNaN(parsedText)) {
            if (selectedType === "credit") {
                setCredit(parsedText);
            } else if (selectedType === "scale") {
                setScale(parsedText);
            }
        } else {
            if(selectedType === "credit") {
                setCredit(selectedCourse.credit); // fallback
            } else if (selectedType === "scale") {
                setScale(selectedCourse.scale);
            }
           
        }
    }

    function handleComplete() {
        const scales = selectedType === "scale" ? data.scales.map((schoolYear) => {
            if (schoolYear.gradeLevel === gradeLevel) {
                schoolYear.courses[selectedIndex].scale = scale;
            }
            return schoolYear;
        }) : data.scales;

        const credits = selectedType === "credit" ? data.credits.map((schoolYear) => {
            if (schoolYear.gradeLevel === gradeLevel) {
                schoolYear.credits[selectedIndex].credit = credit;
            }
            return schoolYear;
        }) : data.credits;

        setData((prevData) => {
            const updatedData = {
                ...prevData,
                scales: scales,
                credits: credits,
            };
            return updatedData;
        });

        setModalVisible(false);
    }

    const courses = data.scales.find((s) => s.gradeLevel === gradeLevel)?.courses || [];
    const credits = data.credits.find((s) => s.gradeLevel === gradeLevel)?.credits || [];
    
    const componentsData = courses.map((course, index) => {
        return {
            ...course,
            credit: credits[index]?.credit || 0,
        }
    })

    return (
        <View className="px-2 flex-1">
            <Stack.Screen options={{title: `Grade: ${gradeLevel}`}} />
            <FlatList 
                data={componentsData}
                ListHeaderComponent={() => {
                    return (
                        <>
                            <View className="mt-4 mb-2 bg-white rounded-2xl items-center justify-center px-4 py-2">
                                <Text className="text-center font-bold">Tap on Scale or Credit to edit</Text>
                            </View>
                            <View className="mb-2 bg-white rounded-2xl items-center justify-center px-4 py-2">
                                <Text className="text-center font-bold text-sm">To exclude a course from GPA calculation, set it's credit to 0</Text>
                            </View>
                        </>
                    )
                }}
                renderItem={({ item, index }) => {
                    return (
                        <CourseComponent
                            gradeLevel={gradeLevel}
                            course={item}
                            index={index}
                            onScaleEdit={() => openScalesModal(item, index)}
                            onCreditEdit={() => openCreditsModal(item, index)}
                        />
                    )
                }}
                keyExtractor={(item) => item.name}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
            />

            <Modal 
                animationType="fade" 
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
                    <View className="m-8 bg-white rounded-3xl py-8 px-8 shadow-xl">
                        {selectedCourse && (
                            <>
                                <Text className="text-3xl text-center font-bold mb-2">{selectedCourse.name}</Text>
                                <Text className="text-center text-lg">Edit {selectedType === "scale" ? "Scale" : "Credit"}:</Text>
                                <TextInput 
                                    placeholder={`${selectedType === "scale" ? scale : credit}`} 
                                    className="border border-gray-400 rounded-xl px-4 py-3 mx-16 text-lg mt-2 mb-4 text-center"
                                    keyboardType="numeric"
                                    onChangeText={handleChangeText}
                                />
                                <TouchableOpacity 
                                    className="bg-blue-500 rounded-xl px-2 py-2 mx-8 mt-2" 
                                    onPress={handleComplete}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-center text-white font-bold text-lg">Done</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    )
}