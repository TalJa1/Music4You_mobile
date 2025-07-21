/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';
import AppColor from '../../services/styles/AppColor';
import React, { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

type MusicSheetRouteParams = {
  sheet_url?: string;
};

const MusicSheet = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sheet_url } = (route.params as MusicSheetRouteParams) || {};

  useEffect(() => {
    console.log('sheet_url:', sheet_url);
  }, [sheet_url]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon
              name="arrow-back"
              size={28}
              color={AppColor.primary}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>MusicSheet</Text>
          <View style={{ width: 28, height: 28 }} />
        </View>
        <WebView
          source={{
            uri:
              sheet_url ||
              'https://www.free-scores.com/PDF/chopin-fra-ric-chopin-op009-nocturnos-81865.pdf',
          }}
          style={styles.pdf}
        />
      </View>
    </SafeAreaView>
  );
};

export default MusicSheet;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColor.background,
  },
  pdf: {
    flex: 1,
    width: '100%',
    minHeight: 400,
    backgroundColor: AppColor.background,
    borderRadius: 8,
    marginTop: 16,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  iconBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: AppColor.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  icon: {
    fontSize: 22,
    color: AppColor.primary,
    fontWeight: 'bold',
  },
});
