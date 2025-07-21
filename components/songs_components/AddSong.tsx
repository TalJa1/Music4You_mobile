/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppColor from '../../services/styles/AppColor';
import { createSong } from '../../apis/bottomtabs_api/song_api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const levels = [
  { label: 'Basic', value: 'basic' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Hard', value: 'hard' },
  { label: 'Extreme Hard', value: 'extreme hard' },
];


type RootStackParamList = {
  Songs: { reload: boolean } | undefined;
  AddSong: undefined;
  // add other screens if needed
};

const AddSong = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [level, setLevel] = useState('basic');
  const [sheetUrl, setSheetUrl] = useState('');
  const [videoId, setVideoId] = useState('');

  function extractYouTubeId(input: string): string {
    const regex = /(?:v=|\/embed\/|youtu\.be\/|\/v\/|\/watch\?v=|\/shorts\/)([\w-]{11})/;
    const match = input.match(regex);
    if (match && match[1]) return match[1];
    const urlMatch = input.match(/(?:youtube\.com|youtu\.be)[^\w-]*([\w-]{11})/);
    if (urlMatch && urlMatch[1]) return urlMatch[1];
    return input;
  }

  const handleAddSong = async () => {
    if (!title || !artist || !level || !sheetUrl) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    try {
      const newSong = {
        title: title.trim(),
        artist: artist.trim(),
        level: level.trim(),
        sheet_url: sheetUrl.trim(),
        video_id: videoId.trim(),
      };
      await createSong(newSong);
      Alert.alert('Success', 'Song added!');
      setTitle('');
      setArtist('');
      setLevel('basic');
      setSheetUrl('');
      setVideoId('');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add song. Please try again.');
    }
  };

  const isDisabled =
    !title.trim() || !artist.trim() || !level.trim() || !sheetUrl.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={AppColor.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={AppColor.buttonText} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Song</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor={AppColor.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Artist"
            placeholderTextColor={AppColor.textSecondary}
            value={artist}
            onChangeText={setArtist}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={level}
              onValueChange={setLevel}
              style={styles.picker}
              dropdownIconColor={AppColor.text}
            >
              {levels.map(l => (
                <Picker.Item key={l.value} label={l.label} value={l.value} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Sheet URL"
            placeholderTextColor={AppColor.textSecondary}
            value={sheetUrl}
            onChangeText={setSheetUrl}
          />
          <TextInput
            style={styles.input}
            placeholder="YouTube Video ID"
            placeholderTextColor={AppColor.textSecondary}
            value={videoId}
            onChangeText={text => setVideoId(extractYouTubeId(text))}
          />
          <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            onPress={handleAddSong}
            disabled={isDisabled}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="add-circle" size={22} color={isDisabled ? AppColor.textSecondary : AppColor.buttonText} style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Add Song</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColor.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: AppColor.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColor.text,
    marginBottom: 24,
    alignSelf: 'center',
    marginTop: 24,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: AppColor.primary,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: AppColor.card,
    color: AppColor.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: AppColor.border,
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: AppColor.card,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColor.border,
    overflow: 'hidden',
  },
  picker: {
    color: AppColor.text,
    width: '100%',
    height: 50,
  },
  button: {
    backgroundColor: AppColor.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  buttonText: {
    color: AppColor.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonDisabled: {
    backgroundColor: AppColor.border,
  },
});

export default AddSong;
