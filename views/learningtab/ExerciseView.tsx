import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getExercisesByLessonId } from '../../apis/bottomtabs_api/exercise_api';
import { ExerciseInterface } from '../../services/models/API_Models';
import AppColor from '../../services/styles/AppColor';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ExerciseView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { lessonId } = route.params as { lessonId: number };
  const [exercises, setExercises] = useState<ExerciseInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flipped, setFlipped] = useState<{ [id: number]: boolean }>({});
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const data = await getExercisesByLessonId(lessonId);
        setExercises(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to load exercises.');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [lessonId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} color={AppColor.buttonText} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Exercises</Text>
        {loading && <Text>Loading...</Text>}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && !error && exercises.length === 0 && (
          <Text>No exercises found.</Text>
        )}
        {exercises.length > 0 && (
          <>
            <TouchableOpacity
              key={exercises[current].id}
              style={styles.exerciseCard}
              activeOpacity={0.85}
              onPress={() =>
                setFlipped(f => ({
                  ...f,
                  [exercises[current].id]: !f[exercises[current].id],
                }))
              }
            >
              {!flipped[exercises[current].id] ? (
                <View style={styles.centeredContent}>
                  <Text style={styles.exerciseTitle}>
                    {exercises[current].title}
                  </Text>
                </View>
              ) : (
                <View style={styles.centeredContent}>
                  <Text style={styles.exerciseContent}>
                    {exercises[current].content}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  current === 0 && styles.navButtonDisabled,
                ]}
                onPress={() => setCurrent(i => Math.max(0, i - 1))}
                disabled={current === 0}
              >
                <Icon
                  name="chevron-left"
                  size={32}
                  color={
                    current === 0 ? AppColor.textSecondary : AppColor.buttonText
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  current === exercises.length - 1 && styles.navButtonDisabled,
                ]}
                onPress={() =>
                  setCurrent(i => Math.min(exercises.length - 1, i + 1))
                }
                disabled={current === exercises.length - 1}
              >
                <Icon
                  name="chevron-right"
                  size={32}
                  color={
                    current === exercises.length - 1
                      ? AppColor.textSecondary
                      : AppColor.buttonText
                  }
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColor.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColor.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    color: AppColor.accent,
    marginBottom: 12,
    textAlign: 'center',
  },
  exerciseCard: {
    width: '95%',
    height: 350,
    backgroundColor: AppColor.card,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  centeredContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColor.text,
    textAlign: 'center',
  },
  exerciseContent: {
    fontSize: 28,
    color: AppColor.text,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  navButton: {
    backgroundColor: AppColor.primary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  navButtonDisabled: {
    backgroundColor: AppColor.border,
    opacity: 0.5,
  },
  navButtonText: {
    color: AppColor.buttonText,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingLeft: 8,
    marginBottom: 0,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
