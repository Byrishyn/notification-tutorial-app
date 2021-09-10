import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Notifications from "expo-notifications"

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true
    }
  }
})

export default function App() {
  const [pushToken, setPushToken] = useState()
  useEffect(() => {
    Notifications.getPermissionsAsync().then(statusObj => {
      if (statusObj.status !== "granted") {
        return Notifications.requestPermissionsAsync()
      }
      return statusObj;
    }).then(statusObj => {
      if (statusObj.status !== "granted") {
        throw new Error("Permisson not granted")
      }
    }).then(() => {
      return Notifications.getExpoPushTokenAsync()
    }).then( response =>{
      const token = response.data
      setPushToken(token)
    }).catch(err => {
      return null
    });
  })

  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
    })


    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification)
    })
    return () => {
      backgroundSubscription.remove()
      foregroundSubscription.remove()
    }
  })

  const triggerNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first Local notification",
        body: "This is the first local notification we  are sending"
      },
      trigger: {
        seconds: 10,
      }
    })
  }


  const triggerPushNotificationHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send",{
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({
        to: pushToken,
        data: {extraData : "Some data"},
        title: "Sent via the app",
        body: "This push notification was sent via the app"
      })
    })
  }

  return (
    <View style={styles.container}>
      <Button title="Trigger notification" onPress={triggerPushNotificationHandler} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
