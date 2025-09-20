import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

export default function ChangePasswordScreen() {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const { userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    // Handle password change logic here
    Alert.alert(
      'Success',
      'Password changed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back or reset form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          },
        },
      ]
    );
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    showPassword: boolean,
    setShowPassword: (show: boolean) => void,
    placeholder: string
  ) => (
    <View style={tw`mb-4`}>
      <Text
        style={[
          tw`font-semibold mb-2`,
          {
            fontFamily: 'Poppins-SemiBold',
            color: COLORS.TEXT_WHITE,
            fontSize: isSmallScreen ? 14 : 16,
          },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          tw`flex-row items-center rounded-xl px-4 py-3`,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
        ]}
      >
        <Ionicons name="lock-closed" size={20} color={COLORS.TEXT_GRAY} />
        <TextInput
          style={[
            tw`flex-1 ml-3`,
            {
              fontFamily: 'Poppins-Medium',
              color: COLORS.TEXT_WHITE,
              fontSize: isSmallScreen ? 14 : 16,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.TEXT_GRAY}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={COLORS.TEXT_GRAY}
          />
        </TouchableOpacity>
      </View>
    </View>
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
              Change Password
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
              Update your account password
            </Text>
          </View>
        </Animated.View>

        {/* Form */}
        <Animated.View
          style={[
            tw`mx-4 mt-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Current Password */}
          {renderPasswordInput(
            'Current Password',
            currentPassword,
            setCurrentPassword,
            showCurrentPassword,
            setShowCurrentPassword,
            'Enter your current password'
          )}

          {/* New Password */}
          {renderPasswordInput(
            'New Password',
            newPassword,
            setNewPassword,
            showNewPassword,
            setShowNewPassword,
            'Enter your new password'
          )}

          {/* Confirm New Password */}
          {renderPasswordInput(
            'Confirm New Password',
            confirmPassword,
            setConfirmPassword,
            showConfirmPassword,
            setShowConfirmPassword,
            'Confirm your new password'
          )}

          {/* Password Requirements */}
          <Animated.View
            style={[
              tw`p-4 rounded-xl mb-6`,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text
              style={[
                tw`font-semibold mb-2`,
                {
                  fontFamily: 'Poppins-SemiBold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 14 : 16,
                },
              ]}
            >
              Password Requirements
            </Text>
            <View style={tw`space-y-1`}>
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
                • At least 8 characters long
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
                • Include uppercase and lowercase letters
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
                • Include at least one number
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
                • Include at least one special character
              </Text>
            </View>
          </Animated.View>

          {/* Change Password Button */}
          <TouchableOpacity
            onPress={handleChangePassword}
            style={[
              tw`py-4 px-6 rounded-xl items-center`,
              { backgroundColor: themeColor },
            ]}
          >
            <Text
              style={[
                tw`font-semibold`,
                {
                  fontFamily: 'Poppins-SemiBold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 16 : 18,
                },
              ]}
            >
              Change Password
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 