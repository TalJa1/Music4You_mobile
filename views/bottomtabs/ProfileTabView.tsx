/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import AppColor from '../../services/styles/AppColor';
import { getUserProgressByUserId } from '../../apis/bottomtabs_api/progress_api';
import {
  UserInterface,
  ProgressInterfaceArray,
} from '../../services/models/API_Models';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileTabView = () => {
  const [user, setUser] = useState<UserInterface>({
    username: '',
    email: '',
    avatar_url: '',
    id: 0,
    created_at: '',
  });
  const [progress, setProgress] = useState<ProgressInterfaceArray>([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchProgress = async () => {
    try {
      if (user && user.id) {
        const userProgress = await getUserProgressByUserId(user.id);
        setProgress(userProgress);
      } else {
        setProgress([]);
      }
    } catch (e) {
      setProgress([]);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProgress();
    setRefreshing(false);
  };

  const currentCourse = {
    title: 'Course progress',
    progress: progress.length > 0 ? progress.length / 10 : 0,
  };
  const allAchievements = [
    { id: 1, label: 'Profile Completed', icon: 'account-check' },
    { id: 2, label: 'First Song Learned', icon: 'music' },
    { id: 3, label: '1-Day Streak', icon: 'fire' },
  ];
  const achievements =
    currentCourse.progress > 0 ? allAchievements : [allAchievements[0]];
  const reminders = [
    { id: 1, text: 'Practice guitar for 30 minutes today' },
    { id: 2, text: 'Complete lesson 3 in Music4You course' },
  ];

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
        <View style={styles.container}>
          {/* Profile Info */}
          <View style={styles.profileCard}>
            <Image
              source={
                user?.avatar_url
                  ? { uri: user.avatar_url }
                  : require('../../assets/images/default-avatar.png')
              }
              style={styles.avatar}
            />
            <Text style={styles.name}>{user?.username || 'Your Name'}</Text>
            <Text style={styles.email}>{user?.email || 'your@email.com'}</Text>
          </View>

          {/* Current Course */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Learning Course</Text>
            <View style={styles.courseCard}>
              <Text style={styles.courseTitle}>{currentCourse.title}</Text>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(currentCourse.progress * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(Math.min(currentCourse.progress * 100, 100))}%
                complete
              </Text>
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsRow}>
              {achievements.map(a => (
                <View key={a.id} style={styles.achievementItem}>
                  <View style={styles.achievementIconCircle}>
                    <Icon name={a.icon} size={28} color={AppColor.text} />
                  </View>
                  <Text style={styles.achievementLabel}>{a.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reminders */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reminders</Text>
            {reminders.map(r => (
              <View key={r.id} style={styles.reminderItem}>
                <Text style={styles.reminderText}>• {r.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileTabView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColor.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: AppColor.background,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: AppColor.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    backgroundColor: AppColor.card,
  },
  name: {
    color: AppColor.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: AppColor.textSecondary,
    fontSize: 15,
    marginBottom: 2,
  },
  section: {
    width: '100%',
    marginBottom: 28,
    alignSelf: 'center',
    maxWidth: 400,
  },
  sectionTitle: {
    color: AppColor.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseCard: {
    backgroundColor: AppColor.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 8,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  courseTitle: {
    color: AppColor.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: AppColor.border,
    borderRadius: 5,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: 10,
    backgroundColor: AppColor.primary,
    borderRadius: 5,
  },
  progressText: {
    color: AppColor.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  achievementItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  achievementIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColor.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  achievementIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: AppColor.text,
  },
  achievementLabel: {
    color: AppColor.text,
    fontSize: 13,
    textAlign: 'center',
  },
  reminderItem: {
    marginBottom: 6,
  },
  reminderText: {
    color: AppColor.textSecondary,
    fontSize: 15,
  },
});
