/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PARTICIPANTS = [
  { id: '1', name: 'Minh Quan', avatar: null },
  { id: '2', name: 'Ngoc Anh', avatar: null },
  { id: '3', name: 'Phuc', avatar: null, isSpeaking: true },
];

const PracticeRoomView = () => {
  const windowHeight = Dimensions.get('window').height;
  const [userName, setUserName] = useState('');
  const [cameraOn, setCameraOn] = useState(true);
  const [frontCamera, setFrontCamera] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.username || user.name || '');
        }
      } catch (e) {
        setUserName('');
      }
    };
    fetchUser();
  }, []);

  // Demo camera image URIs for front/back
  const frontCameraUri = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80';
  const backCameraUri = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Large camera preview */}
          <View style={[styles.cameraPreview, { height: windowHeight * 0.55 }]}> 
            {cameraOn ? (
              <Image
                source={{ uri: frontCamera ? frontCameraUri : backCameraUri }}
                style={styles.cameraImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.cameraImage, { backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }]}> 
                <Icon name="video-off" size={64} color="#888" />
              </View>
            )}
            {/* Overlay: User name and status */}
            <View style={styles.overlayTop}>
              <Text style={styles.userName}>{userName || ' '}</Text>
              <Text style={styles.speakingStatus}>SPEAKING | 32s</Text>
            </View>
          </View>

          {/* Call controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="microphone" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setCameraOn(on => !on)}
            >
              <Icon name={cameraOn ? 'video' : 'video-off'} size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFrontCamera(f => !f)}
              disabled={!cameraOn}
            >
              <Icon name="camera" size={28} color={cameraOn ? '#fff' : '#888'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.hangupButton]}
            >
              <Icon name="phone-hangup" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Participants row */}
          <View style={styles.participantsRow}>
            <FlatList
              data={PARTICIPANTS}
              keyExtractor={item => item.id}
              horizontal
              contentContainerStyle={{ alignItems: 'center' }}
              renderItem={({ item }) => (
                <View style={styles.participantCol}>
                  <View
                    style={[
                      styles.avatarCircle,
                      item.isSpeaking && styles.speakingBorder,
                    ]}
                  >
                    {item.avatar ? (
                      <Image
                        source={{ uri: item.avatar }}
                        style={styles.avatarImg}
                      />
                    ) : (
                      <Icon name="account" size={38} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.participantName}>{item.name}</Text>
                  {item.isSpeaking && (
                    <Text style={styles.speakingLabel}>Speaking</Text>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PracticeRoomView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#181A20',
  },
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    justifyContent: 'flex-start',
  },
  cameraPreview: {
    width: '100%',
    backgroundColor: '#222',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  cameraImage: {
    width: '100%',
    height: '100%',
  },
  overlayTop: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    alignItems: 'flex-start',
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  speakingStatus: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  controlButton: {
    backgroundColor: '#23262F',
    borderRadius: 32,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
  },
  hangupButton: {
    backgroundColor: '#E53935',
  },
  participantsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 18,
    minHeight: 110,
  },
  participantCol: {
    alignItems: 'center',
    marginHorizontal: 14,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  speakingBorder: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  participantName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  speakingLabel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
