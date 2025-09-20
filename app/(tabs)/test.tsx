import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

const testCategories = [
  {
    id: '1',
    title: 'React Native',
    questions: 25,
    duration: '30 min',
    difficulty: 'Intermediate',
    icon: 'logo-react',
    color: COLORS.PRIMARY,
    completed: 15,
  },
  {
    id: '2',
    title: 'JavaScript',
    questions: 20,
    duration: '25 min',
    difficulty: 'Beginner',
    icon: 'logo-javascript',
    color: COLORS.SECONDARY,
    completed: 20,
  },
  {
    id: '3',
    title: 'UI/UX Design',
    questions: 30,
    duration: '35 min',
    difficulty: 'Advanced',
    icon: 'color-palette',
    color: COLORS.ACCENT,
    completed: 8,
  },
  {
    id: '4',
    title: 'Data Structures',
    questions: 18,
    duration: '20 min',
    difficulty: 'Intermediate',
    icon: 'analytics',
    color: COLORS.PRIMARY,
    completed: 0,
  },
];

const recentTests = [
  {
    id: '1',
    title: 'React Native Basics',
    score: 85,
    date: '2 days ago',
    totalQuestions: 20,
    correctAnswers: 17,
  },
  {
    id: '2',
    title: 'JavaScript Fundamentals',
    score: 92,
    date: '1 week ago',
    totalQuestions: 25,
    correctAnswers: 23,
  },
  {
    id: '3',
    title: 'UI Design Principles',
    score: 78,
    date: '2 weeks ago',
    totalQuestions: 15,
    correctAnswers: 12,
  },
];

