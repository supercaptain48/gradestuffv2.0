import { Text, View, ActivityIndicator } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../_layout";

export default function Index() {
    const [isLoading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState({});
    const { data, setData } = useContext(AppContext);

    async function getStudent() {
        const response = await fetch("https://vercel-gradestuff-backend.vercel.app/studentinfo-username=203499&password=superCaptain8!/");
        const student = await response.json();
        setStudentData(student);
        setLoading(false);
    }

    useEffect(() => {
        getStudent();
    }, []);

    return (
        <View>
            {isLoading ? <ActivityIndicator size="large" /> : <Text>{studentData.name}</Text>}
        </View>
    )
}