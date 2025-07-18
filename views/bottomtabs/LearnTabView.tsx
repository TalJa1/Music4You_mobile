
import { StyleSheet, Text, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import React from 'react';
import AppColor from '../../services/styles/AppColor';


const LearnTabView = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={AppColor.background} barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.text}>LearnTabView</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LearnTabView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColor.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColor.background,
    padding: 16,
  },
  text: {
    color: AppColor.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
});