export default function TestScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;

  // Responsive sizing
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const spacing = isSmallScreen ? 12 : isMediumScreen ? 16 : 20;

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

  const handleStartTest = (testId: string) => {
    router.push({
      pathname: '/quiz-screen',
      params: { testId }
    });
  };

  const renderTestCategory = ({ item }: { item: any }) => {
    const progress = (item.completed / item.questions) * 100;
    const isSelected = selectedCategory === item.id;

    return (
      <Animated.View
        style={[
          tw`mx-2 mb-4 rounded-xl overflow-hidden`,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? item.color : 'rgba(255, 255, 255, 0.1)',
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setSelectedCategory(item.id)}
          style={tw`p-4`}
        >
          <LinearGradient
            colors={[item.color + '20', 'rgba(255, 255, 255, 0.05)']}
            style={tw`p-4 rounded-lg`}
          >
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={tw`flex-row items-center`}>
                <View
                  style={[
                    tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
                    { backgroundColor: `${item.color}30` },
                  ]}
                >
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <View>
                  <Text
                    style={[
                      tw`font-bold`,
                      {
                        fontFamily: 'Poppins-Bold',
                        color: COLORS.TEXT_WHITE,
                        fontSize: isSmallScreen ? 16 : 18,
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
                        fontSize: isSmallScreen ? 12 : 14,
                      },
                    ]}
                  >
                    {item.difficulty}
                  </Text>
                </View>
              </View>
              <View style={tw`items-end`}>
                <Text
                  style={[
                    tw`font-semibold`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: item.color,
                      fontSize: isSmallScreen ? 14 : 16,
                    },
                  ]}
                >
                  {item.completed}/{item.questions}
                </Text>
                <Text
                  style={[
                    tw`text-xs`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_GRAY,
                    },
                  ]}
                >
                  {item.duration}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={tw`mb-3`}>
              <View
                style={[
                  tw`h-2 rounded-full`,
                  { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                ]}
              >
                <View
                  style={[
                    tw`h-2 rounded-full`,
                    { backgroundColor: item.color, width: `${progress}%` },
                  ]}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleStartTest(item.id)}
              style={[
                tw`py-2 px-4 rounded-lg items-center`,
                {
                  backgroundColor: item.completed === item.questions ? COLORS.BORDER_GRAY : item.color,
                },
              ]}
              disabled={item.completed === item.questions}
            >
              <Text
                style={[
                  tw`font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: isSmallScreen ? 12 : 14,
                  },
                ]}
              >
                {item.completed === item.questions ? 'Completed' : 'Start Test'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderRecentTest = ({ item }: { item: any }) => (
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
      <View style={tw`flex-row items-center justify-between mb-2`}>
        <Text
          style={[
            tw`font-bold`,
            {
              fontFamily: 'Poppins-Bold',
              color: COLORS.TEXT_WHITE,
              fontSize: isSmallScreen ? 14 : 16,
            },
          ]}
        >
          {item.title}
        </Text>
        <View
          style={[
            tw`px-3 py-1 rounded-full`,
            {
              backgroundColor: item.score >= 80 ? themeColor + '20' : COLORS.SECONDARY + '20',
            },
          ]}
        >
          <Text
            style={[
              tw`font-semibold text-xs`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: item.score >= 80 ? themeColor : COLORS.SECONDARY,
              },
            ]}
          >
            {item.score}%
          </Text>
        </View>
      </View>

      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="checkmark-circle" size={16} color={themeColor} />
          <Text
            style={[
              tw`ml-1 text-sm`,
              {
                fontFamily: 'Poppins-Medium',
                color: COLORS.TEXT_GRAY_LIGHT,
              },
            ]}
          >
            {item.correctAnswers}/{item.totalQuestions} correct
          </Text>
        </View>
        <Text
          style={[
            tw`text-xs`,
            {
              fontFamily: 'Poppins-Medium',
              color: COLORS.TEXT_GRAY,
            },
          ]}
        >
          {item.date}
        </Text>
      </View>
    </Animated.View>
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
            tw`flex-row items-center justify-between p-4`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View>
            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 24 : 28,
                },
              ]}
            >
              Tests & Quizzes
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
              Test your knowledge and track progress
            </Text>
          </View>
          <TouchableOpacity
            style={[
              tw`w-10 h-10 rounded-full items-center justify-center`,
              { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            ]}
          >
            <Ionicons name="trophy-outline" size={20} color={COLORS.ACCENT} />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View
          style={[
            tw`px-4 mb-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={tw`flex-row`}>
            <View
              style={[
                tw`flex-1 mx-1 p-4 rounded-xl`,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
              ]}
            >
              <View style={tw`flex-row items-center mb-2`}>
                <View
                  style={[
                    tw`w-8 h-8 rounded-full items-center justify-center mr-2`,
                    { backgroundColor: themeColor + '20' },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={16} color={themeColor} />
                </View>
                <Text
                  style={[
                    tw`font-bold`,
                    {
                      fontFamily: 'Poppins-Bold',
                      color: COLORS.TEXT_WHITE,
                      fontSize: isSmallScreen ? 18 : 20,
                    },
                  ]}
                >
                  43
                </Text>
              </View>
              <Text
                style={[
                  tw`text-xs`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                  },
                ]}
              >
                Tests Completed
              </Text>
            </View>


            <View
              style={[
                tw`flex-1 mx-1 p-4 rounded-xl`,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
              ]}
            >
              <View style={tw`flex-row items-center mb-2`}>
                <View
                  style={[
                    tw`w-8 h-8 rounded-full items-center justify-center mr-2`,
                    { backgroundColor: COLORS.ACCENT + '20' },
                  ]}
                >
                  <Ionicons name="cash" size={16} color={COLORS.ACCENT} />
                </View>
                <Text
                  style={[
                    tw`font-bold`,
                    {
                      fontFamily: 'Poppins-Bold',
                      color: COLORS.TEXT_WHITE,
                      fontSize: isSmallScreen ? 18 : 20,
                    },
                  ]}
                >
                  $2,450
                </Text>
              </View>
              <Text
                style={[
                  tw`text-xs`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                  },
                ]}
              >
                Total Winnings
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Test Categories */}
        <Animated.View
          style={[
            tw`px-4`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 18 : 20,
                },
              ]}
            >
              Available Tests
            </Text>
            <TouchableOpacity>
              <Text
                style={[
                  tw`font-medium`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: themeColor,
                    fontSize: isSmallScreen ? 12 : 14,
                  },
                ]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={testCategories}
            renderItem={renderTestCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing }}
          />
        </Animated.View>

        {/* Recent Tests */}
        <Animated.View
          style={[
            tw`mt-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={[
              tw`font-bold mb-4 px-4`,
              {
                fontFamily: 'Poppins-Bold',
                color: COLORS.TEXT_WHITE,
                fontSize: isSmallScreen ? 18 : 20,
              },
            ]}
          >
            Recent Tests
          </Text>

          {recentTests.map((item) => renderRecentTest({ item }))}
        </Animated.View>

       
      </ScrollView>
    </View>
  );
} 