import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import { AppContext } from "../../_layout";
import { AuthContext } from "@/utils/authContext";

const RenderMarkingPeriod = ({ markingPeriod, courses }) => {
    return (
        <View className="mt-4 mb-4">
            <View className="bg-white rounded-3xl p-4 mb-2">
                <Text className="text-3xl font-bold text-center">{markingPeriod}</Text>
            </View>

            {Object.entries(courses).map(([day, courses], index) => {
                return (
                    <React.Fragment key={index}>
                        <View className="bg-white rounded-3xl p-3 mb-2 border-2" key={index}>
                            <Text className="text-2xl font-bold text-center">{day} Day</Text>
                        </View>
                        {courses.map((course) => {
                            // console.log(course)
                            return (
                                <View className="bg-white rounded-3xl px-4 py-2 mb-2 flex-row items-center" key={course.courseName}>
                                    <View className="rounded-full w-12 items-center justify-center mr-2">
                                        <Text className="text-2xl font-bold">{course.periods}{course.periods == "1" ? "st" :
                                                                                                   course.periods == "2" ? "nd" :
                                                                                                   course.periods == "3" ? "rd" : "th"}</Text>
                                    </View>
                                    
                                    <View className="flex-1">
                                        <Text className="font-bold text-lg">{course.courseName}</Text>
                                        <Text className="text-gray-600">{course.teacher}</Text>
                                    </View>

                                    <View className="bg-gray-300 rounded-2xl px-3 py-2">
                                        <Text className="font-bold">{course.room}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </React.Fragment>
                    
                )   
            })}
        </View>
    );
}

export default function Schedule() {
    const { data, setData } = useContext(AppContext);
    const [isLoading, setLoading] = useState(true);
    const authContext = useContext(AuthContext);

    const [scheduleData, setScheduleData] = useState({});
    const [scheduleKeys, setScheduleKeys] = useState([]);

    async function fetchSchedule() {
        const response = await fetch(`https://vercel-gradestuff-backend.vercel.app/schedule-username=${authContext.username}&password=${authContext.password}/`);
        const schedule = await response.json();
        
        setData((prevData) => {
            const updatedData = {
                ...prevData,
                schedule: schedule
            };
            return updatedData;
        });
        setLoading(false);
    }

    useEffect(() => {
        if(data.schedule) {
            setLoading(false);
        }
        else {
            fetchSchedule();
        }
    }, []);

    useEffect(() => {
        let newScheduleData = {};
        if(!isLoading) {
            data.schedule.map((course) => {
                const markingPeriod = course.markingPeriods;
                if(!newScheduleData[markingPeriod]) {
                    newScheduleData[markingPeriod] = {};
                }
                if(!newScheduleData[markingPeriod][course.days]) {
                    newScheduleData[markingPeriod][course.days] = [];
                }
                newScheduleData[markingPeriod][course.days].push(course);
            })
            setScheduleData(newScheduleData);
            setScheduleKeys(Object.keys(newScheduleData));
        }
    }, [isLoading])

    return (
        <View className="flex-1 px-4">
            {isLoading ? <ActivityIndicator size='large' /> : scheduleKeys.length > 0 &&
                <ScrollView showsVerticalScrollIndicator={false}>
                    {scheduleKeys.map((markingPeriod) => (
                        <RenderMarkingPeriod 
                            key={markingPeriod} 
                            markingPeriod={markingPeriod} 
                            courses={scheduleData[markingPeriod]} 
                        />
                    ))}
                </ScrollView>
            }
        </View>
    )
}