import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, StatusBar, Text, useWindowDimensions, View } from "react-native";
import tw from "twrnc";
import { Logo } from "../components/Logo";
import { COLORS, GRADIENTS } from "../constants/Colors";
import { useUser } from "../contexts/UserContext";

export default function Index() {
  const router = useRouter();
  const { isRoleSelected, isAuthenticated, isLoading } = useUser();
  const { width, height } = useWindowDimensions();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const fadeAnim = new Animated.Value(1); // Start visible
  const scaleAnim = new Animated.Value(1); // Start at normal scale
  const slideAnim = new Animated.Value(0); // Start at normal position

  // Responsive sizing
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  const logoSize = isSmallScreen ? 120 : isMediumScreen ? 140 : 160;
  const titleSize = isSmallScreen ? 36 : isMediumScreen ? 48 : 60;
  const subtitleSize = isSmallScreen ? 18 : isMediumScreen ? 20 : 24;
  const bodySize = isSmallScreen ? 14 : isMediumScreen ? 16 : 18;
  const spacing = isSmallScreen ? 4 : isMediumScreen ? 6 : 8;

  useEffect(() => {
    loadFonts();
  }, []);

  useEffect(() => {
    // Start animations immediately
    setTimeout(() => {
      setFadeIn(true);
      // Animate elements with entrance effect
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
  }, []);

  // Countdown timer and navigation
  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Decrement every second

    return () => clearInterval(countdownTimer); // Cleanup
  }, [isLoading]);

  // Handle navigation when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && !isLoading) {
      // Navigate based on authentication and role selection
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else if (isRoleSelected) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/(auth)/continue');
      }
    }
  }, [countdown, isAuthenticated, isRoleSelected, isLoading, router]);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.log('Font loading error:', error);
      setFontsLoaded(true);
    }
  };

  return (
    <View style={tw`flex-1`}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
      
      {/* Countdown Timer */}
      <Animated.View 
        style={[
          tw`absolute top-12 right-6 items-center justify-center`,
          { 
            opacity: fadeAnim,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6
          }
        ]}
      >
        <Text
          style={[
            tw`font-bold`,
            {
              fontFamily: 'Poppins-Bold',
              color: COLORS.TEXT_WHITE,
              fontSize: 16,
            }
          ]}
        >
          {countdown}s
        </Text>
      </Animated.View>
      
      {/* Primary Background Gradient */}
      <LinearGradient
        colors={GRADIENTS.BACKGROUND}
        style={tw`absolute inset-0`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Secondary Overlay Gradient for Depth */}
      <LinearGradient
        colors={['rgba(0, 173, 239, 0.05)', 'rgba(255, 165, 0, 0.03)', 'rgba(255, 215, 0, 0.02)']}
        style={tw`absolute inset-0`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Animated Background Elements */}
      <View style={tw`absolute inset-0`}>
        {/* Enhanced Circuit Lines with Animation */}
        <Animated.View 
          style={[
            tw`absolute top-20 left-10 w-24 h-0.5`,
            { 
              backgroundColor: COLORS.PRIMARY_OPACITY_30,
              opacity: fadeAnim 
            }
          ]} 
        />
        <Animated.View 
          style={[
            tw`absolute top-40 right-20 w-20 h-0.5`,
            { 
              backgroundColor: COLORS.SECONDARY_OPACITY_30,
              opacity: fadeAnim 
            }
          ]} 
        />
        <Animated.View 
          style={[
            tw`absolute bottom-40 left-20 w-28 h-0.5`,
            { 
              backgroundColor: COLORS.ACCENT_OPACITY_30,
              opacity: fadeAnim 
            }
          ]} 
        />
        <Animated.View 
          style={[
            tw`absolute bottom-20 right-10 w-16 h-0.5`,
            { 
              backgroundColor: COLORS.PRIMARY_OPACITY_30,
              opacity: fadeAnim 
            }
          ]} 
        />
        
        {/* Diagonal Lines for Dynamic Effect */}
        <Animated.View 
          style={[
            tw`absolute top-32 left-5 w-0.5 h-20`,
            { 
              backgroundColor: COLORS.SECONDARY_OPACITY_30,
              opacity: fadeAnim,
              transform: [{ rotate: '45deg' }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            tw`absolute bottom-32 right-5 w-0.5 h-24`,
            { 
              backgroundColor: COLORS.ACCENT_OPACITY_30,
              opacity: fadeAnim,
              transform: [{ rotate: '-45deg' }]
            }
          ]} 
        />
        
        {/* Corner Accent Lines */}
        <Animated.View 
          style={[
            tw`absolute top-10 right-10 w-12 h-0.5`,
            { 
              backgroundColor: COLORS.PRIMARY_OPACITY_30,
              opacity: fadeAnim 
            }
          ]} 
        />
        <Animated.View 
          style={[
            tw`absolute bottom-10 left-10 w-8 h-0.5`,
            { 
              backgroundColor: COLORS.SECONDARY_OPACITY_30,
              opacity: fadeAnim 
            }
          ]} 
        />
      </View>

      {/* Main Content Container */}
      <View style={tw`flex-1 justify-center items-center`}>
        {/* Content Wrapper with Responsive Padding */}
        <View style={[
          tw`items-center justify-center`,
          { 
            paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 24 : 32,
            paddingVertical: isSmallScreen ? 20 : isMediumScreen ? 24 : 32
          }
        ]}>
          
          {/* Logo Section */}
          <Animated.View 
            style={[
              tw`items-center justify-center`,
              { 
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
                marginBottom: spacing * 6
              }
            ]}
          >
            <Logo size={logoSize} showGlow={true} glowIntensity="subtle" />
          </Animated.View>

          {/* Brand Name Section */}
          <Animated.View 
            style={[
              tw`items-center justify-center`,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                marginBottom: spacing * 6
              }
            ]}
          >
            <Text 
              style={[
                tw`font-bold text-center`,
                { 
                  fontFamily: fontsLoaded ? 'Poppins-Bold' : 'System',
                  color: COLORS.TEXT_WHITE,
                  fontSize: titleSize,
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                  marginBottom: spacing * 2,
                  lineHeight: isSmallScreen ? 48 : isMediumScreen ? 56 : 64
                }
              ]}
            >
              EduSpark
            </Text>
            
            {/* Tagline */}
            <Text 
              style={[
                tw`text-center`,
                { 
                  fontFamily: fontsLoaded ? 'Poppins-SemiBold' : 'System',
                  color: COLORS.TEXT_WHITE,
                  fontSize: subtitleSize,
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                  lineHeight: isSmallScreen ? 24 : isMediumScreen ? 28 : 32,
                  maxWidth: isSmallScreen ? width - 64 : isMediumScreen ? width - 96 : 600
                }
              ]}
            >
              Education and Energy,{'\n'}Inspiration and Creativity
            </Text>
          </Animated.View>

          {/* Brand Colors Section */}
          <Animated.View 
            style={[
              tw`flex-row justify-center items-center`,
              { 
                opacity: fadeAnim,
                marginBottom: spacing * 6
              }
            ]}
          >
            <View style={[
              tw`rounded-full mx-2`,
              { 
                width: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
                height: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
                backgroundColor: COLORS.PRIMARY 
              }
            ]} />
            <View style={[
              tw`rounded-full mx-2`,
              { 
                width: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
                height: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
                backgroundColor: COLORS.SECONDARY 
              }
            ]} />
            <View style={[
              tw`rounded-full mx-2`,
              { 
                width: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
                height: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
                backgroundColor: COLORS.ACCENT 
              }
            ]} />
          </Animated.View>

          {/* Loading Indicator Section */}
          <Animated.View 
            style={[
              tw`items-center justify-center`,
              { opacity: fadeAnim }
            ]}
          >
            <View style={[
              tw`rounded-full overflow-hidden border`,
              { 
                width: isSmallScreen ? 80 : isMediumScreen ? 96 : 120,
                height: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
                backgroundColor: COLORS.BORDER_GRAY_DARK,
                borderColor: COLORS.BORDER_GRAY,
                marginBottom: spacing * 3
              }
            ]}>
              <Animated.View 
                style={[
                  tw`h-full rounded-full`,
                  { 
                    width: fadeIn ? '100%' : '0%',
                    transform: [{ scaleX: scaleAnim }],
                    backgroundColor: COLORS.PRIMARY
                  }
                ]}
              />
            </View>
            <Text 
              style={[
                tw`font-semibold text-center`,
                { 
                  fontFamily: fontsLoaded ? 'Poppins-SemiBold' : 'System',
                  color: COLORS.TEXT_WHITE,
                  fontSize: bodySize,
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                  lineHeight: isSmallScreen ? 20 : isMediumScreen ? 24 : 28
                }
              ]}
            >
              Igniting Learning
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Bottom Brand Info */}
      <Animated.View 
        style={[
          tw`absolute bottom-0 left-0 right-0 items-center justify-center`,
          { 
            opacity: fadeAnim,
            paddingBottom: isSmallScreen ? 16 : isMediumScreen ? 24 : 32,
            paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 24 : 32
          }
        ]}
      >
        <Text 
          style={[
            tw`text-center`,
            { 
              fontFamily: fontsLoaded ? 'Poppins-Medium' : 'System',
              color: COLORS.TEXT_GRAY_LIGHT,
              fontSize: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
              textShadowColor: 'rgba(0, 0, 0, 0.2)',
              textShadowOffset: { width: 0.5, height: 0.5 },
              textShadowRadius: 1,
              lineHeight: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
              maxWidth: isSmallScreen ? width - 64 : isMediumScreen ? width - 96 : 600
            }
          ]}
        >
          Empowering minds through{'\n'}innovative education
        </Text>
      </Animated.View>
    </View>
  );
}
