import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Logo } from '../../components/Logo';
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

const userVideos = [
  {
    id: '1',
    title: 'React Native Setup Tutorial',
    description: 'Complete guide to setting up React Native development environment',
    duration: '5:23',
    views: '1.2k',
    likes: '89',
    thumbnail: '📱',
    category: 'Development',
    date: '2 hours ago',
    isLiked: true,
  },
  {
    id: '2',
    title: 'UI Design Tips & Tricks',
    description: 'Essential UI design principles for better user experience',
    duration: '3:45',
    views: '856',
    likes: '67',
    thumbnail: '🎨',
    category: 'Design',
    date: '1 day ago',
    isLiked: false,
  },
  {
    id: '3',
    title: 'JavaScript Array Methods',
    description: 'Learn advanced JavaScript array manipulation techniques',
    duration: '7:12',
    views: '2.1k',
    likes: '156',
    thumbnail: '💻',
    category: 'Programming',
    date: '3 days ago',
    isLiked: true,
  },
  {
    id: '4',
    title: 'Data Science Basics',
    description: 'Introduction to data science concepts and tools',
    duration: '4:30',
    views: '1.5k',
    likes: '123',
    thumbnail: '📊',
    category: 'Data Science',
    date: '5 days ago',
    isLiked: false,
  },
  {
    id: '5',
    title: 'Mobile App Development',
    description: 'Step-by-step mobile app development tutorial',
    duration: '8:15',
    views: '3.2k',
    likes: '234',
    thumbnail: '📱',
    category: 'Development',
    date: '1 week ago',
    isLiked: true,
  },
  {
    id: '6',
    title: 'Web Design Fundamentals',
    description: 'Core principles of modern web design',
    duration: '6:20',
    views: '1.8k',
    likes: '145',
    thumbnail: '🌐',
    category: 'Design',
    date: '1 week ago',
    isLiked: false,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { userRole, userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set(['1', '3', '5']));
  


  // Responsive sizing calculations
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
    headerHeight: isSmallScreen ? 60 : isMediumScreen ? 70 : 80,
    logoSize: isSmallScreen ? 28 : isMediumScreen ? 32 : 36,
    titleSize: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
    subtitleSize: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    bodySize: isSmallScreen ? 10 : isMediumScreen ? 12 : 14,
    buttonHeight: isSmallScreen ? 44 : isMediumScreen ? 48 : 52,
    cardPadding: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
    thumbnailHeight: isSmallScreen ? 160 : isMediumScreen ? 180 : 200,
    iconSize: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
    badgeSize: isSmallScreen ? 32 : isMediumScreen ? 36 : 40,
    uploadCardHeight: isSmallScreen ? 120 : isMediumScreen ? 140 : 160,
    captionSize: isSmallScreen ? 10 : isMediumScreen ? 11 : 12,
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

  const handleLikeVideo = (videoId: string) => {
    const newLikedVideos = new Set(likedVideos);
    if (newLikedVideos.has(videoId)) {
      newLikedVideos.delete(videoId);
    } else {
      newLikedVideos.add(videoId);
    }
    setLikedVideos(newLikedVideos);
  };

  const handleVideoPress = (video: any) => {
    router.push({
      pathname: '/video-player',
      params: {
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        views: video.views,
        likes: video.likes,
        thumbnail: video.thumbnail,
        category: video.category,
        date: video.date,
      }
    });
  };

  const handleUploadVideo = () => {
    router.push('/upload-video');
  };

  const renderUploadCard = () => {
    if (userRole !== 'teacher') return null;

    return (
      <Animated.View
        style={[
          tw`rounded-2xl overflow-hidden`,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            transform: [{ scale: scaleAnim }],
            marginBottom: spacing.lg,
            marginHorizontal: horizontalPadding,
            height: dimensions.uploadCardHeight + 35,
          },
        ]}
      >
        <LinearGradient
          colors={[themeColor + '10', 'rgba(255, 255, 255, 0.03)']}
          style={{ 
            padding: dimensions.cardPadding,
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {/* Content Section */}
          <View style={tw`flex-1`}>
            {/* Header Section */}
            <View style={[
              tw`flex-row items-center`,
              { marginBottom: spacing.md }
            ]}>
              <View
                style={[
                  tw`rounded-full items-center justify-center mr-3`,
                  {
                    width: dimensions.iconSize + 12,
                    height: dimensions.iconSize + 12,
                    backgroundColor: themeColor + '25',
                  },
                ]}
              >
                <Ionicons name="cloud-upload" size={dimensions.iconSize + 2} color={themeColor} />
              </View>
              <View style={tw`flex-1`}>
                <Text
                  style={[
                    tw`font-bold`,
                    {
                      fontFamily: 'Poppins-Bold',
                      color: COLORS.TEXT_WHITE,
                      fontSize: dimensions.titleSize,
                      lineHeight: dimensions.titleSize * 1.2,
                    },
                  ]}
                >
                  Upload Video
                </Text>
                <Text
                  style={[
                    tw`text-xs`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_GRAY_LIGHT,
                      fontSize: dimensions.captionSize,
                      lineHeight: dimensions.captionSize * 1.3,
                    },
                  ]}
                >
                  Share your knowledge
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text
              style={[
                tw`text-sm`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY_LIGHT,
                  fontSize: dimensions.bodySize,
                  lineHeight: dimensions.bodySize * 1.4,
                },
              ]}
            >
              Create and upload educational videos to help students learn and grow
            </Text>

            <TouchableOpacity
            onPress={handleUploadVideo}
            style={[
              tw`rounded-xl items-center justify-center`,
              {
                backgroundColor: themeColor,
                height: dimensions.buttonHeight,
                paddingHorizontal: dimensions.cardPadding,
                marginTop: spacing.md,
              },
            ]}
          >
            <View style={tw`flex-row items-center`}>
              <Ionicons 
                name="add-circle" 
                size={dimensions.iconSize} 
                color={COLORS.TEXT_WHITE}
                style={{ marginRight: spacing.sm }}
              />
              <Text
                style={[
                  tw`font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: dimensions.subtitleSize,
                  },
                ]}
              >
                Create New Video
              </Text>
            </View>
          </TouchableOpacity>
          </View>

          {/* Action Button */}
          
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderVideoCard = ({ item }: { item: any }) => {
    const isLiked = likedVideos.has(item.id);

    return (
      <TouchableOpacity
        onPress={() => handleVideoPress(item)}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            tw`rounded-xl overflow-hidden`,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              transform: [{ scale: scaleAnim }],
              marginBottom: spacing.lg,
              marginHorizontal: horizontalPadding,
            },
          ]}
        >
        <LinearGradient
          colors={[themeColor + '20', 'rgba(255, 255, 255, 0.05)']}
          style={{ padding: dimensions.cardPadding }}
        >
          {/* Video Thumbnail */}
          <View style={{ marginBottom: spacing.md }}>
            <View
              style={[
                tw`rounded-lg items-center justify-center`,
                {
                  height: dimensions.thumbnailHeight,
                  backgroundColor: `${themeColor}20`,
                },
              ]}
            >
              <Text style={{ fontSize: dimensions.thumbnailHeight * 0.3, marginBottom: spacing.sm }}>
                {item.thumbnail}
              </Text>
              
              {/* Duration Badge */}
              <View
                style={[
                  tw`absolute top-2 right-2 px-2 py-1 rounded-full`,
                  { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                ]}
              >
                <Text
                  style={[
                    tw`text-xs font-semibold`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: COLORS.TEXT_WHITE,
                    },
                  ]}
                >
                  {item.duration}
                </Text>
              </View>
              
              {/* Play Button */}
              <TouchableOpacity
                onPress={() => handleVideoPress(item)}
                style={[
                  tw`absolute top-2 left-2 rounded-full items-center justify-center`,
                  {
                    width: dimensions.badgeSize,
                    height: dimensions.badgeSize,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                ]}
              >
                <Ionicons name="play" size={dimensions.iconSize} color={COLORS.TEXT_WHITE} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Video Info */}
          <View style={{ marginBottom: spacing.md }}>
            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: dimensions.titleSize,
                  marginBottom: spacing.xs,
                  lineHeight: dimensions.titleSize * 1.3,
                },
              ]}
            >
              {item.title}
            </Text>
            
            <Text
              style={[
                tw`text-sm`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY_LIGHT,
                  fontSize: dimensions.bodySize,
                  marginBottom: spacing.sm,
                  lineHeight: dimensions.bodySize * 1.4,
                },
              ]}
            >
              {item.description}
            </Text>
            
            <View
              style={[
                tw`px-3 py-1 rounded-full self-start`,
                { backgroundColor: `${themeColor}30` },
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
                {item.category}
              </Text>
            </View>
          </View>

          {/* Stats and Actions */}
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center`}>
              <View style={[tw`flex-row items-center`, { marginRight: spacing.md }]}>
                <Ionicons name="eye-outline" size={dimensions.iconSize - 2} color={COLORS.TEXT_GRAY} />
                <Text
                  style={[
                    tw`text-xs`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_GRAY,
                      marginLeft: spacing.xs,
                    },
                  ]}
                >
                  {item.views}
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="heart" size={dimensions.iconSize - 2} color={isLiked ? themeColor : COLORS.TEXT_GRAY} />
                <Text
                  style={[
                    tw`text-xs`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: isLiked ? themeColor : COLORS.TEXT_GRAY,
                      marginLeft: spacing.xs,
                    },
                  ]}
                >
                  {item.likes}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-center`}>
              <TouchableOpacity
                onPress={() => handleLikeVideo(item.id)}
                style={[
                  tw`rounded-full items-center justify-center`,
                  {
                    width: dimensions.badgeSize - 8,
                    height: dimensions.badgeSize - 8,
                    backgroundColor: isLiked ? themeColor + '20' : 'rgba(255, 255, 255, 0.1)',
                    marginRight: spacing.sm,
                  },
                ]}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={dimensions.iconSize - 2}
                  color={isLiked ? themeColor : COLORS.TEXT_GRAY}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tw`rounded-full items-center justify-center`,
                  {
                    width: dimensions.badgeSize - 8,
                    height: dimensions.badgeSize - 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    marginRight: spacing.sm,
                  },
                ]}
              >
                <Ionicons name="share-outline" size={dimensions.iconSize - 2} color={COLORS.TEXT_GRAY} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tw`rounded-full items-center justify-center`,
                  {
                    width: dimensions.badgeSize - 8,
                    height: dimensions.badgeSize - 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                ]}
              >
                <Ionicons name="bookmark-outline" size={dimensions.iconSize - 2} color={COLORS.TEXT_GRAY} />
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={[
              tw`text-xs`,
              {
                fontFamily: 'Poppins-Medium',
                color: COLORS.TEXT_GRAY,
                marginTop: spacing.sm,
              },
            ]}
          >
            {item.date}
          </Text>
        </LinearGradient>
      </Animated.View>
      </TouchableOpacity>
    );
  
  };

  const getVideos = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
  
    try {
      const response = await fetch("http://93.127.213.176:3002/api/videos/videos", requestOptions);
      const result = await response.json(); // Assuming the response is JSON
  
      if (result === "Success") {
        console.log(result);
      } else {
        console.log(result.message); // assuming the API might return a message property
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    getVideos();
  }, []);
  

console.log("userRole",userRole);
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="light-content"/>
      
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
          <View style={tw`flex-row items-center`}>
            <Logo size={dimensions.logoSize} showGlow={true} glowIntensity="subtle" />
            <View style={{ marginLeft: spacing.md }}>
              <Text
                style={[
                  tw`font-bold`,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: dimensions.titleSize,
                    lineHeight: dimensions.titleSize * 1.2,
                  },
                ]}
              >
                EduSpark
              </Text>
              <Text
                style={[
                  tw`text-xs`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                    fontSize: dimensions.bodySize,
                    lineHeight: dimensions.bodySize * 1.2,
                  },
                ]}
              >
                Educational Videos
              </Text>
            </View>
          </View>
         
        </Animated.View>

        {/* Upload Video Card (Teacher Only) */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderUploadCard()}
        </Animated.View>

        {/* Videos Section */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[
            tw`flex-row items-center justify-between`,
            {
              marginBottom: spacing.lg,
              paddingHorizontal: horizontalPadding,
            },
          ]}>
            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: dimensions.titleSize,
                  lineHeight: dimensions.titleSize * 1.2,
                },
              ]}
            >
              Educational Videos
            </Text>
           
          </View>

          {userVideos.map((item) => renderVideoCard({ item }))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
} 