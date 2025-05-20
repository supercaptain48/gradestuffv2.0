import { Stack } from "expo-router";
import "./globals.css";
import { AuthProvider } from "@/utils/authContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="(protected)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}