/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginView from './views/LoginView';
import LearnTabView from './views/bottomtabs/LearnTabView';
import SongsTabView from './views/bottomtabs/SongsTabView';
import CommunityTabView from './views/bottomtabs/CommunityTabView';
import ProfileTabView from './views/bottomtabs/ProfileTabView';
import AppColor from './services/styles/AppColor';
import AddSong from './components/songs_components/AddSong';
import ChatTabView from './views/bottomtabs/ChatTabView';
import ExerciseView from './views/learningtab/ExerciseView';
import PianoPracticeView from './views/learningtab/PianoPracticeView';
import CreatePracticeRoom from './views/communitytab/CreatePracticeRoom';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName: string) => {
  let iconName = '';
  if (routeName === 'Learn') {
    iconName = 'book-open-variant';
  } else if (routeName === 'Songs') {
    iconName = 'music-note';
  } else if (routeName === 'Songs') {
    iconName = 'music-note';
  } else if (routeName === 'Chat') {
    iconName = 'chat-processing';
  } else if (routeName === 'Community') {
    iconName = 'account-group';
  } else if (routeName === 'Profile') {
    iconName = 'account-circle';
  }
  return iconName;
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Icon name={getTabBarIcon(route.name)} size={size} color={color} />
        ),
        tabBarActiveTintColor: AppColor.background,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Learn" component={LearnTabView} />
      <Tab.Screen name="Songs" component={SongsTabView} />
      <Tab.Screen name="Chat" component={ChatTabView} />
      <Tab.Screen name="Community" component={CommunityTabView} />
      <Tab.Screen name="Profile" component={ProfileTabView} />
    </Tab.Navigator>
  );
}

export default function App() {
  // Replace with real auth logic
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {() => <LoginView onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="AddSong"
              component={AddSong}
              options={{ title: 'Add Song' }}
            />
            <Stack.Screen
              name="Exercise"
              component={ExerciseView}
              options={{ title: 'Exercise' }}
            />
            <Stack.Screen
              name="PianoPractice"
              component={PianoPracticeView}
              options={{ title: 'Piano Practice' }}
            />
            <Stack.Screen
              name="CreatePracticeRoom"
              component={CreatePracticeRoom}
              options={{ title: 'Create Practice Room' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
