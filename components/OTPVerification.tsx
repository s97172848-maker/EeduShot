import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../constants/Colors';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
  isResending?: boolean;
  countdown?: number;
  themeColor?: string;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  isLoading = false,
  isResending = false,
  countdown = 0,
  themeColor = COLORS.PRIMARY,
}) => {
  const { width } = useWindowDimensions();
  const [otp, setOtp] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);

  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  const titleSize = isSmallScreen ? 24 : isMediumScreen ? 28 : 32;
  const subtitleSize = isSmallScreen ? 13 : isMediumScreen ? 14 : 16;
  const inputSize = isSmallScreen ? 40 : isMediumScreen ? 45 : 50;
  const spacing = isSmallScreen ? 12 : isMediumScreen ? 14 : 16;
  const paddingHorizontal = isSmallScreen ? 16 : isMediumScreen ? 20 : 24;
  const maxWidth = isSmallScreen ? width - 32 : isMediumScreen ? 380 : 420;

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6);
      setOtp(pastedOtp);
      pastedOtp.split('').forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].setNativeProps({ text: digit });
        }
      });
      if (pastedOtp.length === 6) {
        inputRefs.current[5]?.blur();
      } else {
        inputRefs.current[pastedOtp.length]?.focus();
      }
      return;
    }

    const newOtp = otp.split('');
    newOtp[index] = value;
    const updatedOtp = newOtp.join('');
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (value && index === 5) {
      inputRefs.current[index]?.blur();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await onVerify(otp);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleResend = async () => {
    if (countdown > 0) {
      Alert.alert('Wait', `Please wait ${countdown} seconds before resending OTP`);
      return;
    }

    try {
      await onResend();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <View style={tw`flex-1`}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
            
            {/* Header Section */}
            <View style={[
              tw`items-center justify-center`,
              { marginBottom: spacing * 2.5 }
            ]}>
              <View style={[
                tw`items-center justify-center rounded-full`,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  width: 80,
                  height: 80,
                  marginBottom: spacing * 1.5,
                }
              ]}>
                <Ionicons
                  name="mail-outline"
                  size={40}
                  color={themeColor}
                />
              </View>
              
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
                    marginBottom: spacing * 0.5,
                    lineHeight: titleSize * 1.2
                  },
                ]}
              >
                Verify Your Email
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
                We've sent a 6-digit verification code to{'\n'}
                <Text style={{ color: themeColor, fontFamily: 'Poppins-SemiBold' }}>
                  {email}
                </Text>
              </Text>
            </View>

            {/* OTP Input Section */}
            <View style={[
              tw`w-full`,
              { gap: spacing * 1.5, marginBottom: spacing * 2 }
            ]}>
              
              <Text
                style={[
                  tw`font-semibold text-center`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: subtitleSize - 1,
                    marginBottom: spacing * 0.5,
                  },
                ]}
              >
                Enter Verification Code
              </Text>

              {/* OTP Input Boxes */}
              <View style={[
                tw`flex-row justify-center`,
                { gap: spacing * 0.5 }
              ]}>
                {Array.from({ length: 6 }, (_, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) inputRefs.current[index] = ref;
                    }}
                    style={[
                      tw`border rounded-xl text-center font-bold`,
                      {
                        borderColor: focusedIndex === index ? themeColor : COLORS.BORDER_GRAY,
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderWidth: focusedIndex === index ? 2 : 1,
                        width: inputSize,
                        height: inputSize,
                        fontFamily: 'Poppins-Bold',
                        color: COLORS.TEXT_WHITE,
                        fontSize: subtitleSize + 2,
                      },
                    ]}
                    value={otp[index] || ''}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(-1)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                ))}
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                onPress={handleVerify}
                disabled={isLoading || otp.length !== 6}
                style={[
                  tw`rounded-xl items-center justify-center flex-row`,
                  {
                    backgroundColor: isLoading || otp.length !== 6 ? COLORS.BORDER_GRAY : themeColor,
                    height: 52,
                    marginTop: spacing * 1.5,
                  },
                ]}
              >
                {isLoading && (
                  <Ionicons
                    name="refresh-outline"
                    size={18}
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
            </View>

            {/* Resend Section */}
            <View style={tw`items-center`}>
              <Text
                style={[
                  tw`text-center`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                    fontSize: subtitleSize - 1,
                    lineHeight: subtitleSize * 1.3,
                    marginBottom: spacing * 0.5,
                  },
                ]}
              >
                Didn't receive the code?
              </Text>
              
              <TouchableOpacity
                onPress={handleResend}
                disabled={isResending || countdown > 0}
                style={[
                  tw`px-4 py-2 rounded-lg`,
                  {
                    backgroundColor: isResending || countdown > 0 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.2)',
                  },
                ]}
              >
                <Text
                  style={[
                    tw`font-semibold`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: isResending || countdown > 0 ? COLORS.TEXT_GRAY : themeColor,
                      fontSize: subtitleSize - 1,
                    },
                  ]}
                >
                  {isResending 
                    ? 'Resending...' 
                    : countdown > 0 
                      ? `Resend in ${countdown}s` 
                      : 'Resend OTP'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
