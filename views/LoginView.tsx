/* eslint-disable react-native/no-inline-styles */

import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect } from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AppColor from '../services/styles/AppColor';
import { getUserByEmail, createUser } from '../apis/login/login_api';

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
      const email = userInfo.data?.user.email;
      console.log('User Email:', email);
      let user = null;
      try {
        user = await getUserByEmail(email);
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          throw error;
        }
      }
      if (user) {
        onLogin();
      } else {
        try {
          if (!email) throw new Error('No email found from Google account.');
          await createUser({
            username: userInfo.data?.user.name || email.split('@')[0],
            email,
            avatar_url: userInfo.data?.user.photo || '',
          });
          onLogin();
        } catch (err: any) {
          Alert.alert(
            'Sign up failed',
            err?.message || 'Could not create user.',
          );
        }
      }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: AppColor.background }}>
      <StatusBar backgroundColor={AppColor.background} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Icon name="music-note" size={48} color={AppColor.accent} />
              </View>
              <Text style={styles.appTitle}>
                <Text style={{ fontWeight: 'bold' }}>music</Text>
                <Text style={{ fontWeight: 'bold', color: AppColor.accent }}>
                  4
                </Text>
                <Text style={{ fontWeight: 'bold' }}>you</Text>
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={AppColor.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={AppColor.textSecondary}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
            <Pressable>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </Pressable>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
            >
              <Icon
                name="google"
                size={22}
                color={AppColor.accent}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.googleButtonText}>Login with Google</Text>
            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don’t have an account?</Text>
              <Pressable>
                <Text style={styles.signupLink}>Sign up</Text>
              </Pressable>
            </View>
          </View>
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
    backgroundColor: AppColor.background,
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 370,
    backgroundColor: AppColor.card,
    borderRadius: 40,
    padding: 32,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    backgroundColor: AppColor.accent,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: AppColor.accent,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  appTitle: {
    fontSize: 38,
    color: AppColor.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: AppColor.card,
    borderRadius: 14,
    paddingHorizontal: 18,
    color: AppColor.text,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColor.border,
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: AppColor.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  loginButtonText: {
    color: AppColor.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: AppColor.textSecondary,
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColor.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColor.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
    width: '100%',
  },
  googleButtonText: {
    color: AppColor.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupText: {
    color: AppColor.text,
    fontSize: 16,
    marginRight: 6,
  },
  signupLink: {
    color: AppColor.accent,
    fontSize: 17,
    fontWeight: 'bold',
  },
});
