import { AuthContext } from "@/utils/authContext";
import { Redirect, Stack } from "expo-router";
import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

const isLoggedIn = false;

export default function ProtectedLayout() {
    const authState = useContext(AuthContext);
    const [data, setData] = useState({});

    if(!authState.isReady) {
        return null;
    }

    if(!authState.isLoggedIn) {
        return <Redirect href="/login" />;
    }

    return (
        <AppContext.Provider value={{data, setData}}>
            <Stack screenOptions={{headerShown: false}} />
        </AppContext.Provider>
    );
}
