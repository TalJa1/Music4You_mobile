/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import SwitchToggle from 'react-native-switch-toggle';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Sound from 'react-native-sound';
import { Platform } from 'react-native';

import AppColor from '../../services/styles/AppColor';

// IMPORTANT: For Android, place your mp3 files in android/app/src/main/res/raw/ as lowercase (e.g., do.mp3, re.mp3, ...)
const WHITE_KEYS = [
  { name: 'Do', file: 'note_do' },
  { name: 'Re', file: 'note_re' },
  { name: 'Mi', file: 'note_mi' },
  { name: 'Fa', file: 'note_fa' },
  { name: 'Sol', file: 'note_sol' },
  { name: 'La', file: 'note_la' },
];
const BLACK_KEYS = [
  // No sharp sounds, but keep for UI spacing
  { name: 'Do#', file: null, position: 0 }, // C#
  { name: 'Re#', file: null, position: 1 }, // D#
  // No black key after Mi
  { name: 'Fa#', file: null, position: 3 }, // F#
  { name: 'Sol#', file: null, position: 4 }, // G#
  { name: 'La#', file: null, position: 5 }, // A#
];

const PianoPracticeView = () => {
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [answered, setAnswered] = useState<{ [note: string]: boolean }>({});
  const [showKeyNames, setShowKeyNames] = useState<boolean>(true);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      // The second argument allows mixing with other audio sources
      Sound.setCategory('Playback', true);
    } else {
      Sound.setCategory('Playback');
    }
  }, []);

  const playNote = (note: string, file: string) => {
    setCurrentNote(note);
    if (Platform.OS === 'android') {
      console.log('[PianoPractice] Attempting to load sound:', file);
      const sound = new Sound(file, 'raw', error => {
        if (error) {
          console.log('[PianoPractice] Failed to load the sound', error);
          sound.release && sound.release();
        } else {
          console.log('[PianoPractice] Sound loaded, playing...');
          sound.play(success => {
            if (!success) {
              console.log('[PianoPractice] Sound playback failed');
            } else {
              console.log('[PianoPractice] Sound played successfully');
            }
            sound.release();
          });
        }
      });
    }
  };

  // Mark as answered if correct
  const handleKeyPress = (note: string) => {
    if (note === currentNote) {
      setAnswered(ans => ({ ...ans, [note]: true }));
      setCurrentNote(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Piano Practice</Text>
      {/* Toggle key name button */}
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
      {/* Sound buttons row */}
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
                {n.name} {answered[n.name] ? '✔️' : ''}
              </Text>
            </TouchableOpacity>
          ) : null,
        )}
      </View>
      {/* Piano keyboard visual */}
      <View style={styles.keyboardContainer}>
        {/* White keys */}
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
        {/* Black keys (overlayed) */}
        <View style={styles.blackKeysRow}>
          {WHITE_KEYS.map((_, idx) => {
            const blackKey = BLACK_KEYS.find(bk => bk.position === idx);
            if (!blackKey) {
              // Render empty space where no black key exists
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
