import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  type: 'navigate' | 'toggle';
  color: string;
  value?: boolean;
}

interface SettingsSection {
  id: string;
  title: string;
  items: SettingItem[];
}

const settingsSections: SettingsSection[] = [
  {
    id: 'role',
    title: 'Role Settings',
    items: [
      {
        id: 'current_role',
        title: 'Current Role',
        icon: 'school',
        type: 'navigate',
        color: COLORS.PRIMARY,
      },
      {
        id: 'change_role',
        title: 'Change Role',
        icon: 'swap-horizontal',
        type: 'navigate',
        color: COLORS.SECONDARY,
      },
    ],
  },
  {
    id: 'account',
    title: 'Account Settings',
    items: [
      {
        id: 'profile',
        title: 'Edit Profile',
        icon: 'person',
        type: 'navigate',
        color: COLORS.PRIMARY,
      },
      {
        id: 'privacy',
        title: 'Privacy Settings',
        icon: 'shield-checkmark',
        type: 'navigate',
        color: COLORS.SECONDARY,
      },
      {
        id: 'security',
        title: 'Security',
        icon: 'lock-closed',
        type: 'navigate',
        color: COLORS.ACCENT,
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    items: [
      {
        id: 'push_notifications',
        title: 'Push Notifications',
        icon: 'notifications',
        type: 'toggle',
        value: true,
        color: COLORS.PRIMARY,
      },
      {
        id: 'email_notifications',
        title: 'Email Notifications',
        icon: 'mail',
        type: 'toggle',
        value: false,
        color: COLORS.SECONDARY,
      },
      {
        id: 'course_updates',
        title: 'Course Updates',
        icon: 'school',
        type: 'toggle',
        value: true,
        color: COLORS.ACCENT,
      },
    ],
  },
  {
    id: 'app',
    title: 'App Settings',
    items: [
      {
        id: 'dark_mode',
        title: 'Dark Mode',
        icon: 'moon',
        type: 'toggle',
        value: true,
        color: COLORS.PRIMARY,
      },
      {
        id: 'auto_play',
        title: 'Auto-play Videos',
        icon: 'play-circle',
        type: 'toggle',
        value: false,
        color: COLORS.SECONDARY,
      },
      {
        id: 'download_quality',
        title: 'Download Quality',
        icon: 'settings',
        type: 'navigate',
        color: COLORS.ACCENT,
      },
      {
        id: 'language',
        title: 'Language',
        icon: 'language',
        type: 'navigate',
        color: COLORS.PRIMARY,
      },
    ],
  },
  {
    id: 'support',
    title: 'Support & Legal',
    items: [
      {
        id: 'help',
        title: 'Help Center',
        icon: 'help-circle',
        type: 'navigate',
        color: COLORS.PRIMARY,
      },
      {
        id: 'feedback',
        title: 'Send Feedback',
        icon: 'chatbubble',
        type: 'navigate',
        color: COLORS.SECONDARY,
      },
      {
        id: 'terms',
        title: 'Terms of Service',
        icon: 'document-text',
        type: 'navigate',
        color: COLORS.ACCENT,
      },
      {
        id: 'privacy_policy',
        title: 'Privacy Policy',
        icon: 'shield',
        type: 'navigate',
        color: COLORS.PRIMARY,
      },
    ],
  },
];

export default function SettingsScreen() {
  const { userRole, setUserRole, userRoleColor } = useUser();
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [settings, setSettings] = useState(settingsSections);

  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;

  // Responsive sizing
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleToggle = (sectionId: string, itemId: string) => {
    setSettings(prevSettings => 
      prevSettings.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.id === itemId && item.type === 'toggle') {
                return { ...item, value: !item.value };
              }
              return item;
            }),
          };
        }
        return section;
      })
    );
  };

  const handleNavigate = (itemId: string) => {
    if (itemId === 'current_role') {
      Alert.alert('Current Role', `You are currently a ${userRole || 'Student'}`);
    } else if (itemId === 'change_role') {
      handleRoleChange();
    } else {
      Alert.alert('Navigation', `Navigate to ${itemId} page`);
    }
  };

  const handleRoleChange = () => {
    Alert.alert(
      'Change Role',
      'Are you sure you want to change your role? This will affect the features available to you.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Change Role',
          onPress: () => {
            // Navigate to continue screen to change role
            router.push('/(auth)/continue');
          },
        },
      ]
    );
  };

  const renderSettingItem = (sectionId: string, item: any) => (
    <Animated.View
      key={item.id}
      style={[
        tw`mx-4 mb-2 p-4 rounded-xl`,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={tw`flex-row items-center justify-between`}
        onPress={() => item.type === 'navigate' ? handleNavigate(item.id) : null}
        disabled={item.type === 'toggle'}
      >
        <View style={tw`flex-row items-center`}>
          <View
            style={[
              tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
              { backgroundColor: `${item.color}20` },
            ]}
          >
            <Ionicons name={item.icon as any} size={20} color={item.color} />
          </View>
          <View>
            <Text
              style={[
                tw`font-semibold`,
                {
                  fontFamily: 'Poppins-SemiBold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 14 : 16,
                },
              ]}
            >
              {item.title}
            </Text>
            {item.id === 'current_role' && (
              <Text
                style={[
                  tw`text-xs`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                    fontSize: isSmallScreen ? 10 : 12,
                  },
                ]}
              >
                {userRole === 'teacher' ? 'Teacher' : userRole === 'student' ? 'Student' : 'Not selected'}
              </Text>
            )}
          </View>
        </View>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={() => handleToggle(sectionId, item.id)}
            trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: item.color + '40' }}
            thumbColor={item.value ? item.color : COLORS.TEXT_GRAY}
          />
        ) : (
          <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT_GRAY} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSection = (section: any) => (
    <Animated.View
      key={section.id}
      style={[
        tw`mb-6`,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text
        style={[
          tw`font-bold mb-3 px-4`,
          {
            fontFamily: 'Poppins-Bold',
            color: COLORS.TEXT_WHITE,
            fontSize: isSmallScreen ? 16 : 18,
          },
        ]}
      >
        {section.title}
      </Text>
      {section.items.map((item: any) => renderSettingItem(section.id, item))}
    </Animated.View>
  );

  return (
    <View style={tw`flex-1`}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={GRADIENTS.BACKGROUND}
        style={tw`absolute inset-0`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            tw`flex-row items-center p-4`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
              { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            ]}
            onPress={router.back}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.TEXT_WHITE} />
          </TouchableOpacity>
          <View>
            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 20 : 24,
                },
              ]}
            >
              Settings
            </Text>
            <Text
              style={[
                tw`text-sm`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY_LIGHT,
                },
              ]}
            >
              Customize your experience
            </Text>
          </View>
        </Animated.View>

        {/* Settings Sections */}
        <Animated.View
          style={[
            tw`mt-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {settings.map(renderSection)}
        </Animated.View>

        {/* App Version */}
        <Animated.View
          style={[
            tw`mx-4 mt-6 p-4 rounded-xl items-center`,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={[
              tw`font-semibold mb-1`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.TEXT_WHITE,
                fontSize: isSmallScreen ? 14 : 16,
              },
            ]}
          >
            EdusPark
          </Text>
          <Text
            style={[
              tw`text-sm`,
              {
                fontFamily: 'Poppins-Medium',
                color: COLORS.TEXT_GRAY_LIGHT,
                fontSize: isSmallScreen ? 12 : 14,
              },
            ]}
          >
            Version 1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 