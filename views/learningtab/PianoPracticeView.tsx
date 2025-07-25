import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Sound from 'react-native-sound';
import AppColor from '../../services/styles/AppColor';

const NOTES = [
  { name: 'Do', file: require('../../assets/note_sounds/Do.mp3') },
  { name: 'Re', file: require('../../assets/note_sounds/Re.mp3') },
  { name: 'Mi', file: require('../../assets/note_sounds/Mi.mp3') },
  { name: 'Fa', file: require('../../assets/note_sounds/Fa.mp3') },
  { name: 'La', file: require('../../assets/note_sounds/La.mp3') },
];

const PianoPracticeView = () => {
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [answered, setAnswered] = useState<{ [note: string]: boolean }>({});

  const playNote = (note: string, file: any) => {
    setCurrentNote(note);
    const sound = new Sound(file, error => {
      if (!error) sound.play(() => sound.release());
    });
  };

  const handleKeyPress = (note: string) => {
    if (note === currentNote) {
      setAnswered(ans => ({ ...ans, [note]: true }));
      setCurrentNote(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Piano Practice</Text>
      <View style={styles.buttonRow}>
        {NOTES.map(n => (
          <TouchableOpacity
            key={n.name}
            style={[
              styles.soundButton,
              answered[n.name] && styles.soundButtonCorrect,
            ]}
            onPress={() => playNote(n.name, n.file)}
          >
            <Text style={styles.soundButtonText}>
              {n.name} {answered[n.name] ? '✔️' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.keyboardRow}>
        {NOTES.map(n => (
          <TouchableOpacity
            key={n.name}
            style={styles.key}
            onPress={() => handleKeyPress(n.name)}
          >
            <Text style={styles.keyText}>{n.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default PianoPracticeView;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColor.background, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColor.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  soundButton: {
    backgroundColor: AppColor.primary,
    margin: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  soundButtonCorrect: {
    backgroundColor: 'green',
  },
  soundButtonText: {
    color: AppColor.buttonText,
    fontWeight: 'bold',
    fontSize: 18,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  key: {
    backgroundColor: AppColor.card,
    borderColor: AppColor.border,
    borderWidth: 1,
    margin: 2,
    width: 40,
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 4,
  },
  keyText: { color: AppColor.text, fontSize: 16, marginBottom: 8 },
});
