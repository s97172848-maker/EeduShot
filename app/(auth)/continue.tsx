import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
import tw from 'twrnc';
import { Logo } from '../../components/Logo';
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

export default function ContinueScreen() {
  const router = useRouter();
  const { setUserRole } = useUser();
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Advanced responsive sizing calculations hii mere
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Base spacing unit (calculated based on screen size)
  const baseSpacing = isSmallScreen ? 8 : isMediumScreen ? 12 : 16;
  
  // Calculated spacing values
  const spacing = {
    xs: baseSpacing * 0.5,    // 4, 6, 8
    sm: baseSpacing * 0.75,   // 6, 9, 12
    md: baseSpacing,          // 8, 12, 16
    lg: baseSpacing * 1.5,    // 12, 18, 24
    xl: baseSpacing * 2,      // 16, 24, 32
    xxl: baseSpacing * 3,     // 24, 36, 48
  };

  // Responsive dimensions
  const dimensions = {
    logoSize: isSmallScreen ? 60 : isMediumScreen ? 70 : 80,
    titleSize: isSmallScreen ? 24 : isMediumScreen ? 28 : 32,
    subtitleSize: isSmallScreen ? 13 : isMediumScreen ? 14 : 16,
    bodySize: isSmallScreen ? 11 : isMediumScreen ? 12 : 14,
    cardHeight: isSmallScreen ? 140 : isMediumScreen ? 160 : 180,
    cardWidth: isSmallScreen ? width - 32 : isMediumScreen ? width - 48 : 400,
    buttonHeight: isSmallScreen ? 44 : isMediumScreen ? 48 : 52,
    iconSize: isSmallScreen ? 24 : isMediumScreen ? 28 : 32,
    headerHeight: isSmallScreen ? 60 : isMediumScreen ? 70 : 80,
  };

  // Horizontal padding for consistent margins
  const horizontalPadding = isSmallScreen ? 16 : isMediumScreen ? 20 : 24;

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

  const handleRoleSelection = (role: 'teacher' | 'student') => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role first');
      return;
    }

    setIsLoading(true);

    try {
      // Get the selected role's color
      const selectedRoleData = roleOptions.find(role => role.id === selectedRole);
      const roleColor = selectedRoleData?.color || COLORS.PRIMARY;
      
      // Save role and color using UserContext
      setUserRole(selectedRole, roleColor);
      
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
        
        // Navigate to login page
        router.push('/(auth)/login');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save your selection. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const roleOptions = [
    {
      id: 'teacher',
      title: 'Teacher',
      subtitle: 'Create & Share Content',
      icon: 'school-outline',
      color: COLORS.PRIMARY,
      description: 'Upload videos, create courses, and help students learn effectively',
      features: ['Upload Videos', 'Create Courses', 'Track Progress', 'Earn Revenue'],
    },
    {
      id: 'student',
      title: 'Student',
      subtitle: 'Learn & Grow',
      icon: 'library-outline',
      color: COLORS.SECONDARY,
      description: 'Watch videos, take courses, and enhance your knowledge',
      features: ['Watch Videos', 'Take Courses', 'Track Learning', 'Get Certificates'],
    },
  ];

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

      {/* Subtle Background Pattern */}
      <View style={tw`absolute inset-0 opacity-5`}>
        <View style={[tw`absolute top-20 left-8 w-16 h-0.5`, { backgroundColor: COLORS.PRIMARY }]} />
        <View style={[tw`absolute top-40 right-12 w-12 h-0.5`, { backgroundColor: COLORS.SECONDARY }]} />
        <View style={[tw`absolute bottom-40 left-12 w-20 h-0.5`, { backgroundColor: COLORS.ACCENT }]} />
        <View style={[tw`absolute bottom-20 right-8 w-10 h-0.5`, { backgroundColor: COLORS.PRIMARY }]} />
      </View>

      <ScrollView
        contentContainerStyle={[
          tw`flex-grow justify-center`,
          { paddingVertical: spacing.xxl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          tw`items-center justify-center`,
          { 
            paddingHorizontal: horizontalPadding,
            width: '100%'
          }
        ]}>
          
          {/* Header */}
          <Animated.View
            style={[
              tw`flex-row items-center justify-between w-full`,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                marginBottom: spacing.xl,
                height: dimensions.headerHeight,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleBack}
              style={[
                tw`rounded-full items-center justify-center`,
                {
                  width: dimensions.buttonHeight - 16,
                  height: dimensions.buttonHeight - 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              ]}
            >
              <Ionicons name="arrow-back" size={dimensions.bodySize + 2} color={COLORS.TEXT_WHITE} />
            </TouchableOpacity>

            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: dimensions.subtitleSize + 2,
                },
              ]}
            >
              Choose Your Role
            </Text>

            <View style={{ width: dimensions.buttonHeight - 16 }} />
          </Animated.View>

          {/* Logo Section */}
          <Animated.View
            style={[
              tw`items-center justify-center`,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                marginBottom: spacing.xxl,
              },
            ]}
          >
            <Logo size={dimensions.logoSize} showGlow={true} glowIntensity="subtle" />
            <Text
              style={[
                tw`font-bold text-center`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: dimensions.titleSize,
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                  marginTop: spacing.lg,
                  marginBottom: spacing.sm,
                  lineHeight: dimensions.titleSize * 1.2
                },
              ]}
            >
              Welcome to EduSpark
            </Text>
            <Text
              style={[
                tw`text-center`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY_LIGHT,
                  fontSize: dimensions.bodySize,
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                  lineHeight: dimensions.bodySize * 1.4,
                  maxWidth: dimensions.cardWidth - 32
                },
              ]}
            >
              Select your role to continue with your learning journey
            </Text>
          </Animated.View>

          {/* Role Selection Cards */}
          <Animated.View
            style={[
              tw`w-full`,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                marginBottom: spacing.xxl,
              },
            ]}
          >
            {roleOptions.map((role, index) => (
              <Animated.View
                key={role.id}
                style={[
                  {
                    marginBottom: spacing.lg,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                                  <TouchableOpacity
                    onPress={() => handleRoleSelection(role.id as 'teacher' | 'student')}
                    activeOpacity={0.9}
                    style={[
                      tw`rounded-2xl overflow-hidden`,
                      {
                        backgroundColor: selectedRole === role.id 
                          ? `${role.color}15` 
                          : 'rgba(255, 255, 255, 0.08)',
                        borderWidth: selectedRole === role.id ? 2 : 1,
                        borderColor: selectedRole === role.id 
                          ? role.color 
                          : 'rgba(255, 255, 255, 0.15)',
                        transform: [{ scale: selectedRole === role.id ? 1.02 : 1 }],
                      },
                    ]}
                  >
                  <LinearGradient
                    colors={selectedRole === role.id 
                      ? [`${role.color}20`, 'rgba(255, 255, 255, 0.05)']
                      : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                    }
                    style={{ padding: spacing.lg }}
                  >
                    <View style={tw`flex-row items-start`}>
                      {/* Icon */}
                      <View
                        style={[
                          tw`rounded-2xl items-center justify-center`,
                          {
                            width: dimensions.cardHeight * 0.3,
                            height: dimensions.cardHeight * 0.3,
                            backgroundColor: selectedRole === role.id 
                              ? role.color + '25' 
                              : 'rgba(255, 255, 255, 0.1)',
                            marginRight: spacing.md,
                            borderWidth: 1,
                            borderColor: selectedRole === role.id 
                              ? role.color + '40' 
                              : 'rgba(255, 255, 255, 0.1)',
                          },
                        ]}
                      >
                        <Ionicons
                          name={role.icon as any}
                          size={dimensions.iconSize}
                          color={selectedRole === role.id ? role.color : COLORS.TEXT_GRAY}
                        />
                      </View>

                      {/* Content */}
                      <View style={tw`flex-1`}>
                        <View style={tw`flex-row items-center justify-between mb-2`}>
                          <Text
                            style={[
                              tw`font-bold`,
                              {
                                fontFamily: 'Poppins-Bold',
                                color: COLORS.TEXT_WHITE,
                                fontSize: dimensions.subtitleSize + 2,
                              },
                            ]}
                          >
                            {role.title}
                          </Text>
                          
                          {/* Selection Indicator */}
                          {selectedRole === role.id && (
                            <View
                              style={[
                                tw`rounded-full items-center justify-center`,
                                {
                                  width: 28,
                                  height: 28,
                                  backgroundColor: role.color,
                                  borderWidth: 2,
                                  borderColor: COLORS.TEXT_WHITE,
                                },
                              ]}
                            >
                              <Ionicons name="checkmark" size={16} color={COLORS.TEXT_WHITE} />
                            </View>
                          )}
                        </View>
                        
                        <Text
                          style={[
                            tw`font-semibold`,
                            {
                              fontFamily: 'Poppins-SemiBold',
                              color: selectedRole === role.id ? role.color : COLORS.TEXT_GRAY_LIGHT,
                              fontSize: dimensions.bodySize,
                              marginBottom: spacing.sm,
                            },
                          ]}
                        >
                          {role.subtitle}
                        </Text>
                        
                        <Text
                          style={[
                            tw`text-xs`,
                            {
                              fontFamily: 'Poppins-Medium',
                              color: COLORS.TEXT_GRAY,
                              lineHeight: dimensions.bodySize * 1.3,
                              marginBottom: spacing.md,
                            },
                          ]}
                        >
                          {role.description}
                        </Text>

                        {/* Features List */}
                        <View style={tw`flex-row flex-wrap`}>
                          {role.features.map((feature, featureIndex) => (
                            <View
                              key={featureIndex}
                              style={[
                                tw`rounded-full px-2 py-1 mr-2 mb-1`,
                                {
                                  backgroundColor: selectedRole === role.id 
                                    ? role.color + '20' 
                                    : 'rgba(255, 255, 255, 0.05)',
                                  borderWidth: 1,
                                  borderColor: selectedRole === role.id 
                                    ? role.color + '30' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  tw`text-xs font-medium`,
                                  {
                                    fontFamily: 'Poppins-Medium',
                                    color: selectedRole === role.id ? role.color : COLORS.TEXT_GRAY,
                                  },
                                ]}
                              >
                                {feature}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>

          {/* Continue Button */}
          <Animated.View
            style={[
              tw`w-full`,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                marginBottom: spacing.xl,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleContinue}
              disabled={isLoading || !selectedRole}
              style={[
                tw`rounded-2xl items-center justify-center flex-row`,
                {
                  backgroundColor: isLoading || !selectedRole ? COLORS.BORDER_GRAY : (() => {
                    const selectedRoleData = roleOptions.find(role => role.id === selectedRole);
                    return selectedRoleData?.color || COLORS.PRIMARY;
                  })(),
                  height: dimensions.buttonHeight,
                  borderWidth: 1,
                  borderColor: isLoading || !selectedRole ? 'rgba(255, 255, 255, 0.1)' : (() => {
                    const selectedRoleData = roleOptions.find(role => role.id === selectedRole);
                    return (selectedRoleData?.color || COLORS.PRIMARY) + '40';
                  })(),
                },
              ]}
            >
              {isLoading && (
                <Ionicons
                  name="refresh-outline"
                  size={dimensions.bodySize + 2}
                  color={COLORS.TEXT_WHITE}
                  style={{ marginRight: spacing.sm }}
                />
              )}
              <Text
                style={[
                  tw`font-bold`,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: dimensions.bodySize + 2,
                  },
                ]}
              >
                {isLoading ? 'Setting up...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Info Section */}
          <Animated.View
            style={[
              tw`rounded-2xl p-4`,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: COLORS.BORDER_GRAY,
                borderWidth: 1,
                maxWidth: dimensions.cardWidth,
              },
            ]}
          >
            <View style={tw`flex-row items-start`}>
              <Ionicons
                name="information-circle-outline"
                size={dimensions.bodySize + 2}
                color={COLORS.ACCENT}
                style={{ marginRight: spacing.sm, marginTop: 2 }}
              />
              <View style={tw`flex-1`}>
                <Text
                  style={[
                    tw`font-semibold mb-1`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: COLORS.TEXT_WHITE,
                      fontSize: dimensions.bodySize,
                    },
                  ]}
                >
                  Role Selection
                </Text>
                <Text
                  style={[
                    tw`text-xs`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_GRAY_LIGHT,
                      lineHeight: dimensions.bodySize * 1.3,
                    },
                  ]}
                >
                  Your role will determine the features and content available to you. You can change this later in settings.
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
} 