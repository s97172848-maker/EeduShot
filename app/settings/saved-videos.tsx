import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

const savedVideos = [
  {
    id: '1',
    title: 'React Native Navigation Deep Dive',
    instructor: 'Dr. John Smith',
    duration: '45:30',
    thumbnail: '📱',
    category: 'React Native',
    savedDate: '2024-01-15',
    progress: 75,
  },
  {
    id: '2',
    title: 'Advanced JavaScript Concepts',
    instructor: 'Prof. Sarah Wilson',
    duration: '32:15',
    thumbnail: '💻',
    category: 'JavaScript',
    savedDate: '2024-01-12',
    progress: 100,
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    instructor: 'Emma Davis',
    duration: '28:45',
    thumbnail: '🎨',
    category: 'Design',
    savedDate: '2024-01-10',
    progress: 45,
  },
  {
    id: '4',
    title: 'Data Science Fundamentals',
    instructor: 'Dr. Mike Chen',
    duration: '52:20',
    thumbnail: '📊',
    category: 'Data Science',
    savedDate: '2024-01-08',
    progress: 0,
  },
  {
    id: '5',
    title: 'Mobile App Development',
    instructor: 'Alex Johnson',
    duration: '38:10',
    thumbnail: '📱',
    category: 'Mobile Development',
    savedDate: '2024-01-05',
    progress: 90,
  },
  {
    id: '6',
    title: 'Web Development Best Practices',
    instructor: 'Lisa Brown',
    duration: '41:25',
    thumbnail: '🌐',
    category: 'Web Development',
    savedDate: '2024-01-03',
    progress: 60,
  },
  {
    id: '7',
    title: 'Python for Beginners',
    instructor: 'David Wilson',
    duration: '35:40',
    thumbnail: '🐍',
    category: 'Python',
    savedDate: '2023-12-28',
    progress: 100,
  },
  {
    id: '8',
    title: 'Machine Learning Basics',
    instructor: 'Dr. Sarah Chen',
    duration: '48:15',
    thumbnail: '🤖',
    category: 'Machine Learning',
    savedDate: '2023-12-25',
    progress: 30,
  },
];

const categories = [
  { id: 'all', name: 'All', icon: 'list' },
  { id: 'React Native', name: 'React Native', icon: 'logo-react' },
  { id: 'JavaScript', name: 'JavaScript', icon: 'logo-javascript' },
  { id: 'Design', name: 'Design', icon: 'color-palette' },
  { id: 'Data Science', name: 'Data Science', icon: 'analytics' },
  { id: 'Mobile Development', name: 'Mobile', icon: 'phone-portrait' },
  { id: 'Web Development', name: 'Web', icon: 'globe' },
  { id: 'Python', name: 'Python', icon: 'code' },
  { id: 'Machine Learning', name: 'ML', icon: 'trending-up' },
];

export default function SavedVideosScreen() {
  const { width, height } = useWindowDimensions();
  const { userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredVideos, setFilteredVideos] = useState(savedVideos);

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

  useEffect(() => {
    let filtered = savedVideos;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVideos(filtered);
  }, [searchQuery, selectedCategory]);

  const getProgressColor = (progress: number) => {
    if (progress === 100) return COLORS.PRIMARY;
    if (progress >= 75) return COLORS.SECONDARY;
    if (progress >= 50) return COLORS.ACCENT;
    return COLORS.TEXT_GRAY;
  };

  const renderVideoItem = ({ item }: { item: any }) => (
    <Animated.View
      style={[
        tw`mx-4 mb-3 p-4 rounded-xl`,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity style={tw`flex-row items-center`}>
        <View
          style={[
            tw`w-16 h-16 rounded-lg items-center justify-center mr-3`,
            { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          ]}
        >
          <Text style={tw`text-3xl`}>{item.thumbnail}</Text>
        </View>
        <View style={tw`flex-1`}>
          <Text
            style={[
              tw`font-bold mb-1`,
              {
                fontFamily: 'Poppins-Bold',
                color: COLORS.TEXT_WHITE,
                fontSize: isSmallScreen ? 14 : 16,
              },
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            style={[
              tw`text-sm mb-1`,
              {
                fontFamily: 'Poppins-Medium',
                color: COLORS.TEXT_GRAY_LIGHT,
                fontSize: isSmallScreen ? 12 : 14,
              },
            ]}
          >
            {item.instructor}
          </Text>
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="time-outline" size={14} color={COLORS.TEXT_GRAY} />
              <Text
                style={[
                  tw`text-xs ml-1`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY,
                  },
                ]}
              >
                {item.duration}
              </Text>
              <View
                style={[
                  tw`px-2 py-1 rounded-full ml-2`,
                  { backgroundColor: themeColor + '20' },
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
            <View style={tw`items-end`}>
              <Text
                style={[
                  tw`text-xs font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: getProgressColor(item.progress),
                  },
                ]}
              >
                {item.progress}%
              </Text>
              <View
                style={[
                  tw`w-12 h-1 rounded-full mt-1`,
                  { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                ]}
              >
                <View
                  style={[
                    tw`h-1 rounded-full`,
                    {
                      backgroundColor: getProgressColor(item.progress),
                      width: `${item.progress}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[
            tw`w-8 h-8 rounded-full items-center justify-center ml-2`,
            { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          ]}
        >
          <Ionicons name="play" size={16} color={COLORS.TEXT_WHITE} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCategoryButton = (category: any) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => setSelectedCategory(category.id)}
      style={[
        tw`px-4 py-2 rounded-lg mr-2`,
        {
          backgroundColor: selectedCategory === category.id ? themeColor : 'rgba(255, 255, 255, 0.08)',
        },
      ]}
    >
      <View style={tw`flex-row items-center`}>
        <Ionicons
          name={category.icon as any}
          size={16}
          color={selectedCategory === category.id ? COLORS.TEXT_WHITE : COLORS.TEXT_GRAY}
        />
        <Text
          style={[
            tw`ml-1 font-semibold`,
            {
              fontFamily: 'Poppins-SemiBold',
              color: selectedCategory === category.id ? COLORS.TEXT_WHITE : COLORS.TEXT_GRAY,
              fontSize: isSmallScreen ? 12 : 14,
            },
          ]}
        >
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
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
              Saved Videos
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
              {filteredVideos.length} videos saved
            </Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View
          style={[
            tw`px-4 mb-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
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
            <Ionicons name="search" size={20} color={COLORS.TEXT_GRAY} />
            <TextInput
              style={[
                tw`flex-1 ml-3`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 14 : 16,
                },
              ]}
              placeholder="Search saved videos..."
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        {/* Category Filters */}
        <Animated.View
          style={[
            tw`px-4 mb-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {categories.map(renderCategoryButton)}
          </ScrollView>
        </Animated.View>

        {/* Videos List */}
        <Animated.View
          style={[
            tw`flex-1`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {filteredVideos.length > 0 ? (
            filteredVideos.map((item) => renderVideoItem({ item }))
          ) : (
            <View style={tw`mx-4 p-8 items-center`}>
              <Ionicons name="bookmark-outline" size={64} color={COLORS.TEXT_GRAY} />
              <Text
                style={[
                  tw`font-bold mt-4 mb-2`,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: isSmallScreen ? 16 : 18,
                  },
                ]}
              >
                No Saved Videos
              </Text>
              <Text
                style={[
                  tw`text-center`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                    fontSize: isSmallScreen ? 12 : 14,
                  },
                ]}
              >
                {searchQuery || selectedCategory !== 'all' 
                  ? 'No videos match your search criteria'
                  : 'Start saving videos to watch later'
                }
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
} 