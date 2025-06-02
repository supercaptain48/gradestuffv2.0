import { Stack } from "expo-router";
import Header from "@/components/Header";

export default function EditGpaLayout() {
    return (
        <Stack screenOptions={{header: Header}}>
            <Stack.Screen name="editScales" options={{title: "Edit GPA Scales"}} />
            <Stack.Screen name="gradeLevel" options={{title: "GPA", headerBackVisible: true}} />
        </Stack>
    )
}