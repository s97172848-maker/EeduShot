import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../constants/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get video data from params
  const videoData = {
    id: params.id as string || '1',
    title: params.title as string || 'React Native Setup Tutorial',
    description: params.description as string || 'Complete guide to setting up React Native development environment',
    duration: params.duration as string || '5:23',
    views: params.views as string || '1.2k',
    likes: params.likes as string || '89',
    thumbnail: params.thumbnail as string || '📱',
    category: params.category as string || 'Development',
    date: params.date as string || '2 hours ago',
  };

  // Responsive sizing calculations
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Base spacing unit
  const baseSpacing = isSmallScreen ? 8 : isMediumScreen ? 12 : 16;
  
  const spacing = {
    xs: baseSpacing * 0.5,
    sm: baseSpacing * 0.75,
    md: baseSpacing,
    lg: baseSpacing * 1.5,
    xl: baseSpacing * 2,
    xxl: baseSpacing * 3,
  };

  const dimensions = {
    headerHeight: isSmallScreen ? 60 : isMediumScreen ? 70 : 80,
    titleSize: isSmallScreen ? 18 : isMediumScreen ? 20 : 22,
    subtitleSize: isSmallScreen ? 14 : isMediumScreen ? 16 : 18,
    bodySize: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    buttonHeight: isSmallScreen ? 44 : isMediumScreen ? 48 : 52,
    iconSize: isSmallScreen ? 20 : isMediumScreen ? 24 : 28,
    playButtonSize: isSmallScreen ? 80 : isMediumScreen ? 100 : 120,
  };

  const horizontalPadding = isSmallScreen ? 16 : isMediumScreen ? 20 : 24;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share video');
  };

  return (
    <View style={tw`flex-1`}>
      <StatusBar hidden={true} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={GRADIENTS.BACKGROUND}
        style={tw`absolute inset-0`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            tw`flex-row items-center justify-between`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingHorizontal: horizontalPadding,
              paddingVertical: spacing.md,
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
              },
            ]}
          >
            <Ionicons name="arrow-back" size={dimensions.iconSize - 4} color={COLORS.TEXT_WHITE} />
          </TouchableOpacity>

          <Text
            style={[
              tw`font-bold`,
              {
                fontFamily: 'Poppins-Bold',
                color: COLORS.TEXT_WHITE,
                fontSize: dimensions.titleSize,
              },
            ]}
          >
            Video Player
          </Text>

          <TouchableOpacity
            style={[
              tw`rounded-full items-center justify-center`,
              {
                width: dimensions.buttonHeight - 16,
                height: dimensions.buttonHeight - 16,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            ]}
          >
            <Ionicons name="ellipsis-vertical" size={dimensions.iconSize - 4} color={COLORS.TEXT_WHITE} />
          </TouchableOpacity>
        </Animated.View>

        {/* Video Player Area */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              marginBottom: spacing.lg,
            },
          ]}
        >
          <View
            style={[
              tw`rounded-xl items-center justify-center`,
              {
                height: screenHeight * 0.4,
                backgroundColor: `${COLORS.PRIMARY}20`,
                marginHorizontal: horizontalPadding,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            ]}
          >
            <Text style={{ fontSize: screenHeight * 0.15, marginBottom: spacing.md }}>
              {videoData.thumbnail}
            </Text>
            
            {/* Play/Pause Button */}
            <TouchableOpacity
              onPress={handlePlayPause}
              style={[
                tw`rounded-full items-center justify-center`,
                {
                  width: dimensions.playButtonSize,
                  height: dimensions.playButtonSize,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              ]}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={dimensions.playButtonSize * 0.4} 
                color={COLORS.TEXT_WHITE} 
              />
            </TouchableOpacity>

            {/* Duration Badge */}
            <View
              style={[
                tw`absolute top-4 right-4 px-3 py-1 rounded-full`,
                { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
              ]}
            >
              <Text
                style={[
                  tw`text-sm font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: COLORS.TEXT_WHITE,
                  },
                ]}
              >
                {videoData.duration}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Video Info */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          {/* Title and Category */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: dimensions.titleSize,
                  marginBottom: spacing.sm,
                  lineHeight: dimensions.titleSize * 1.3,
                },
              ]}
            >
              {videoData.title}
            </Text>
            
            <View
              style={[
                tw`px-3 py-1 rounded-full self-start`,
                { backgroundColor: `${COLORS.PRIMARY}30` },
              ]}
            >
              <Text
                style={[
                  tw`text-xs font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: COLORS.PRIMARY,
                  },
                ]}
              >
                {videoData.category}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={[tw`flex-row items-center justify-between`, { marginBottom: spacing.lg }]}>
            <View style={tw`flex-row items-center`}>
              <View style={[tw`flex-row items-center`, { marginRight: spacing.md }]}>
                <Ionicons name="eye-outline" size={dimensions.iconSize - 4} color={COLORS.TEXT_GRAY} />
                <Text
                  style={[
                    tw`text-sm`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_GRAY,
                      marginLeft: spacing.xs,
                    },
                  ]}
                >
                  {videoData.views} views
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="heart" size={dimensions.iconSize - 4} color={isLiked ? COLORS.PRIMARY : COLORS.TEXT_GRAY} />
                <Text
                  style={[
                    tw`text-sm`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: isLiked ? COLORS.PRIMARY : COLORS.TEXT_GRAY,
                      marginLeft: spacing.xs,
                    },
                  ]}
                >
                  {videoData.likes}
                </Text>
              </View>
            </View>

            <Text
              style={[
                tw`text-sm`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY,
                },
              ]}
            >
              {videoData.date}
            </Text>
          </View>

          {/* Description */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={[
                tw`text-sm`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY_LIGHT,
                  fontSize: dimensions.bodySize,
                  lineHeight: dimensions.bodySize * 1.5,
                },
              ]}
            >
              {videoData.description}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={[tw`flex-row items-center justify-center`, { marginBottom: spacing.xl }]}>
            <TouchableOpacity
              onPress={handleLike}
              style={[
                tw`flex-row items-center justify-center rounded-full`,
                {
                  backgroundColor: isLiked ? COLORS.PRIMARY + '20' : 'rgba(255, 255, 255, 0.1)',
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  marginRight: spacing.md,
                  minWidth: 100,
                },
              ]}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={dimensions.iconSize - 4}
                color={isLiked ? COLORS.PRIMARY : COLORS.TEXT_GRAY}
              />
              <Text
                style={[
                  tw`text-sm font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: isLiked ? COLORS.PRIMARY : COLORS.TEXT_GRAY,
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                {isLiked ? 'Liked' : 'Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={[
                tw`flex-row items-center justify-center rounded-full`,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  marginRight: spacing.md,
                  minWidth: 100,
                },
              ]}
            >
              <Ionicons name="share-outline" size={dimensions.iconSize - 4} color={COLORS.TEXT_GRAY} />
              <Text
                style={[
                  tw`text-sm font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: COLORS.TEXT_GRAY,
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                Share
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBookmark}
              style={[
                tw`flex-row items-center justify-center rounded-full`,
                {
                  backgroundColor: isBookmarked ? COLORS.PRIMARY + '20' : 'rgba(255, 255, 255, 0.1)',
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  minWidth: 100,
                },
              ]}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={dimensions.iconSize - 4}
                color={isBookmarked ? COLORS.PRIMARY : COLORS.TEXT_GRAY}
              />
              <Text
                style={[
                  tw`text-sm font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: isBookmarked ? COLORS.PRIMARY : COLORS.TEXT_GRAY,
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                {isBookmarked ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Related Videos Section */}
          <View style={{ marginTop: spacing.xl }}>
            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: dimensions.subtitleSize,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              Related Videos
            </Text>
            
            <View
              style={[
                tw`rounded-lg p-4`,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
              ]}
            >
              <Text
                style={[
                  tw`text-sm`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                    textAlign: 'center',
                  },
                ]}
              >
                More videos coming soon...
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 