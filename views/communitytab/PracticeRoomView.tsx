import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';

type PracticeRoomParams = {
  room?: any; // Replace 'any' with the actual type if known
};

type RootStackParamList = {
  PracticeRoomView: PracticeRoomParams;
};

const PracticeRoomView = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PracticeRoomView'>>();
  const { room } = route.params || {};

  useEffect(() => {
    if (room) {
      console.log('PracticeRoomView room data:', room);
    }
  }, [room]);

  return (
    <View>
      <Text>PracticeRoomView</Text>
    </View>
  );
};

export default PracticeRoomView;

const styles = StyleSheet.create({});
