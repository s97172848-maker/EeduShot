import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../../constants/Colors';

const { height: screenHeight } = Dimensions.get('window');

const educationalReels = [
  {
    id: '1',
    title: 'React Native Setup Guide - Complete Tutorial',
    creator: 'Tech Guru',
    creatorAvatar: '👨‍💻',
    duration: '2:34',
    views: '12.5k',
    likes: '1.2k',
    comments: '234',
    shares: '45',
    category: 'Development',
    thumbnail: '🎨',
    color: COLORS.PRIMARY,
    isLiked: false,
    isSaved: false,
    description: 'Learn how to set up React Native from scratch. Perfect for beginners! #reactnative #coding #tutorial',
  },
  {
    id: '2',
    title: 'UI Design Principles - Master the Basics',
    creator: 'Design Master',
    creatorAvatar: '🎨',
    duration: '3:12',
    views: '8.9k',
    likes: '856',
    comments: '156',
    shares: '23',
    category: 'Design',
    thumbnail: '🎯',
    color: COLORS.SECONDARY,
    isLiked: true,
    isSaved: true,
    description: 'Essential UI design principles every designer should know. #design #ui #principles',
  },
  {
    id: '3',
    title: 'JavaScript Tips & Tricks - Pro Level',
    creator: 'Code Ninja',
    creatorAvatar: '⚡',
    duration: '1:45',
    views: '15.2k',
    likes: '2.1k',
    comments: '432',
    shares: '89',
    category: 'Programming',
    thumbnail: '⚡',
    color: COLORS.ACCENT,
    isLiked: false,
    isSaved: false,
    description: 'Advanced JavaScript techniques that will make you a better developer! #javascript #coding #tips',
  },
  {
    id: '4',
    title: 'Data Science Basics - Get Started Today',
    creator: 'Data Pro',
    creatorAvatar: '📊',
    duration: '4:20',
    views: '6.7k',
    likes: '543',
    comments: '98',
    shares: '34',
    category: 'Data Science',
    thumbnail: '📊',
    color: COLORS.PRIMARY,
    isLiked: false,
    isSaved: false,
    description: 'Introduction to data science concepts and tools. #datascience #python #analytics',
  },
  {
    id: '5',
    title: 'Flutter vs React Native - Which to Choose?',
    creator: 'Mobile Dev',
    creatorAvatar: '📱',
    duration: '3:45',
    views: '9.8k',
    likes: '1.5k',
    comments: '267',
    shares: '67',
    category: 'Development',
    thumbnail: '📱',
    color: COLORS.SECONDARY,
    isLiked: true,
    isSaved: true,
    description: 'Detailed comparison between Flutter and React Native. #flutter #reactnative #mobile',
  },
];

