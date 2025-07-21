import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import AppColor from '../../services/styles/AppColor';
import React from 'react';

const MusicSheet = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>MusicSheet</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MusicSheet;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColor.background,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColor.card,
    margin: 16,
    borderRadius: 12,
    borderColor: AppColor.border,
    borderWidth: 1,
    padding: 24,
  },
  title: {
    color: AppColor.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
