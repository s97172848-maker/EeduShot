import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import tw from 'twrnc';
import { Logo } from '../../components/Logo';
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

export default function LoginScreen() {
  const router = useRouter();
  const { userRoleColor, userRole, login } = useUser();
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Get the theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;

  // Responsive sizing with optimized spacing
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  const logoSize = isSmallScreen ? 60 : isMediumScreen ? 70 : 80;
  const titleSize = isSmallScreen ? 24 : isMediumScreen ? 28 : 32;
  const subtitleSize = isSmallScreen ? 13 : isMediumScreen ? 14 : 16;
  const inputHeight = isSmallScreen ? 44 : isMediumScreen ? 48 : 52;
  const buttonHeight = isSmallScreen ? 44 : isMediumScreen ? 48 : 52;
  const spacing = isSmallScreen ? 12 : isMediumScreen ? 14 : 16;
  const paddingHorizontal = isSmallScreen ? 16 : isMediumScreen ? 20 : 24;
  const maxWidth = isSmallScreen ? width - 32 : isMediumScreen ? 380 : 420;

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!userRole) {
      Alert.alert('Error', 'Please select your role first');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Login attempt:', { email, password: '***', userRole });
      
      // Call the login function from UserContext
      await login(email, password, userRole);
      
      // Save additional user data
      await AsyncStorage.setItem('userRole', userRole);
      await AsyncStorage.setItem('userEmail', email);
      
      console.log('✅ Login successful, navigating to home...');
      
      // Navigate to home screen on success
      router.push('/(tabs)/home');
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleRegister = () => {
    router.push('/(auth)/signup');
  };

  console.log("Role",userRole)

  return (
    <View style={tw`flex-1`}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={GRADIENTS.BACKGROUND}
        style={tw`absolute inset-0`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Subtle Background Pattern */}
      <View style={tw`absolute inset-0 opacity-5`}>
        <View style={[tw`absolute top-20 left-8 w-16 h-0.5`, { backgroundColor: themeColor }]} />
        <View style={[tw`absolute top-40 right-12 w-12 h-0.5`, { backgroundColor: COLORS.SECONDARY }]} />
        <View style={[tw`absolute bottom-40 left-12 w-20 h-0.5`, { backgroundColor: COLORS.ACCENT }]} />
        <View style={[tw`absolute bottom-20 right-8 w-10 h-0.5`, { backgroundColor: themeColor }]} />
      </View>

      <ScrollView
        contentContainerStyle={[
          tw`flex-grow justify-center`,
          { paddingVertical: spacing * 3 }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[
          tw`items-center justify-center`,
          { 
            paddingHorizontal: paddingHorizontal,
            maxWidth: maxWidth,
            alignSelf: 'center',
            width: '100%'
          }
        ]}>
          
          {/* Logo Section */}
          <View style={[
            tw`items-center justify-center`,
            { marginBottom: spacing * 2.5 }
          ]}>
            <Logo size={logoSize} showGlow={true} glowIntensity="subtle" />
            <Text
              style={[
                tw`font-bold text-center`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: titleSize,
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                  marginTop: spacing * 0.8,
                  marginBottom: spacing * 0.4,
                  lineHeight: titleSize * 1.2
                },
              ]}
            >
              Welcome Back
            </Text>
            <Text
              style={[
                tw`text-center`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY_LIGHT,
                  fontSize: subtitleSize,
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                  lineHeight: subtitleSize * 1.4,
                  maxWidth: maxWidth - 32
                },
              ]}
            >
              Sign in to continue your learning journey
            </Text>
          </View>

          {/* Login Form */}
          <View style={[
            tw`w-full`,
            { gap: spacing * 0.8 }
          ]}>
            
            {/* Email Input */}
            <View style={{ marginBottom: spacing * 0.8 }}>
              <Text
                style={[
                  tw`font-semibold mb-1.5`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: subtitleSize - 1,
                  },
                ]}
              >
                Email Address
              </Text>
              <View
                style={[
                  tw`border rounded-xl flex-row items-center`,
                  {
                    borderColor: emailFocused ? themeColor : COLORS.BORDER_GRAY,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: emailFocused ? 2 : 1,
                    height: inputHeight,
                    paddingHorizontal: spacing,
                    shadowColor: emailFocused ? themeColor : 'transparent',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: emailFocused ? 0.3 : 0,
                    shadowRadius: 8,
                    elevation: emailFocused ? 4 : 0,
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={isSmallScreen ? 16 : 18}
                  color={emailFocused ? themeColor : COLORS.TEXT_GRAY}
                  style={{ marginRight: spacing - 2 }}
                />
                <TextInput
                  style={[
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_WHITE,
                      fontSize: subtitleSize,
                    },
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.TEXT_GRAY}
                  value={email}
                  onChangeText={setEmail}
                  // onFocus={() => setEmailFocused(true)}
                  // onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: spacing * 0.6 }}>
              <Text
                style={[
                  tw`font-semibold mb-1.5`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: subtitleSize - 1,
                  },
                ]}
              >
                Password
              </Text>
              <View
                style={[
                  tw`border rounded-xl flex-row items-center justify-between`,
                  {
                    borderColor: passwordFocused ? themeColor : COLORS.BORDER_GRAY,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: passwordFocused ? 2 : 1,
                    height: inputHeight,
                    paddingHorizontal: spacing,
                    shadowColor: passwordFocused ? themeColor : 'transparent',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: passwordFocused ? 0.3 : 0,
                    shadowRadius: 8,
                    elevation: passwordFocused ? 4 : 0,
                  },
                ]}
              >
                <View style={tw`flex-row items-center flex-1`}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={isSmallScreen ? 16 : 18}
                    color={passwordFocused ? themeColor : COLORS.TEXT_GRAY}
                    style={{ marginRight: spacing - 2 }}
                  />
                  <TextInput
                    style={[
                      {
                        fontFamily: 'Poppins-Medium',
                        color: COLORS.TEXT_WHITE,
                        fontSize: subtitleSize,
                      },
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.TEXT_GRAY}
                    value={password}
                    onChangeText={setPassword}
                    // onFocus={() => setPasswordFocused(true)}
                    // onBlur={() => setPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={isSmallScreen ? 16 : 18}
                    color={themeColor}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={[
                tw`items-end`,
                { marginBottom: spacing * 1.2 }
              ]}
            >
              <Text
                style={[
                  tw`font-medium`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: themeColor,
                    fontSize: subtitleSize - 1,
                  },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={[
                tw`rounded-xl items-center justify-center flex-row`,
                {
                  backgroundColor: isLoading ? COLORS.BORDER_GRAY : themeColor,
                  height: buttonHeight,
                  marginBottom: spacing * 1.2,
                  shadowColor: themeColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                },
              ]}
            >
              {isLoading && (
                <Ionicons
                  name="refresh-outline"
                  size={isSmallScreen ? 16 : 18}
                  color={COLORS.TEXT_WHITE}
                  style={{ marginRight: spacing - 4 }}
                />
              )}
              <Text
                style={[
                  tw`font-bold`,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: subtitleSize + 1,
                  },
                ]}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={[
              tw`flex-row items-center`,
              { marginVertical: spacing * 1.2 }
            ]}>
              <View
                style={[
                  tw`flex-1 h-0.5`,
                  { backgroundColor: COLORS.BORDER_GRAY },
                ]}
              />
              <Text
                style={[
                  tw`mx-3`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY,
                    fontSize: subtitleSize - 1,
                  },
                ]}
              >
                OR
              </Text>
              <View
                style={[
                  tw`flex-1 h-0.5`,
                  { backgroundColor: COLORS.BORDER_GRAY },
                ]}
              />
            </View>

            {/* Register Link */}
            <View style={tw`items-center`}>
              <Text
                style={[
                  tw`text-center`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                    fontSize: subtitleSize,
                    lineHeight: subtitleSize * 1.3,
                  },
                ]}
              >
                Don't have an account?{' '}
                <TouchableOpacity onPress={handleRegister}>
                  <Text
                    style={[
                      tw`font-semibold`,
                      {
                        fontFamily: 'Poppins-SemiBold',
                        color: COLORS.SECONDARY,
                      },
                    ]}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
