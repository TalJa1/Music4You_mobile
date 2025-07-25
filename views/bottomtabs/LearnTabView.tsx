/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';

import React, { useState, useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  LessonInterfaceArray,
  UserInterface,
} from '../../services/models/API_Models';
import { getLessons } from '../../apis/bottomtabs_api/lesson_api';
import {
  getUserProgressByUserIdAndLessonId,
  createUserProgress,
} from '../../apis/bottomtabs_api/progress_api';
import AppColor from '../../services/styles/AppColor';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionModel from '../../components/lesson_components/ActionModel';

type RootStackParamList = {
  LearnTab: undefined;
  Exercise: { lessonId: number };
  PianoPractice: undefined;
  // add other routes if needed
};

const LearnTabView = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [lessons, setLessons] = useState<LessonInterfaceArray>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<UserInterface>({
    username: '',
    email: '',
    avatar_url: '',
    id: 0,
    created_at: '',
  });
  const [actionModalVisible, setActionModalVisible] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    onProceed: undefined as undefined | (() => void),
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        setUser({
          username: '',
          email: '',
          avatar_url: '',
          id: 0,
          created_at: '',
        });
      }
    };
    loadUser();
  }, []);

  const handleCheckProgressAndOpen = async (lesson: any) => {
    try {
      const progressRes = await getUserProgressByUserIdAndLessonId(
        user.id,
        lesson.id,
      );

      if (progressRes) {
        setModalContent({
          title: 'Progress found',
          message: 'You have already started this lesson.',
          onProceed: () => {
            if (lesson.lesson_link && lesson.lesson_link.trim() !== '') {
              Linking.openURL(lesson.lesson_link);
            }
          },
        });
      } else {
        setModalContent({
          title: 'No progress',
          message: 'You have not started this lesson yet.',
          onProceed: async () => {
            try {
              await createUserProgress({
                user_id: user.id,
                lesson_id: lesson.id,
                completed: true,
                completed_at: new Date().toISOString(),
              });
            } catch (err) {
              // Optionally handle error (e.g., show a toast)
            }
            if (lesson.lesson_link && lesson.lesson_link.trim() !== '') {
              Linking.openURL(lesson.lesson_link);
            }
          },
        });
      }
      setModalVisible(true);
    } catch (e: any) {
      // If axios error, try to check if it's a 404 (no progress)
      if (e?.response?.status === 404) {
        setModalContent({
          title: 'No progress',
          message: 'You have not started this lesson yet.',
          onProceed: async () => {
            try {
              await createUserProgress({
                user_id: user.id,
                lesson_id: lesson.id,
                completed: true,
                completed_at: new Date().toISOString(),
              });
            } catch (err) {
              // Optionally handle error (e.g., show a toast)
            }
            if (lesson.lesson_link && lesson.lesson_link.trim() !== '') {
              Linking.openURL(lesson.lesson_link);
            }
          },
        });
      } else {
        setModalContent({
          title: 'Error',
          message: `Could not check progress. ${e}`,
          onProceed: undefined,
        });
      }
      setModalVisible(true);
    }
  };

  const handlePracticePress = () => {
    navigation.navigate('PianoPractice');
  };

  const fetchLessons = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getLessons();
      setLessons(data);
    } catch (e) {
      setLessons([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLessons(false);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={AppColor.background}
        barStyle="light-content"
      />
      {/* Custom Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalMessage}>{modalContent.message}</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: AppColor.card }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: AppColor.accent },
                ]}
                onPress={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    modalContent.onProceed && modalContent.onProceed();
                  }, 200);
                }}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: AppColor.background },
                  ]}
                >
                  Proceed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* ...existing code... */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ...existing code... */}
        <View style={styles.centerRow}>
          <Text style={styles.appTitle}>
            <Text style={styles.bold}>Music</Text>
            <Text style={styles.boldAccent}>4</Text>
            <Text style={styles.bold}>You</Text>
          </Text>
        </View>
        {/* ...existing code... */}
        <View style={styles.headerRow}>
          <Text style={styles.theoryTitle}>Theory</Text>
          <TouchableOpacity
            style={styles.practiceButton}
            onPress={handlePracticePress}
          >
            <Icon name="piano" size={24} color={AppColor.accent} />
          </TouchableOpacity>
        </View>
        <ActionModel
          visible={actionModalVisible}
          onClose={() => setActionModalVisible(false)}
        />
        {/* ...existing code... */}
        <View style={styles.tabContent}>
          {loading ? (
            <Text style={styles.text}>Loading...</Text>
          ) : (
            <>
              {!lessons || lessons.length === 0 ? (
                <Text style={styles.text}>No lessons found.</Text>
              ) : (
                lessons.map(lesson => (
                  <View key={lesson.id} style={styles.lessonCard}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonLevel}>
                      Level: {lesson.level}
                    </Text>
                    <Text style={styles.lessonDescription}>
                      {lesson.description}
                    </Text>
                    {lesson.media_id && lesson.media_id.trim() !== '' ? (
                      <View style={styles.videoContainer}>
                        <WebView
                          style={styles.video}
                          javaScriptEnabled={true}
                          domStorageEnabled={true}
                          source={{
                            uri: `https://www.youtube.com/embed/${lesson.media_id}`,
                          }}
                        />
                      </View>
                    ) : (
                      <Text style={styles.lessonMeta}>
                        No Video instruction for this
                      </Text>
                    )}

                    <View style={styles.typeRow}>
                      <Text style={styles.lessonMetaRight}>
                        Type: {lesson.type}
                      </Text>
                    </View>
                    {lesson.lesson_link && lesson.lesson_link.trim() !== '' && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 6,
                        }}
                      >
                        <Text
                          style={styles.readMoreLink}
                          onPress={() => handleCheckProgressAndOpen(lesson)}
                        >
                          Learn more here
                        </Text>
                        <TouchableOpacity
                          style={styles.exerciseButton}
                          onPress={() =>
                            navigation.navigate('Exercise', {
                              lessonId: lesson.id,
                            })
                          }
                        >
                          <Text style={styles.exerciseButtonText}>
                            Exercise
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LearnTabView;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: AppColor.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColor.accent,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: AppColor.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    display: 'flex',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColor.text,
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  theoryTitle: {
    fontSize: 24,
    color: AppColor.text,
    fontWeight: 'bold',
  },
  practiceButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  practiceButtonText: {
    fontSize: 16,
    color: AppColor.background,
    fontWeight: 'bold',
  },
  tabContent: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
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
    justifyContent: 'center',
    backgroundColor: AppColor.background,
    padding: 16,
  },
  text: {
    color: AppColor.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  lessonCard: {
    width: '95%',
    backgroundColor: AppColor.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    alignSelf: 'center',
  },
  lessonTitle: {
    color: AppColor.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  lessonLevel: {
    color: AppColor.accent,
    fontSize: 15,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  lessonDescription: {
    color: AppColor.textSecondary,
    fontSize: 15,
    marginBottom: 4,
  },
  lessonMeta: {
    color: AppColor.textSecondary,
    fontSize: 12,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 2,
    marginBottom: 2,
  },
  lessonMetaRight: {
    color: AppColor.accent,
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor: AppColor.card,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    textAlign: 'right',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    borderRadius: 10,
  },
  readMoreLink: {
    color: AppColor.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
  },
  exerciseButton: {
    marginLeft: 12,
    backgroundColor: AppColor.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  exerciseButtonText: {
    color: AppColor.buttonText,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