export default function ReelsScreen() {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set(['2', '5']));
  const [savedReels, setSavedReels] = useState<Set<string>>(new Set(['2', '5']));
  const flatListRef = useRef<FlatList>(null);

  // Responsive sizing
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;
  
  // Calculate responsive spacing
  const spacing = isSmallScreen ? 12 : isMediumScreen ? 16 : 20;
  const iconSize = isSmallScreen ? 24 : isMediumScreen ? 28 : 32;
  const textSize = isSmallScreen ? 12 : isMediumScreen ? 14 : 16;
  const titleSize = isSmallScreen ? 16 : isMediumScreen ? 18 : 20;
  
  const videoHeight = height - (isSmallScreen ? 60 : isMediumScreen ? 70 : 80); // Reduced top gap

  const handleLike = (reelId: string) => {
    const newLikedReels = new Set(likedReels);
    if (newLikedReels.has(reelId)) {
      newLikedReels.delete(reelId);
    } else {
      newLikedReels.add(reelId);
    }
    setLikedReels(newLikedReels);
  };

  const handleSave = (reelId: string) => {
    const newSavedReels = new Set(savedReels);
    if (newSavedReels.has(reelId)) {
      newSavedReels.delete(reelId);
    } else {
      newSavedReels.add(reelId);
    }
    setSavedReels(newSavedReels);
  };

  const handleShare = (reelId: string) => {
    // Implement share functionality
    console.log('Sharing reel:', reelId);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderReel = ({ item, index }: { item: any; index: number }) => {
    const isLiked = likedReels.has(item.id);
    const isSaved = savedReels.has(item.id);
    const isActive = currentIndex === index;

    return (
      <View style={[tw`flex-1`, { height: videoHeight }]}>
        {/* Video Container */}
        <View style={[tw`flex-1 relative`, { backgroundColor: `${item.color}20` }]}>
          {/* Video Placeholder */}
          <View style={tw`flex-1 items-center justify-center`}>
            <Text style={tw`text-8xl mb-4`}>{item.thumbnail}</Text>
         
            
            {/* Play Button */}
            <TouchableOpacity
              style={[
                tw`absolute top-1/2 left-1/2 w-16 h-16 rounded-full items-center justify-center`,
                {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  transform: [{ translateX: -32 }, { translateY: -32 }],
                },
              ]}
            >
              <Ionicons name="play" size={32} color={COLORS.TEXT_WHITE} />
            </TouchableOpacity>
          </View>

                                  {/* Left Side Actions */}
            <View style={[tw`absolute right-4 top-1/2`, { right: spacing }]}>
              {/* Like Button */}
              <TouchableOpacity
                onPress={() => handleLike(item.id)}
                style={[tw`items-center mb-4`, { marginBottom: spacing }]}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={iconSize}
                  color={isLiked ? '#ff3040' : COLORS.TEXT_WHITE}
                />
                <Text
                  style={[
                    tw`mt-1`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_WHITE,
                      fontSize: textSize,
                    },
                  ]}
                >
                  {item.likes}
                </Text>
              </TouchableOpacity>

              {/* Share Button */}
              <TouchableOpacity
                onPress={() => handleShare(item.id)}
                style={[tw`items-center mb-4`, { marginBottom: spacing }]}
              >
                <Ionicons name="share-outline" size={iconSize} color={COLORS.TEXT_WHITE} />
                <Text
                  style={[
                    tw`mt-1`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_WHITE,
                      fontSize: textSize,
                    },
                  ]}
                >
                  {item.shares}
                </Text>
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity
                onPress={() => handleSave(item.id)}
                style={[tw`items-center mb-4`, { marginBottom: spacing }]}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={iconSize}
                  color={isSaved ? COLORS.PRIMARY : COLORS.TEXT_WHITE}
                />
              </TouchableOpacity>
            </View>

          {/* Bottom Content */}
          <View style={[tw`absolute bottom-0 left-0 right-0 p-4`, { padding: spacing }]}>
            {/* Creator Info */}
            <View style={[tw`flex-row items-center mb-3`, { marginBottom: spacing * 0.75 }]}>
              <View
                style={[
                  tw`rounded-full items-center justify-center mr-3`,
                  { 
                    width: iconSize * 0.8, 
                    height: iconSize * 0.8,
                    backgroundColor: `${item.color}30` 
                  },
                ]}
              >
                <Text style={[tw`text-lg`, { fontSize: iconSize * 0.6 }]}>{item.creatorAvatar}</Text>
              </View>
              <View style={tw`flex-1`}>
                <Text
                  style={[
                    tw`font-bold`,
                    {
                      fontFamily: 'Poppins-Bold',
                      color: COLORS.TEXT_WHITE,
                      fontSize: titleSize,
                    },
                  ]}
                >
                  {item.creator}
                </Text>
                <TouchableOpacity>
                  <Text
                    style={[
                      tw`text-sm`,
                      {
                        fontFamily: 'Poppins-Medium',
                        color: COLORS.PRIMARY,
                        fontSize: textSize,
                      },
                    ]}
                  >
                    Follow
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Video Title and Description */}
            <View style={[tw`mb-3`, { marginBottom: spacing * 0.75 }]}>
              <Text
                style={[
                  tw`font-bold mb-2`,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: titleSize,
                  },
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  tw`text-sm`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                    fontSize: textSize,
                  },
                ]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            </View>

           
          </View>
        </View>
      </View>
    );
  };

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

     

      {/* Video List */}
      <FlatList
        ref={flatListRef}
        data={educationalReels}
        renderItem={renderReel}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={videoHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: videoHeight,
          offset: videoHeight * index,
          index,
        })}
      />

    
    </View>
  );
} 