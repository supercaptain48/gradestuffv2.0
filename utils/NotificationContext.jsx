// TUTORIAL USED: https://youtu.be/BCCjGtKtBjE?si=W7JF1ARwuhWT1nZd
// The typescript was converted to javascript

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from "react"
import * as Notifications from "expo-notifications"
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync"
import { doc, getFirestore, setDoc } from "firebase/firestore"
import { app } from "@/firebaseConfig"

const NotificationContext = createContext(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    )
  }
  return context
}

async function saveTokenToFirestore(token) {
  try {
    const db = getFirestore(app);
    const useRef = doc(db, "users", "token");
    await setDoc(useRef, {
      expoPushToken: token
    }, { merge: true });
    console.log("Token saved to Firestore:", token);
  } catch (error) {
    console.error("Error saving token to Firestore:", error);
  }
}

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null)
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      token => (setExpoPushToken(token), saveTokenToFirestore(token)),
      error => setError(error)
    )

    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log("🔔 Notification Received: Received while the app is running", notification)
        setNotification(notification)
      }
    )

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log(
          "🔔 Notification Response: user interacts with a notification",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        )
        // Handle the notification response here
      }
    )

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
