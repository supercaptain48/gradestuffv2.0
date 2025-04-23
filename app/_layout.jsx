import { Stack } from "expo-router";
import "./globals.css";
import { createContext, useState } from "react";

export const AppContext = createContext();

export default function RootLayout() {
    const [data, setData] = useState({});

    return (
        <AppContext.Provider value={{data, setData}}>
            <Stack screenOptions={{headerShown: false}} />
        </AppContext.Provider>
    );
}
