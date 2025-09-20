import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';
import { useAppDispatch } from '../../store';
import { logoutSuccess } from '../../store/slices/auth.slice';

const menuItems = [
  {
    id: '1',
    title: 'Change Password',
    icon: 'lock-closed',
    color: COLORS.PRIMARY,
    badge: null,
    route: '/settings/change-password',
  },
  {
    id: '2',
    title: 'Withdraw Money',
    icon: 'card',
    color: COLORS.SECONDARY,
    badge: null,
    route: '/settings/withdraw-money',
  },
  {
    id: '3',
    title: 'History',
    icon: 'time',
    color: COLORS.ACCENT,
    badge: null,
    route: '/settings/history',
  },
  {
    id: '4',
    title: 'Saved Videos',
    icon: 'bookmark',
    color: COLORS.PRIMARY,
    badge: '12',
    route: '/settings/saved-videos',
  },
  {
    id: '5',
    title: 'Settings',
    icon: 'settings',
    color: COLORS.TEXT_GRAY,
    badge: null,
    route: '/settings/settings',
  },
  {
    id: '6',
    title: 'Help & Support',
    icon: 'help-circle',
    color: COLORS.SECONDARY,
    badge: null,
    route: '/settings/help-support',
  },
];

export default function UserScreen() {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { userRoleColor, logout, clearUserData, user, isAuthenticated, isLoading } = useUser();
  const dispatch = useAppDispatch();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;
  
  // Responsive sizing
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const spacing = isSmallScreen ? 12 : isMediumScreen ? 16 : 20;

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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear authentication data from UserContext
              await logout();
              
              // Clear user role data
              await clearUserData();
              
              // Clear Redux auth state
              dispatch(logoutSuccess());
              
              // Navigate to login screen
              router.replace('/(auth)/login');
              
              console.log('User logged out successfully');
            } catch (error) {
              console.error('Logout error:', error);
              // Still navigate to login even if there's an error
              router.replace('/(auth)/login');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle delete account logic here
            console.log('Account deleted');
          },
        },
      ]
    );
  };

  const renderMenuItem = ({ item }: { item: any }) => (
    <Animated.View
      style={[
        tw`mx-4 mb-3 p-4 rounded-xl`,
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
        onPress={() => router.push(item.route)}
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
        </View>
        <View style={tw`flex-row items-center`}>
          {item.badge && (
            <View
              style={[
                tw`px-2 py-1 rounded-full mr-2`,
                { backgroundColor: themeColor },
              ]}
            >
              <Text
                style={[
                  tw`text-xs font-bold`,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: COLORS.TEXT_WHITE,
                  },
                ]}
              >
                {item.badge}
              </Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT_GRAY} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
console.log(user)
  return (
    <SafeAreaView style={tw`flex-1`}>
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
            tw`flex-row items-center justify-between p-4`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View>
            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 24 : 28,
                },
              ]}
            >
              Profile
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
              Manage your account
            </Text>
          </View>
          <TouchableOpacity
            style={[
              tw`w-10 h-10 rounded-full items-center justify-center`,
              { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            ]}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.TEXT_WHITE} />
          </TouchableOpacity>
        </Animated.View>

        {/* User Profile Card */}
        <Animated.View
          style={[
            tw`mx-4 mb-6 p-6 rounded-xl`,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[themeColor + '20', 'rgba(255, 255, 255, 0.05)']}
            style={tw`p-4 rounded-lg`}
          >
            <View style={tw`flex-row items-center mb-4`}>
              <View
                style={[
                  tw`w-20 h-20 rounded-full items-center justify-center mr-4`,
                  { backgroundColor: themeColor + '30' },
                ]}
              >
                <Text style={tw`text-5xl`}>👨‍💻</Text>
              </View>
              <View style={tw`flex-1`}>
                <Text
                  style={[
                    tw`font-bold mb-1`,
                    {
                      fontFamily: 'Poppins-Bold',
                      color: COLORS.TEXT_WHITE,
                      fontSize: isSmallScreen ? 18 : 20,
                      textTransform: 'uppercase',
                    },
                  ]}
                >
                  {user?.name || 'Loading...'}
                </Text>
                <Text
                  style={[
                    tw`text-sm mb-2`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_GRAY_LIGHT,
                    },
                  ]}
                >
                  {user?.email || 'Loading...'}
                </Text>
                <View
                  style={[
                    tw`px-3 py-1 rounded-full self-start`,
                    { backgroundColor: themeColor + '30' },
                  ]}
                >
                  <Text
                    style={[
                      tw`text-xs font-semibold`,
                      {
                        fontFamily: 'Poppins-SemiBold',
                        color: themeColor,
                      },
                    ]}
                  >
                    {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : 'Member'}
                  </Text>
                </View>
                {user?.isVerified !== undefined && (
                  <View
                    style={[
                      tw`px-3 py-1 rounded-full self-start mt-2`,
                      { backgroundColor: user.isVerified ? COLORS.SECONDARY + '30' : COLORS.ACCENT + '30' },
                    ]}
                  >
                    <Text
                      style={[
                        tw`text-xs font-semibold`,
                        {
                          fontFamily: 'Poppins-SemiBold',
                          color: user.isVerified ? COLORS.SECONDARY : COLORS.ACCENT,
                        },
                      ]}
                    >
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </Text>
                  </View>
                )}
              </View>
             <TouchableOpacity
                style={[
                  tw`w-8 h-8 rounded-full items-center justify-center`,
                  { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                ]}
              >
                <Ionicons name="pencil" size={16} color={COLORS.TEXT_WHITE} />
              </TouchableOpacity> 
            </View>

           
          </LinearGradient>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View
          style={[
            tw`px-4`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={[
              tw`font-bold mb-4`,
              {
                fontFamily: 'Poppins-Bold',
                color: COLORS.TEXT_WHITE,
                fontSize: isSmallScreen ? 18 : 20,
              },
            ]}
          >
            Account Settings
          </Text>

          {menuItems.map((item) => renderMenuItem({ item }))}
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            tw`mx-4 mt-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={[
              tw`py-4 px-6 rounded-xl items-center mb-3`,
              { backgroundColor: 'rgba(255, 59, 48, 0.2)' },
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text
              style={[
                tw`font-semibold mt-2`,
                {
                  fontFamily: 'Poppins-SemiBold',
                  color: '#FF3B30',
                  fontSize: isSmallScreen ? 14 : 16,
                },
              ]}
            >
              Logout
            </Text>
          </TouchableOpacity>

          {/* Delete Account Button */}
          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={[
              tw`py-4 px-6 rounded-xl items-center`,
              { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.TEXT_GRAY} />
            <Text
              style={[
                tw`font-semibold mt-2`,
                {
                  fontFamily: 'Poppins-SemiBold',
                  color: COLORS.TEXT_GRAY,
                  fontSize: isSmallScreen ? 14 : 16,
                },
              ]}
            >
              Delete Account
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
} 