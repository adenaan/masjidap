import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, FONT_SIZES } from '../constants/theme';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { AnnouncementsScreen } from '../screens/AnnouncementsScreen';
import { AnnouncementDetailScreen } from '../screens/AnnouncementDetailScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { BroadcastScreen } from '../screens/BroadcastScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.ink,
        },
        headerTintColor: COLORS.sand,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: FONT_SIZES.lg,
        },
      }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Masjid Al Taubah' }}
      />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{ title: 'Announcement' }}
      />
      <Stack.Screen
        name="Broadcast"
        component={BroadcastScreen}
        options={{ title: 'Live Broadcast' }}
      />
    </Stack.Navigator>
  );
}

// Announcements Stack Navigator
function AnnouncementsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.ink,
        },
        headerTintColor: COLORS.sand,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: FONT_SIZES.lg,
        },
      }}>
      <Stack.Screen
        name="AnnouncementsList"
        component={AnnouncementsScreen}
        options={{ title: 'Announcements' }}
      />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{ title: 'Announcement' }}
      />
    </Stack.Navigator>
  );
}

// Tab Icon Component (using emoji for simplicity, can use react-native-vector-icons)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: { [key: string]: string } = {
    Home: '🏠',
    Announcements: '📢',
    Events: '📅',
    Gallery: '🖼️',
    About: 'ℹ️',
  };

  return (
    <span style={{ fontSize: 24, opacity: focused ? 1 : 0.6 }}>
      {icons[name] || '•'}
    </span>
  );
};

export const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <TabIcon name={route.name} focused={focused} />
          ),
          tabBarActiveTintColor: COLORS.gold,
          tabBarInactiveTintColor: COLORS.gray,
          tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopColor: COLORS.lightGray,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: FONT_SIZES.xs,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: COLORS.ink,
          },
          headerTintColor: COLORS.sand,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: FONT_SIZES.lg,
          },
        })}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Announcements"
          component={AnnouncementsStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Events"
          component={EventsScreen}
          options={{ title: 'Events & Programs' }}
        />
        <Tab.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ title: 'Gallery' }}
        />
        <Tab.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'About & Contact' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
