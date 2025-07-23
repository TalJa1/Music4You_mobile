import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
  RefreshControl,
} from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useState, useEffect } from 'react';

import { LessonInterfaceArray } from '../../services/models/API_Models';
import { getLessons } from '../../apis/bottomtabs_api/lesson_api';
import AppColor from '../../services/styles/AppColor';

const LearnTabView = () => {
  const [selectedTab, setSelectedTab] = useState<'theory' | 'practice'>(
    'theory',
  );
  const [lessons, setLessons] = useState<LessonInterfaceArray>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.centerRow}>
          <Text style={styles.appTitle}>
            <Text style={styles.bold}>Music</Text>
            <Text style={styles.boldAccent}>4</Text>
            <Text style={styles.bold}>You</Text>
          </Text>
        </View>
        <View style={styles.tabRow}>
          <Text
            style={selectedTab === 'theory' ? styles.tabActive : styles.tab}
            onPress={() => setSelectedTab('theory')}
          >
            Theory
          </Text>
          <Text
            style={selectedTab === 'practice' ? styles.tabActive : styles.tab}
            onPress={() => setSelectedTab('practice')}
          >
            Practice
          </Text>
        </View>
        <View style={styles.tabContent}>
          {selectedTab === 'theory' ? (
            loading ? (
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
                      {lesson.lesson_link &&
                        lesson.lesson_link.trim() !== '' && (
                          <Text
                            style={styles.readMoreLink}
                            onPress={() => Linking.openURL(lesson.lesson_link)}
                          >
                            Learn more here
                          </Text>
                        )}
                    </View>
                  ))
                )}
              </>
            )
          ) : (
            <Text style={styles.text}>Practice content goes here.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LearnTabView;

const styles = StyleSheet.create({
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
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  tab: {
    fontSize: 18,
    color: AppColor.textSecondary,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: 8,
  },
  tabActive: {
    fontSize: 18,
    color: AppColor.accent,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: AppColor.accent,
    marginHorizontal: 8,
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
});
