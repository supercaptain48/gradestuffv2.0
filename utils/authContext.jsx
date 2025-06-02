import { SplashScreen, useRouter } from "expo-router";
import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const loginStorageKey = "loginState";

export const AuthContext = createContext({
    isLoggedIn: false,
    logIn: () => {},
    logOut: () => {},
})

export function AuthProvider({ children }) {
    const [isReady, setIsReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [wrongCredentials, setWrongCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const storeLoginState = async (username, password, isLoggedIn) => {
        try {
            const jsonValue = JSON.stringify({ username, password, isLoggedIn });
            await AsyncStorage.setItem(loginStorageKey, jsonValue);
        } catch (error) {
            console.log("Error saving", error);
        }
    }

    const logIn = async (username, password) => {
        setWrongCredentials(false);
        setIsLoading(true);
        const response = await fetch(`https://vercel-gradestuff-backend.vercel.app/studentinfo-username=${username}&password=${password}/`);
        setIsLoading(false);
        if(!response.ok) {
            setWrongCredentials(true);
            return;
        }
        setUsername(username);
        setPassword(password);
        setIsLoggedIn(true);
        storeLoginState(username, password, true);
        router.replace("/");
    }

    const logOut = () => {
        setIsLoggedIn(false);
        storeLoginState("", "", false);
        setUsername("");
        setPassword("");
        setWrongCredentials(false);
        router.replace("/login");
    }

    useEffect(() => {
        const getLoginState = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(loginStorageKey);
                if (jsonValue != null) {
                    const { username, password, isLoggedIn } = JSON.parse(jsonValue);
                    setUsername(username);
                    setPassword(password);
                    setIsLoggedIn(isLoggedIn);
                }
            } catch (error) {
                console.log("Error getting login state", error);
            }
            setIsReady(true);
        }
        getLoginState();
    }, [])

    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady])

    return (
        <AuthContext.Provider value={{ isReady, setIsReady, isLoggedIn, logIn, logOut, wrongCredentials, isLoading, username, password }}>
            {children}
        </AuthContext.Provider>
    )
}