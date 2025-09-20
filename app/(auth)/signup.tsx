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

const SignupStatic: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setMessage('');
    if (!name || !email || !password || !confirmPassword) {
      setMessage('All fields are required.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      console.log('Register API URL:', 'http://192.168.1.7:5000/api/auth/register');
      const res = await fetch('http://192.168.1.7:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem('userRole', role);
        await AsyncStorage.setItem('userEmail', email);
        setStep('verify');
        setMessage('Registration successful. OTP sent to email.');
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.log('Registration error:', err);
      setMessage('Network error.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage('');
    if (!otp) {
      setMessage('Enter OTP.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://192.168.1.7:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem('userVerified', 'true');
        setMessage('OTP verified successfully. You can now login.');
      } else {
        setMessage(data.message || 'OTP verification failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Create Account (Static Demo)</h2>
      {step === 'register' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button onClick={handleRegister} disabled={loading} style={{ width: '100%', padding: 10, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4 }}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </>
      )}
      {step === 'verify' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
          </div>
          <button onClick={handleVerifyOtp} disabled={loading} style={{ width: '100%', padding: 10, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4 }}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}
      {message && <div style={{ marginTop: 16, color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default function SignupScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { userRoleColor, userRole, sendOtp, verifyOtp, registerAfterVerification, resendOtp } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState('');
  const [currentStep, setCurrentStep] = useState<'form' | 'otp' | 'register'>('form');

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
    console.log("🚀 ===== SIGNUP SCREEN: SEND OTP CLICKED =====");
    console.log("📱 SignupScreen: Attempting to send OTP for email verification...");
    console.log("📱 SignupScreen: Email:", email);
    
    if (!email) {
      console.log("❌ SignupScreen: Email is required");
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    if (!isValidEmail(email)) {
      console.log("❌ SignupScreen: Invalid email format");
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    console.log("✅ SignupScreen: Email validation passed, sending OTP...");
    setIsOtpLoading(true);
    
    try {
      console.log('📱 SignupScreen: Calling sendOtp function...');
      await sendOtp(email);
      console.log('✅ SignupScreen: OTP sent successfully');
      setIsOtpSent(true);
      setCurrentStep('otp');
      setCountdown(60); // Start 60 second countdown
      console.log("🎉 ===== SIGNUP SCREEN: SEND OTP SUCCESS =====");
    } catch (error) {
      console.error('💥 SignupScreen: Send OTP error:', error);
      console.error("❌ ===== SIGNUP SCREEN: SEND OTP FAILED =====");
      let errorMessage = 'Failed to send OTP';
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Cannot connect to server. Please check:\n1. Backend server is running\n2. Both devices are on same network\n3. IP address is correct';
        } else if (error.message.includes('Email configuration')) {
          errorMessage = 'Server email configuration is missing. Please contact administrator.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    console.log("🔍 ===== SIGNUP SCREEN: VERIFY OTP CLICKED =====");
    console.log("🔍 SignupScreen: Verifying OTP:", otp);
    console.log("🔍 SignupScreen: Email:", email);
    
    setIsLoading(true);
    
    try {
      console.log('🔍 SignupScreen: Calling verifyOtp function...');
      await verifyOtp(email, otp);
      setIsOtpVerified(true);
      setCurrentStep('register');
      console.log("✅ SignupScreen: OTP verification successful");
      console.log("🎉 ===== SIGNUP SCREEN: VERIFY OTP SUCCESS =====");
      Alert.alert('Email Verified', 'Your email has been verified! Now complete your registration.');
    } catch (error) {
      console.error('💥 SignupScreen: OTP verification error:', error);
      console.error("❌ ===== SIGNUP SCREEN: VERIFY OTP FAILED =====");
      Alert.alert('Error', error instanceof Error ? error.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    console.log("🔄 ===== SIGNUP SCREEN: RESEND OTP CLICKED =====");
    console.log("🔄 SignupScreen: Resending OTP for email:", email);
    
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }
    
    setIsOtpLoading(true);
    try {
      await resendOtp(email);
      setCountdown(60); // Reset countdown
      console.log("✅ SignupScreen: OTP resent successfully");
      console.log("🎉 ===== SIGNUP SCREEN: RESEND OTP SUCCESS =====");
    } catch (error) {
      console.error('💥 SignupScreen: Resend OTP error:', error);
      console.error("❌ ===== SIGNUP SCREEN: RESEND OTP FAILED =====");
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSignup = async () => {
    console.log("🔐 ===== SIGNUP SCREEN: SIGNUP CLICKED =====");
    console.log("🔐 SignupScreen: Attempting to complete signup...");
    console.log("🔐 SignupScreen: Form data:", { 
      name, 
      email, 
      password: password ? '***' : 'empty', 
      confirmPassword: confirmPassword ? '***' : 'empty',
      userRole 
    });
    
    if (!name || !email || !password || !confirmPassword) {
      console.log("❌ SignupScreen: Missing required fields");
      Alert.alert('Error', 'Please fill in all fields first');
      return;
    }

    if (password.length < 6) {
      console.log("❌ SignupScreen: Password too short");
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      console.log("❌ SignupScreen: Passwords don't match");
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!userRole) {
      console.log("❌ SignupScreen: No role selected");
      Alert.alert('Error', 'Please select your role first');
      return;
    }

    if (!isOtpVerified) {
      console.log("❌ SignupScreen: Email not verified");
      Alert.alert('Error', 'Please verify your email first');
      return;
    }

    console.log("✅ SignupScreen: All validations passed, registering user...");
    setIsLoading(true);
    
    try {
      console.log('🔐 SignupScreen: Calling registerAfterVerification function...');
      await registerAfterVerification(name, email, password, userRole);
      console.log('✅ SignupScreen: Registration successful');
      console.log("🎉 ===== SIGNUP SCREEN: REGISTER SUCCESS =====");
      Alert.alert('Success', 'Account created and verified successfully!', [
        {
          text: 'OK',
          onPress: () => router.push('/(auth)/login'),
        },
      ]);
    } catch (error) {
      console.error('💥 SignupScreen: Registration error:', error);
      console.error("❌ ===== SIGNUP SCREEN: REGISTER FAILED =====");
      let errorMessage = 'Registration failed';
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Cannot connect to server. Please check:\n1. Backend server is running\n2. Both devices are on same network\n3. IP address is correct';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
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

  console.log('userRole: userRole', userRole);

  // Show OTP verification screen if OTP is sent
  if (isOtpSent && !isOtpVerified) {
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

              {/* OTP Input */}
              <View style={[
                tw`border rounded-xl`,
                {
                  borderColor: COLORS.BORDER_GRAY,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderWidth: 1,
                  height: inputHeight,
                  paddingHorizontal: spacing,
                  marginBottom: spacing * 1.5,
                },
              ]}>
                <TextInput
                  style={[
                    tw`flex-1 text-center`,
                    {
                      fontFamily: 'Poppins-Bold',
                      color: COLORS.TEXT_WHITE,
                      fontSize: subtitleSize + 2,
                    },
                  ]}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor={COLORS.TEXT_GRAY}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                onPress={() => handleVerifyOtp(otp)}
                disabled={isLoading || otp.length !== 6}
                style={[
                  tw`rounded-xl items-center justify-center flex-row`,
                  {
                    backgroundColor: isLoading || otp.length !== 6 ? COLORS.BORDER_GRAY : themeColor,
                    height: buttonHeight,
                    marginBottom: spacing * 1.2,
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
                  onPress={handleResendOtp}
                  disabled={isOtpLoading || countdown > 0}
                  style={[
                    tw`px-4 py-2 rounded-lg`,
                    {
                      backgroundColor: isOtpLoading || countdown > 0 
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
                        color: isOtpLoading || countdown > 0 ? COLORS.TEXT_GRAY : themeColor,
                        fontSize: subtitleSize - 1,
                      },
                    ]}
                  >
                    {isOtpLoading 
                      ? 'Resending...' 
                      : countdown > 0 
                        ? `Resend in ${countdown}s` 
                        : 'Resend OTP'
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

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
              Create Account
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
              Join EduSpark and start your learning journey
            </Text>
          </View>

          {/* Signup Form */}
          <View style={[
            tw`w-full`,
            { gap: spacing * 0.8 }
          ]}>
            
            {/* Name Input */}
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
                Full Name
              </Text>
              <View
                style={[
                  tw`border rounded-xl flex-row items-center`,
                  {
                    borderColor: nameFocused ? themeColor : COLORS.BORDER_GRAY,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: nameFocused ? 2 : 1,
                    height: inputHeight,
                    paddingHorizontal: spacing,
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={isSmallScreen ? 16 : 18}
                  color={nameFocused ? themeColor : COLORS.TEXT_GRAY}
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
                  placeholder="Enter your full name"
                  placeholderTextColor={COLORS.TEXT_GRAY}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input with Send OTP Button */}
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
                  tw`border rounded-xl flex-row items-center justify-between`,
                  {
                    borderColor: emailFocused ? themeColor : COLORS.BORDER_GRAY,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: emailFocused ? 2 : 1,
                    height: inputHeight,
                    paddingHorizontal: spacing,
                  },
                ]}
              >
                <View style={tw`flex-row items-center flex-1`}>
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
                    placeholder="Enter your email"
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
                <TouchableOpacity
                  onPress={handleSendOtp}
                  disabled={isOtpLoading || countdown > 0 || !email || !isValidEmail(email)}
                  style={[
                    tw`ml-2 px-3 py-1.5 rounded-lg`,
                    {
                      backgroundColor: isOtpLoading || countdown > 0 || !email || !isValidEmail(email) 
                        ? COLORS.BORDER_GRAY 
                        : themeColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      tw`font-semibold text-xs`,
                      {
                        fontFamily: 'Poppins-SemiBold',
                        color: COLORS.TEXT_WHITE,
                      },
                    ]}
                  >
                    {isOtpLoading ? 'Sending...' : countdown > 0 ? `${countdown}s` : 'Send OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


            {/* Password Input */}
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
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.TEXT_GRAY}
                    value={password}
                    onChangeText={setPassword}
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
                Confirm Password
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
                    placeholder="Confirm your password"
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

            {/* Signup Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading || !isOtpVerified}
              style={[
                tw`rounded-xl items-center justify-center flex-row`,
                {
                  backgroundColor: isLoading || !isOtpVerified ? COLORS.BORDER_GRAY : themeColor,
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
                {isLoading ? 'Creating Account...' : !isOtpVerified ? 'Verify Email First' : 'Create Account'}
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

            {/* Login Link */}
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
                Already have an account?{' '}
                <TouchableOpacity onPress={handleLogin}>
                  <Text
                    style={[
                      tw`font-semibold`,
                      {
                        fontFamily: 'Poppins-SemiBold',
                        color: themeColor,
                      },
                    ]}
                  >
                    Sign In
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