import {Platform, Linking, Alert} from 'react-native';

// Push notification configuration template
// Requires: @react-native-firebase/messaging and @react-native-firebase/app

export const NOTIFICATION_CONFIG = {
  channelId: 'cainochat-calls',
  channelName: 'CainoChat Calls',
  channelDescription: 'Notifications for incoming CainoChat calls',
  importance: 4, // HIGH
  vibrate: true,
  sound: 'default',
};

// Request notification permission
export async function requestNotificationPermission() {
  // In production with Firebase:
  // import messaging from '@react-native-firebase/messaging';
  // const authStatus = await messaging().requestPermission();
  // return authStatus === messaging.AuthorizationStatus.AUTHORIZED;

  console.log('[Notifications] Permission requested');
  return true;
}

// Get FCM token for push notifications
export async function getFCMToken() {
  // In production:
  // import messaging from '@react-native-firebase/messaging';
  // return await messaging().getToken();

  console.log('[Notifications] FCM token requested');
  return 'demo_fcm_token_' + Math.random().toString(36).substr(2, 10);
}

// Handle incoming call notification
export function showIncomingCallNotification(callerName, callerAvatar, roomId) {
  // In production, use:
  // - react-native-callkeep for native call UI
  // - react-native-notifee for heads-up notifications
  // - Firebase Cloud Messaging for background notifications

  console.log(`[Notifications] Incoming call from ${callerName} in room ${roomId}`);
}

// Handle notification tap
export function handleNotificationTap(data, navigation) {
  if (data?.type === 'incoming_call') {
    navigation.navigate('Call', {
      contact: {name: data.callerName, avatar: data.callerAvatar, id: data.callerId},
      callType: data.callType || 'video',
      roomId: data.roomId,
      isIncoming: true,
    });
  }
}

// Open app settings for notification permissions
export function openNotificationSettings() {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
}

// Schedule a local notification (for missed calls, etc.)
export function scheduleLocalNotification(title, body, data = {}) {
  // In production with notifee:
  // import notifee from '@notifee/react-native';
  // await notifee.displayNotification({ title, body, data });

  console.log(`[Notifications] Local: ${title} - ${body}`);
}

// Background message handler (for FCM)
export function setBackgroundMessageHandler() {
  // In production:
  // import messaging from '@react-native-firebase/messaging';
  // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //   console.log('Background message:', remoteMessage);
  // });

  console.log('[Notifications] Background handler registered');
}
