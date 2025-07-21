/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import AppColor from '../../services/styles/AppColor';
import { getSongs } from '../../apis/bottomtabs_api/song_api';
import { SongInterface } from '../../services/models/API_Models';

type RootStackParamList = {
  AddSong: undefined;
  // ...other routes
};

const SongsTabView = () => {
  const route = useRoute();
  const navigation = useNavigation<import('@react-navigation/native-stack').NativeStackNavigationProp<RootStackParamList>>();
  const [songs, setSongs] = useState<SongInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [openSheetId, setOpenSheetId] = useState<number | null>(null);

  const fetchSongs = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getSongs();

      setSongs(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to load songs');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    // If navigated with reload param, reload songs
    if (route?.params && (route.params as any).reload) {
      fetchSongs();
    }
  }, [route?.params]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSongs(false);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={AppColor.background}
        barStyle="light-content"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColor.text]}
            tintColor={AppColor.text}
          />
        }
      >
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
            <Text style={styles.text}>Songs</Text>
            <TouchableOpacity
              style={{ padding: 6, borderRadius: 20, backgroundColor: AppColor.primary, marginLeft: 8 }}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('AddSong')}
            >
              <Icon name="add" size={24} color={AppColor.buttonText} />
            </TouchableOpacity>
          </View>
          {loading && (
            <ActivityIndicator
              size="large"
              color={AppColor.text}
              style={{ marginTop: 20 }}
            />
          )}
          {error && <Text style={styles.error}>{error}</Text>}
          {!loading && !error && songs.length === 0 && (
            <Text style={styles.empty}>No songs found.</Text>
          )}
          {!loading &&
            !error &&
            songs.map(song => (
              <View key={song.id} style={styles.songCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Text style={styles.songTitle}>{song.title}</Text>
                    <TouchableOpacity
                      style={styles.sheetIconBtn}
                      activeOpacity={0.7}
                      onPress={() => {
                        setOpenSheetId(openSheetId === song.id ? null : song.id);
                      }}
                    >
                      <Text style={styles.sheetIcon}>🎼</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.songArtist}>{song.artist}</Text>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{song.level}</Text>
                  </View>
                </View>
                {song.video_id ? (
                  <View style={styles.youtubeContainer}>
                    <YoutubePlayer
                      height={200}
                      play={false}
                      videoId={song.video_id}
                    />
                  </View>
                ) : null}
                {openSheetId === song.id && song.sheet_url && (
                  <View style={{ display: 'none' }}>
                    <WebView
                      source={{ uri: song.sheet_url }}
                      style={{ flex: 1 }}
                      startInLoadingState={true}
                    />
                  </View>
                )}
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SongsTabView;

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
    backgroundColor: AppColor.background,
    padding: 16,
  },
  text: {
    color: AppColor.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
  empty: {
    color: AppColor.text,
    marginTop: 20,
    fontStyle: 'italic',
  },
  songCard: {
    width: '100%',
    backgroundColor: AppColor.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: AppColor.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: AppColor.border,
  },
  cardHeader: {
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  songTitle: {
    color: AppColor.accent,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  sheetIconBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: AppColor.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  sheetIcon: {
    fontSize: 22,
    color: AppColor.buttonText,
  },
  songArtist: {
    color: AppColor.textSecondary,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 2,
    fontStyle: 'italic',
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: AppColor.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 4,
    marginBottom: 2,
  },
  levelText: {
    color: AppColor.buttonText,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  youtubeContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});
