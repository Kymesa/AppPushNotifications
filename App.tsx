/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {
  notificationsListener,
  requestUserPermission,
} from './src/utils/pushNotifications';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const App = (): JSX.Element => {
  const [tokenFmc, setTokenFmc] = useState<string | null>('');
  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const getFmcToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fmcToken');
    setTokenFmc(fcmToken);
    console.log('FMC TOKEN -> ', fcmToken);
    if (!fcmToken) {
      try {
        const token = await messaging().getToken();
        if (token) {
          console.log(token, 'NEW TOKEN');
          setTokenFmc(token);
          await AsyncStorage.setItem('fmcToken', token);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const requestPermission = async () => {
      const checkPermission = await checkNotificationPermission();
      if (checkPermission !== RESULTS.GRANTED) {
        const requests = await requestNotificationPermission();
        if (requests !== RESULTS.GRANTED) {
          getFmcToken();
          requestUserPermission();
          notificationsListener();
        }
      }
    };
    requestPermission();
  }, []);
  return (
    <SafeAreaView>
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
          <Text>TOKEN_FMC - {tokenFmc}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
