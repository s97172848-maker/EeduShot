 import { Ionicons } from '@expo/vector-icons';
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { userRoleColor, forgotPassword, resetPassword, verifyOtp } = useUser();
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsOtpLoading(true);
    
    try {
      await forgotPassword(email);
      setIsOtpSent(true);
      setCountdown(60); // Start 60 second countdown
      Alert.alert('OTP Sent', 'A 6-digit OTP has been sent to your email address.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      setIsOtpVerified(true);
      Alert.alert('OTP Verified', 'Your OTP has been verified successfully. You can now reset your password.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }
    
    setIsOtpLoading(true);
    try {
      await forgotPassword(email);
      setCountdown(60); // Reset countdown
      Alert.alert('OTP Resent', 'A new 6-digit OTP has been sent to your email address.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsPasswordLoading(true);
    
    try {
      await resetPassword(email, otp, newPassword);
      Alert.alert('Success', 'Password reset successfully!', [
        {
          text: 'OK',
          onPress: () => router.push('/(auth)/login'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Password reset failed');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  // Countdown timer effect
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

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
              Forgot Password
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
              Enter your email and verify OTP to reset your password
            </Text>
          </View>

          {/* Forgot Password Form */}
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
                    tw`flex-1`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_WHITE,
                      fontSize: subtitleSize,
                    },
                  ]}
                  placeholder="Enter your email address"
                  placeholderTextColor={COLORS.TEXT_GRAY}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              onPress={handleSendOtp}
              disabled={isOtpLoading || countdown > 0}
              style={[
                tw`rounded-xl items-center justify-center flex-row`,
                {
                  backgroundColor: isOtpLoading || countdown > 0 ? COLORS.BORDER_GRAY : themeColor,
                  height: buttonHeight,
                  marginBottom: spacing * 0.8,
                },
              ]}
            >
              {isOtpLoading && (
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
                {isOtpLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Send OTP'}
              </Text>
            </TouchableOpacity>

            {/* OTP Input (shown after OTP is sent) */}
            {isOtpSent && (
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
                  Enter OTP
                </Text>
                <View
                  style={[
                    tw`border rounded-xl flex-row items-center`,
                    {
                      borderColor: otpFocused ? themeColor : COLORS.BORDER_GRAY,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderWidth: otpFocused ? 2 : 1,
                      height: inputHeight,
                      paddingHorizontal: spacing,
                    },
                  ]}
                >
                  <Ionicons
                    name="key-outline"
                    size={isSmallScreen ? 16 : 18}
                    color={otpFocused ? themeColor : COLORS.TEXT_GRAY}
                    style={{ marginRight: spacing - 2 }}
                  />
                  <TextInput
                    style={[
                      tw`flex-1`,
                      {
                        fontFamily: 'Poppins-Medium',
                        color: COLORS.TEXT_WHITE,
                        fontSize: subtitleSize,
                        letterSpacing: 2,
                      },
                    ]}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor={COLORS.TEXT_GRAY}
                    value={otp}
                    onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
                    onFocus={() => setOtpFocused(true)}
                    onBlur={() => setOtpFocused(false)}
                    keyboardType="numeric"
                    maxLength={6}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            )}

            {/* Verify OTP Button (shown after OTP is sent) */}
            {isOtpSent && (
              <TouchableOpacity
                onPress={handleVerifyOtp}
                disabled={isLoading || !otp || otp.length !== 6}
                style={[
                  tw`rounded-xl items-center justify-center flex-row`,
                  {
                    backgroundColor: isLoading || !otp || otp.length !== 6 ? COLORS.BORDER_GRAY : COLORS.SECONDARY,
                    height: buttonHeight,
                    marginBottom: spacing * 1.2,
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
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Resend OTP Button */}
            {isOtpSent && countdown === 0 && (
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={isOtpLoading}
                style={[
                  tw`rounded-xl items-center justify-center flex-row`,
                  {
                    backgroundColor: isOtpLoading ? COLORS.BORDER_GRAY : COLORS.ACCENT,
                    height: buttonHeight,
                    marginBottom: spacing * 1.2,
                  },
                ]}
              >
                {isOtpLoading && (
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
                  {isOtpLoading ? 'Resending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Password Reset Form (shown after OTP verification) */}
            {isOtpVerified && (
              <>
                {/* New Password Input */}
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
                    New Password
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
                          tw`flex-1`,
                          {
                            fontFamily: 'Poppins-Medium',
                            color: COLORS.TEXT_WHITE,
                            fontSize: subtitleSize,
                          },
                        ]}
                        placeholder="Enter new password"
                        placeholderTextColor={COLORS.TEXT_GRAY}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
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

                {/* Confirm Password Input */}
                <View style={{ marginBottom: spacing * 1.2 }}>
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
                    Confirm New Password
                  </Text>
                  <View
                    style={[
                      tw`border rounded-xl flex-row items-center justify-between`,
                      {
                        borderColor: confirmPasswordFocused ? themeColor : COLORS.BORDER_GRAY,
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderWidth: confirmPasswordFocused ? 2 : 1,
                        height: inputHeight,
                        paddingHorizontal: spacing,
                      },
                    ]}
                  >
                    <View style={tw`flex-row items-center flex-1`}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={isSmallScreen ? 16 : 18}
                        color={confirmPasswordFocused ? themeColor : COLORS.TEXT_GRAY}
                        style={{ marginRight: spacing - 2 }}
                      />
                      <TextInput
                        style={[
                          tw`flex-1`,
                          {
                            fontFamily: 'Poppins-Medium',
                            color: COLORS.TEXT_WHITE,
                            fontSize: subtitleSize,
                          },
                        ]}
                        placeholder="Confirm new password"
                        placeholderTextColor={COLORS.TEXT_GRAY}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => setConfirmPasswordFocused(true)}
                        onBlur={() => setConfirmPasswordFocused(false)}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ padding: 4 }}
                    >
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={isSmallScreen ? 16 : 18}
                        color={themeColor}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Reset Password Button */}
                <TouchableOpacity
                  onPress={handleResetPassword}
                  disabled={isPasswordLoading || !newPassword || !confirmPassword}
                  style={[
                    tw`rounded-xl items-center justify-center flex-row`,
                    {
                      backgroundColor: isPasswordLoading || !newPassword || !confirmPassword ? COLORS.BORDER_GRAY : themeColor,
                      height: buttonHeight,
                      marginBottom: spacing * 1.2,
                    },
                  ]}
                >
                  {isPasswordLoading && (
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
                    {isPasswordLoading ? 'Resetting...' : 'Reset Password'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

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

            {/* Back to Login Link */}
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
                Remember your password?{' '}
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text
                    style={[
                      tw`font-semibold`,
                      {
                        fontFamily: 'Poppins-SemiBold',
                        color: themeColor,
                      },
                    ]}
                  >
                    Back to Login
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>

            {/* Help Section */}
            <View style={[
              tw`mt-6 p-4 rounded-xl`,
              { 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: COLORS.BORDER_GRAY,
                borderWidth: 1
              }
            ]}>
              <View style={tw`flex-row items-start`}>
                <Ionicons
                  name="information-circle-outline"
                  size={isSmallScreen ? 16 : 18}
                  color={themeColor}
                  style={{ marginRight: spacing - 2, marginTop: 2 }}
                />
                <View style={tw`flex-1`}>
                  <Text
                    style={[
                      tw`font-semibold mb-1`,
                      {
                        fontFamily: 'Poppins-SemiBold',
                        color: COLORS.TEXT_WHITE,
                        fontSize: subtitleSize - 1,
                      },
                    ]}
                  >
                    Need Help?
                  </Text>
                  <Text
                    style={[
                      tw`text-center`,
                      {
                        fontFamily: 'Poppins-Medium',
                        color: COLORS.TEXT_GRAY_LIGHT,
                        fontSize: subtitleSize - 2,
                        lineHeight: (subtitleSize - 2) * 1.3,
                      },
                    ]}
                  >
                    If you're still having trouble, contact our support team at support@eduspark.com
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
} 