import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByEmail } from '../../apis/login/login_api';
import { createPracticeRoom } from '../../apis/bottomtabs_api/practiceroom_api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppColor from '../../services/styles/AppColor';

const INSTRUMENTS = [
  { key: 'piano', label: 'Piano' },
  { key: 'guitar', label: 'Guitar' },
  { key: 'violin', label: 'Violin' },
  { key: 'organ', label: 'Organ' },
  { key: 'flute', label: 'Flute' },
];

const CreatePracticeRoom = () => {
  const navigation = useNavigation();
  const [roomName, setRoomName] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState(
    INSTRUMENTS[0].key,
  );
  const [createdAt] = useState(() => new Date());

  const handleCreate = async () => {
    if (!roomName.trim()) {
      Alert.alert('Validation', 'Please enter a room name.');
      return;
    }
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) throw new Error('User not found');
      const user = JSON.parse(userData);
      if (!user.email) throw new Error('User email not found');
      // Get user by email to get ID
      const userObj = await getUserByEmail(user.email);
      const host_user_id = userObj.id;
      const newRoom = {
        room_name: roomName,
        host_user_id,
        instrument: selectedInstrument,
      };
      await createPracticeRoom(newRoom);
      Alert.alert('Success', 'Practice room created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to create practice room.');
    }
  };

  const isFormValid = roomName.trim().length > 0 && selectedInstrument;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={30} color={AppColor.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Practice Room</Text>
        <View style={styles.centeredFields}>
          <TextInput
            style={styles.input}
            placeholder="Room Name"
            value={roomName}
            onChangeText={setRoomName}
            placeholderTextColor={AppColor.textSecondary}
          />
          <Text style={styles.label}>Instrument</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.instrumentRow}
          >
            {INSTRUMENTS.map(inst => (
              <TouchableOpacity
                key={inst.key}
                style={[
                  styles.instrumentButton,
                  selectedInstrument === inst.key &&
                    styles.instrumentButtonActive,
                ]}
                onPress={() => setSelectedInstrument(inst.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.instrumentButtonText,
                    selectedInstrument === inst.key &&
                      styles.instrumentButtonTextActive,
                  ]}
                >
                  {inst.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.createdAtBox}>
            <Text style={styles.label}>Created At</Text>
            <Text style={styles.createdAtText}>
              {createdAt.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.createButton,
              !isFormValid && styles.createButtonDisabled,
            ]}
            onPress={handleCreate}
            activeOpacity={0.8}
            disabled={!isFormValid}
          >
            <Text style={styles.createButtonText}>Create Room</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePracticeRoom;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColor.background,
  },
  scrollContent: {
    padding: 24,
  },
  centeredFields: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
    marginBottom: 0,
    height: 40,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColor.primary,
    textAlign: 'center',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColor.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    color: AppColor.text,
    marginBottom: 20,
    backgroundColor: AppColor.card,
    width: 300,
    maxWidth: '90%',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: AppColor.textSecondary,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  instrumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    paddingRight: 8,
    justifyContent: 'center',
  },
  instrumentButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: AppColor.card,
    borderWidth: 1,
    borderColor: AppColor.border,
    marginRight: 8,
  },
  instrumentButtonActive: {
    backgroundColor: AppColor.primary,
    borderColor: AppColor.primary,
  },
  instrumentButtonText: {
    color: AppColor.textSecondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  instrumentButtonTextActive: {
    color: AppColor.buttonText,
  },
  createButton: {
    backgroundColor: AppColor.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: 200,
    marginTop: 10,
  },
  createButtonText: {
    color: AppColor.buttonText,
    fontWeight: 'bold',
    fontSize: 18,
  },
  createButtonDisabled: {
    backgroundColor: AppColor.border,
  },
  createdAtBox: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  createdAtText: {
    color: AppColor.textSecondary,
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 2,
  },
});
