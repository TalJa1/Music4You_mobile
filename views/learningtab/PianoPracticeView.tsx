/* eslint-disable react-native/no-inline-styles */

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import SwitchToggle from 'react-native-switch-toggle';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import { Platform } from 'react-native';
import AppColor from '../../services/styles/AppColor';

const WHITE_KEYS = [
  { name: 'Do', file: 'note_do' },
  { name: 'Re', file: 'note_re' },
  { name: 'Mi', file: 'note_mi' },
  { name: 'Fa', file: 'note_fa' },
  { name: 'Sol', file: 'note_sol' },
  { name: 'La', file: 'note_la' },
];
const BLACK_KEYS = [
  { name: 'Do#', file: null, position: 0 }, // C#
  { name: 'Re#', file: null, position: 1 }, // D#
  { name: 'Fa#', file: null, position: 3 }, // F#
  { name: 'Sol#', file: null, position: 4 }, // G#
  { name: 'La#', file: null, position: 5 }, // A#
];

const PianoPracticeView = () => {
  const navigation = useNavigation();
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [answered, setAnswered] = useState<{ [note: string]: boolean }>({});
  const [showKeyNames, setShowKeyNames] = useState<boolean>(true);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      Sound.setCategory('Playback', true);
    } else {
      Sound.setCategory('Playback');
    }
  }, []);

  const playNote = (note: string, file: string) => {
    setCurrentNote(note);
    if (Platform.OS === 'android') {
      const sound = new Sound(file, 'raw', error => {
        if (error) {
          sound.release && sound.release();
        } else {
          sound.play(() => {
            sound.release();
          });
        }
      });
    }
  };

  const handleKeyPress = (note: string) => {
    if (note === currentNote) {
      setAnswered(ans => ({ ...ans, [note]: true }));
      setCurrentNote(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color={AppColor.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Piano Practice</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.toggleRow}>
        <Text style={{ marginRight: 12, fontSize: 16, color: AppColor.text }}>
          Show Key Names
        </Text>
        <SwitchToggle
          switchOn={showKeyNames}
          onPress={() => setShowKeyNames(v => !v)}
          circleColorOff="#fff"
          circleColorOn="#fff"
          backgroundColorOn="#4caf50"
          backgroundColorOff="#aaa"
          containerStyle={{
            width: 50,
            height: 28,
            borderRadius: 25,
          }}
          circleStyle={{
            width: 24,
            height: 24,
            borderRadius: 12,
          }}
        />
      </View>
      <View style={styles.buttonRow}>
        {[...WHITE_KEYS, ...BLACK_KEYS].map(n =>
          n.file ? (
            <TouchableOpacity
              key={n.name}
              style={[
                styles.soundButton,
                answered[n.name] && styles.soundButtonCorrect,
              ]}
              onPress={() => playNote(n.name, n.file as string)}
            >
              <Text style={styles.soundButtonText}>
                {n.name}
              </Text>
            </TouchableOpacity>
          ) : null,
        )}
      </View>
      <View style={styles.keyboardContainer}>
        <View style={styles.whiteKeysRow}>
          {WHITE_KEYS.map(n => (
            <TouchableOpacity
              key={n.name}
              style={styles.whiteKey}
              onPress={() => handleKeyPress(n.name)}
              activeOpacity={0.8}
            >
              {showKeyNames && <Text style={styles.keyText}>{n.name}</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.blackKeysRow}>
          {WHITE_KEYS.map((_, idx) => {
            const blackKey = BLACK_KEYS.find(bk => bk.position === idx);
            if (!blackKey) {
              return <View key={idx} style={styles.blackKeySpacer} />;
            }
            return (
              <TouchableOpacity
                key={blackKey.name}
                style={styles.blackKey}
                onPress={() => handleKeyPress(blackKey.name)}
                activeOpacity={0.8}
              >
                {showKeyNames && (
                  <Text style={styles.blackKeyText}>{blackKey.name}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PianoPracticeView;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: AppColor.text,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  // Removed custom toggle button styles
  safeArea: { flex: 1, backgroundColor: AppColor.background, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColor.text,
    textAlign: 'center',
    flex: 1,
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
  keyboardContainer: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
    height: 180,
    position: 'relative',
  },
  whiteKeysRow: {
    flexDirection: 'row',
    zIndex: 1,
  },
  whiteKey: {
    backgroundColor: 'white',
    borderColor: AppColor.border,
    borderWidth: 1,
    margin: 2,
    width: 48,
    height: 160,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 4,
  },
  keyText: { color: 'black', fontSize: 16, marginBottom: 8 },
  blackKeysRow: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 100,
    zIndex: 2,
    paddingLeft: 32,
  },
  blackKey: {
    backgroundColor: '#222',
    width: 32,
    height: 100,
    marginHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    elevation: 6,
  },
  blackKeyText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  blackKeySpacer: {
    width: 48,
    height: 100,
    marginHorizontal: 8,
    backgroundColor: 'transparent',
  },
});
