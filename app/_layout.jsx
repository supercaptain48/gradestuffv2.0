import { Stack } from "expo-router";
import "./globals.css";
import { AuthProvider } from "@/utils/authContext";
import { NotificationProvider } from "@/utils/NotificationContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowAlert: true,
    }),
});

export default function RootLayout() {
    return (
        <NotificationProvider>
            <AuthProvider>
                <Stack>
                    <Stack.Screen name="(protected)" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ headerShown: false }} />
                </Stack>
            </AuthProvider>
        </NotificationProvider>
    );
}