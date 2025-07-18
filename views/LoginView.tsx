/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Button, Alert, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

type LoginViewProps = {
  onLogin: () => void;
};

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '646507716060-re82eq5vqplqp7vcvlafpm673tt38tj3.apps.googleusercontent.com',
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo.data?.user.name);
      onLogin();
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services not available');
      } else {
        Alert.alert('Google Sign-In error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>LoginView</Text>
          <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
});
