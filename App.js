import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Notifications from "expo-notifications"

export default function App() {
  useEffect(() => {
    Notifications.getPermissionsAsync().then(statusObj => {
      if (statusObj.status !== "granted") {
        return Notifications.requestPermissionsAsync()
      }
      return statusObj;
    }).then(statusObj => {
      if (statusObj.status !== "granted") {
        return;
      }
    });
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

  return (
    <View style={styles.container}>
      <Button title="Trigger notification" onPress={triggerNotificationHandler} />
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
