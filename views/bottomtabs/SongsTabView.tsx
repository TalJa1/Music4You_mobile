/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppColor from '../../services/styles/AppColor';
import { getSongs } from '../../apis/bottomtabs_api/song_api';
import { SongInterface } from '../../services/models/API_Models';



const SongsTabView = () => {
  const [songs, setSongs] = useState<SongInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);


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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSongs(false);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={AppColor.background} barStyle="light-content" />
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
          <Text style={styles.text}>Songs</Text>
          {loading && <ActivityIndicator size="large" color={AppColor.text} style={{ marginTop: 20 }} />}
          {error && <Text style={styles.error}>{error}</Text>}
          {!loading && !error && songs.length === 0 && (
            <Text style={styles.empty}>No songs found.</Text>
          )}
          {!loading && !error && songs.map(song => (
            <View key={song.id} style={styles.songItem}>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.songArtist}>{song.artist}</Text>
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
  songItem: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  songTitle: {
    color: AppColor.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  songArtist: {
    color: AppColor.text,
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
});
