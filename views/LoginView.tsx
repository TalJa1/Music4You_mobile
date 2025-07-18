
import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react';

type LoginViewProps = {
  onLogin: () => void;
};

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoginView</Text>
      {/* Replace with real login form */}
      <Button title="Login" onPress={onLogin} />
    </View>
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
