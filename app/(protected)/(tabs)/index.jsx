import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../_layout";
import { AuthContext } from "@/utils/authContext";

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
        getStudent();
    }, []);

    return (
        <View>
            {isLoading ? <ActivityIndicator size="large" /> : <Text>{studentData.name}</Text>}
            <TouchableOpacity onPress={authContext.logOut}>
                <Text>Log out (CHANGE THIS LATER)</Text>
            </TouchableOpacity>
        </View>
    )
}