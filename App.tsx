/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import usePushNotification from './src/hooks/usePushNotification';
import messaging from '@react-native-firebase/messaging';

const App = (): JSX.Element => {
  const [token, setToken] = useState<string>('');
  const {
    requestUserPermission,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
    const listenToNotifications = () => {
      try {
        const getFCMToken = async () => {
          const fcmToken = await messaging().getToken();
          setToken(fcmToken);
          if (fcmToken) {
            console.log('Your Firebase Token is:', fcmToken);
          } else {
            console.log('Failed', 'No token received');
          }
        };
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };
    listenToNotifications();
  }, [
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
    requestUserPermission,
  ]);
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <ScrollView>
        <View>
          <Text
            style={{
              margin: 20,
              fontSize: 20,
              color: 'black',
              fontWeight: '700',
            }}>
            SOCIAL APP NOTIFICATIONS RN-CLI
          </Text>
          <Text style={{color: 'black'}}> TOKEN - {token} </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
