import Header from "@/components/Header";
import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack screenOptions={{header: Header}}>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="schedule" options={{ title: "Schedule" }} />
        </Stack>
    )
}