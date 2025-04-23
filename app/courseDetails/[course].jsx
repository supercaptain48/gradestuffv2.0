import { View, Text, FlatList, SectionList } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

import Header from "@/components/Header";

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
        <View className="bg-black rounded-3xl flex flex-row px-4 py-3 items-center justify-center mb-2">
            <Text className="font-bold text-xl text-white flex-1">{section.category}</Text>
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
    const { course, data } = useLocalSearchParams();
    const actualData = JSON.parse(data);

    let formattedData = {};
    actualData.assignments.map((assignment) => {
        if(formattedData.hasOwnProperty(assignment.category)) {
            formattedData[assignment.category].push(assignment);
        } else {
            formattedData[assignment.category] = [assignment];
        }
        
    })
    const sectionData = Object.keys(formattedData).map((category) => ({
        category,
        data: formattedData[category],
      }));
    

    return (
        <View className="px-4 flex-1">
            <Stack.Screen options={{title: course.replace(".", "/"), presentation: 'modal'}} />
            <Stack.Screen options={{headerShown: true, header: Header}} />
            
            {/* <FlatList 
                data={sectionData} 
                renderItem={({ item }) => (
                    <View className="mt-6 mb-10">
                        <Text className="font-bold text-2xl text-center bg-black text-white rounded-2xl py-2 mb-2">{item.category}</Text>
                        <FlatList
                            data={item.data}
                            renderItem={renderAssignment}
                            keyExtractor={(subItem) => subItem.name}
                            scrollEnabled={false}
                        />
                    </View>
                )} 
                keyExtractor={(item) => item.category} 
                showsVerticalScrollIndicator={false}
            /> */}
            <SectionList 
                sections={sectionData}
                keyExtractor={(item, index) => item + index}
                renderItem={renderAssignment}
                renderSectionHeader={renderHeader}
                contentContainerStyle={{marginTop: 20}}
                showsVerticalScrollIndicator={false}
                renderSectionFooter={() => (
                    <View className="mb-12"></View>
                )}
            />
        </View>
    )
}