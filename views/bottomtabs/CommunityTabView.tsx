/* eslint-disable react-native/no-inline-styles */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import AppColor from '../../services/styles/AppColor';
import { getPracticeRoomsByInstrument } from '../../apis/bottomtabs_api/practiceroom_api';
import { getUserById } from '../../apis/login/login_api';
import { PracticeRoomInterface } from '../../services/models/API_Models';

const INSTRUMENTS = [
  { key: 'piano', label: 'Piano' },
  { key: 'guitar', label: 'Guitar' },
  { key: 'violin', label: 'Violin' },
  { key: 'organ', label: 'Organ' },
  { key: 'flute', label: 'Flute' },
];

// Use the navigation prop without explicit typing to avoid duplicate RootStackParamList error
const CommunityTabView = () => {
  const navigation: any = useNavigation();
  const [selectedInstrument, setSelectedInstrument] = useState('piano');
  const [rooms, setRooms] = useState<PracticeRoomInterface[]>([]);
  const [hostUsernames, setHostUsernames] = useState<{
    [userId: number]: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async (instrument: string, showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await getPracticeRoomsByInstrument(instrument);
      // Add random amounts field to each room
      const dataWithAmounts = data.map(room => ({
        ...room,
        amounts: Math.floor(Math.random() * 10) + 1,
      }));
      setRooms(dataWithAmounts);
      // Fetch usernames for unique host_user_ids
      const uniqueHostIds = Array.from(
        new Set(data.map(room => room.host_user_id)),
      );
      const usernamesToFetch = uniqueHostIds.filter(
        id => !(id in hostUsernames),
      );
      if (usernamesToFetch.length > 0) {
        const usernameResults = await Promise.all(
          usernamesToFetch.map(async id => {
            try {
              const user = await getUserById(id);
              return { id, username: user.username };
            } catch {
              return { id, username: `User ${id}` };
            }
          }),
        );
        setHostUsernames(prev => {
          const updated = { ...prev };
          usernameResults.forEach(({ id, username }) => {
            updated[id] = username;
          });
          return updated;
        });
      }
    } catch (err) {
      setError('Failed to load rooms');
      setRooms([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms(selectedInstrument, false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRooms(selectedInstrument);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInstrument]);

  const renderRoom = ({
    item,
  }: {
    item: PracticeRoomInterface & { amounts?: number };
  }) => (
    <TouchableOpacity
      style={styles.roomCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('PracticeRoomView', { room: item })}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={styles.roomName}>{item.room_name}</Text>
        {typeof item.amounts === 'number' && (
          <Text style={styles.amounts}>participants: {item.amounts}</Text>
        )}
      </View>
      <Text style={styles.roomDetail}>
        Host: {hostUsernames[item.host_user_id] || `User ${item.host_user_id}`}
      </Text>
      <Text style={styles.roomDetail}>
        Created: {new Date(item.created_at).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={AppColor.background}
        barStyle="light-content"
      />
      <View style={styles.headerCol}>
        <Text style={styles.appTitle}>
          <Text style={styles.bold}>Music</Text>
          <Text style={styles.boldAccent}>4</Text>
          <Text style={styles.bold}>Younity</Text>
        </Text>
        <View style={styles.addButtonRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreatePracticeRoom')}
            activeOpacity={0.7}
          >
            <Icon name="add-circle" size={38} color={AppColor.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {INSTRUMENTS.map(inst => (
            <TouchableOpacity
              key={inst.key}
              style={[
                styles.tabButton,
                selectedInstrument === inst.key && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedInstrument(inst.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedInstrument === inst.key && styles.tabButtonTextActive,
                ]}
              >
                {inst.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.container}>
        {loading && (
          <ActivityIndicator
            size="large"
            color={AppColor.text}
            style={{ marginTop: 30 }}
          />
        )}
        {error && <Text style={styles.error}>{error}</Text>}
        {!loading && !error && rooms.length === 0 && (
          <Text style={styles.empty}>
            No practice rooms found for this instrument.
          </Text>
        )}
        {!loading && !error && rooms.length > 0 && (
          <FlatList
            data={rooms}
            keyExtractor={item => item.id.toString()}
            renderItem={renderRoom}
            contentContainerStyle={{ paddingVertical: 10 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CommunityTabView;

const styles = StyleSheet.create({
  headerCol: {
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  addButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 0,
    marginBottom: 0,
  },
  addButton: {
    marginRight: 0,
    marginTop: 0,
  },
  appTitle: {
    fontSize: 38,
    color: AppColor.text,
    marginBottom: 8,
    textAlign: 'center',
    flexDirection: 'row',
  },
  bold: {
    fontWeight: 'bold',
    color: AppColor.text,
  },
  boldAccent: {
    fontWeight: 'bold',
    color: AppColor.accent,
  },
  safeArea: {
    flex: 1,
    backgroundColor: AppColor.background,
  },
  tabBarContainer: {
    backgroundColor: AppColor.background,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: AppColor.border,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: AppColor.card,
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: AppColor.primary,
  },
  tabButtonText: {
    color: AppColor.textSecondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabButtonTextActive: {
    color: AppColor.buttonText,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: AppColor.background,
    padding: 16,
  },
  roomCard: {
    backgroundColor: AppColor.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: AppColor.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: AppColor.border,
  },
  roomName: {
    color: AppColor.accent,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  amounts: {
    color: AppColor.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
  },
  roomDetail: {
    color: AppColor.textSecondary,
    fontSize: 14,
    marginBottom: 2,
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  empty: {
    color: AppColor.text,
    marginTop: 30,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
