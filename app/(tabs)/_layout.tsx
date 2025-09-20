import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, Platform, View } from 'react-native';
import tw from 'twrnc';
import { COLORS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

export default function TabLayout() {
  const { userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.BACKGROUND_DARK,
          borderTopColor: COLORS.BORDER_GRAY_DARK,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          elevation: 20,
          shadowColor: COLORS.BACKGROUND_DARK,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: themeColor,
        tabBarInactiveTintColor: COLORS.TEXT_GRAY,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 10,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <Animated.View
              style={[
                tw`items-center justify-center`,
                {
                  transform: [{ scale: focused ? 1.2 : 1 }],
                },
              ]}
            >
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={focused ? size + 2 : size}
                color={color}
              />
              {focused && (
                <View
                  style={[
                    tw`absolute -bottom-1 w-1 h-1 rounded-full`,
                    { backgroundColor: themeColor },
                  ]}
                />
              )}
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: 'Test',
          tabBarIcon: ({ color, focused, size }) => (
            <Animated.View
              style={[
                tw`items-center justify-center`,
                {
                  transform: [{ scale: focused ? 1.2 : 1 }],
                },
              ]}
            >
              <Ionicons
                name={focused ? 'document-text' : 'document-text-outline'}
                size={focused ? size + 2 : size}
                color={color}
              />
              {focused && (
                <View
                  style={[
                    tw`absolute -bottom-1 w-1 h-1 rounded-full`,
                    { backgroundColor: themeColor },
                  ]}
                />
              )}
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color, focused, size }) => (
            <Animated.View
              style={[
                tw`items-center justify-center`,
                {
                  transform: [{ scale: focused ? 1.2 : 1 }],
                },
              ]}
            >
              <Ionicons
                name={focused ? 'play-circle' : 'play-circle-outline'}
                size={focused ? size + 2 : size}
                color={color}
              />
              {focused && (
                <View
                  style={[
                    tw`absolute -bottom-1 w-1 h-1 rounded-full`,
                    { backgroundColor: themeColor },
                  ]}
                />
              )}
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, focused, size }) => (
            <Animated.View
              style={[
                tw`items-center justify-center`,
                {
                  transform: [{ scale: focused ? 1.2 : 1 }],
                },
              ]}
            >
              <Ionicons
                name={focused ? 'book' : 'book-outline'}
                size={focused ? size + 2 : size}
                color={color}
              />
              {focused && (
                <View
                  style={[
                    tw`absolute -bottom-1 w-1 h-1 rounded-full`,
                    { backgroundColor: themeColor },
                  ]}
                />
              )}
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused, size }) => (
            <Animated.View
              style={[
                tw`items-center justify-center`,
                {
                  transform: [{ scale: focused ? 1.2 : 1 }],
                },
              ]}
            >
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={focused ? size + 2 : size}
                color={color}
              />
              {focused && (
                <View
                  style={[
                    tw`absolute -bottom-1 w-1 h-1 rounded-full`,
                    { backgroundColor: themeColor },
                  ]}
                />
              )}
            </Animated.View>
          ),
        }}
      />
    </Tabs>
  );
} 