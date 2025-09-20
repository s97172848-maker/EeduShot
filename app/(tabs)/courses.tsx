import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import tw from 'twrnc';
import { COLORS } from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorImage: string;
  thumbnail: string;
  expiryDate: string;
  price: number;
  originalPrice?: number;
  isLiked: boolean;
  isPurchased: boolean;
  bannerText: {
    paper: string;
    complete: string;
    power: string;
    batch: string;
    year: string;
  };
  bannerColor: string;
  studentsCount: number;
  rating: number;
  duration: string;
  category: string;
}

const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'PAPER-1 Complete Batch 2025-26',
    instructor: 'Dr. Rajesh Kumar',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop',
    expiryDate: '07 Jan 2026',
    price: 2999,
    originalPrice: 4999,
    isLiked: false,
    isPurchased: false,
    bannerText: {
      paper: 'PAPER-1',
      complete: 'COMPLETE',
      power: 'POWER',
      batch: 'BATCH',
      year: '2025-26'
    },
    bannerColor: 'red',
    studentsCount: 1250,
    rating: 4.8,
    duration: '6 months',
    category: 'Academic'
  },
  {
    id: '2',
    title: 'Mathematics Foundation Course',
    instructor: 'Prof. Priya Sharma',
    instructorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180f48363553?w=400&h=200&fit=crop',
    expiryDate: '15 Mar 2026',
    price: 1999,
    originalPrice: 2999,
    isLiked: true,
    isPurchased: true,
    bannerText: {
      paper: 'MATH',
      complete: 'FOUNDATION',
      power: 'MASTER',
      batch: 'COURSE',
      year: '2025-26'
    },
    bannerColor: 'blue',
    studentsCount: 890,
    rating: 4.9,
    duration: '4 months',
    category: 'Mathematics'
  },
  {
    id: '3',
    title: 'Physics Advanced Concepts',
    instructor: 'Dr. Amit Singh',
    instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop',
    expiryDate: '20 Feb 2026',
    price: 2499,
    originalPrice: 3999,
    isLiked: false,
    isPurchased: false,
    bannerText: {
      paper: 'PHYSICS',
      complete: 'ADVANCED',
      power: 'CONCEPTS',
      batch: 'MASTER',
      year: '2025-26'
    },
    bannerColor: 'purple',
    studentsCount: 650,
    rating: 4.7,
    duration: '5 months',
    category: 'Science'
  }
];

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [likedCourses, setLikedCourses] = useState<Set<string>>(new Set());
  const scaleAnimations = useRef<{ [key: string]: Animated.Value }>({});

  const getScaleAnimation = (courseId: string) => {
    if (!scaleAnimations.current[courseId]) {
      scaleAnimations.current[courseId] = new Animated.Value(1);
    }
    return scaleAnimations.current[courseId];
  };

  const handleLike = (courseId: string) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animation
    const scaleAnim = getScaleAnimation(courseId);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setLikedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handlePurchase = (course: Course) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Purchase Course',
      `Do you want to purchase "${course.title}" for ₹${course.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Buy Now', 
          onPress: () => {
            // Success haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            setCourses(prev => 
              prev.map(c => 
                c.id === course.id ? { ...c, isPurchased: true } : c
              )
            );
            Alert.alert('Success', 'Course purchased successfully!');
          }
        }
      ]
    );
  };

  const handleShare = (course: Course) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Share Course', `Share "${course.title}" with others`);
  };

  const getBannerGradient = (bannerColor: string): [string, string, string] => {
    switch (bannerColor) {
      case 'red':
        return ['#FF6B6B', '#FF8E53', '#FF6B35'];
      case 'blue':
        return [COLORS.PRIMARY, '#4A90E2', '#357ABD'];
      case 'purple':
        return ['#9B59B6', '#8E44AD', '#7D3C98'];
      default:
        return [COLORS.PRIMARY, COLORS.SECONDARY, COLORS.ACCENT];
    }
  };

  const CourseCard = ({ course }: { course: Course }) => {
    const isLiked = likedCourses.has(course.id);
    const bannerGradient = getBannerGradient(course.bannerColor);

    return (
      <View style={tw`mb-4 mx-4`}>
        {/* Main Course Card */}
        <View style={tw`bg-gray-800 rounded-2xl overflow-hidden`}>
          {/* Thumbnail Section */}
          <View style={tw`relative`}>
            <Image
              source={{ uri: course.thumbnail }}
              style={tw`w-full h-40`}
              resizeMode="cover"
            />
            
            {/* Overlay Gradient */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={tw`absolute inset-0`}
            />
            
            {/* Category Badge */}
            <View style={tw`absolute top-3 left-3`}>
              <View style={[
                tw`px-3 py-1 rounded-full`,
                { backgroundColor: COLORS.PRIMARY }
              ]}>
                <Text style={[
                  tw`text-white text-xs font-bold`,
                  { fontFamily: 'Poppins-Bold' }
                ]}>
                  {course.category}
                </Text>
              </View>
            </View>

            {/* Duration Badge */}
            <View style={tw`absolute top-3 right-3`}>
              <View style={tw`bg-black bg-opacity-50 px-3 py-1 rounded-full`}>
                <Text style={[
                  tw`text-white text-xs font-medium`,
                  { fontFamily: 'Poppins-Medium' }
                ]}>
                  {course.duration}
                </Text>
              </View>
            </View>

            {/* Play Button */}
            <View style={tw`absolute inset-0 items-center justify-center`}>
              <View style={tw`bg-white bg-opacity-20 w-16 h-16 rounded-full items-center justify-center`}>
                <Ionicons name="play" size={32} color="white" />
              </View>
            </View>

            {/* Like Button */}
            <Animated.View 
              style={[
                tw`absolute bottom-3 right-3`,
                { transform: [{ scale: getScaleAnimation(course.id) }] }
              ]}
            >
              <TouchableOpacity
                onPress={() => handleLike(course.id)}
                style={tw`bg-black bg-opacity-50 w-10 h-10 rounded-full items-center justify-center`}
              >
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isLiked ? COLORS.SECONDARY : "white"} 
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Course Content */}
          <View style={tw`p-4`}>
            {/* Title and Instructor */}
            <View style={tw`mb-3`}>
              <Text style={[
                tw`text-white text-lg font-bold mb-1`,
                { fontFamily: 'Poppins-Bold' }
              ]}>
                {course.title}
              </Text>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={{ uri: course.instructorImage }}
                  style={tw`w-6 h-6 rounded-full mr-2`}
                />
                <Text style={[
                  tw`text-gray-400 text-sm`,
                  { fontFamily: 'Poppins-Medium' }
                ]}>
                  {course.instructor}
                </Text>
              </View>
            </View>

            {/* Course Stats */}
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="people-outline" size={16} color={COLORS.TEXT_GRAY} />
                <Text style={[
                  tw`text-gray-400 text-sm ml-1`,
                  { fontFamily: 'Poppins-Medium' }
                ]}>
                  {course.studentsCount}
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="star" size={16} color={COLORS.ACCENT} />
                <Text style={[
                  tw`text-gray-400 text-sm ml-1`,
                  { fontFamily: 'Poppins-Medium' }
                ]}>
                  {course.rating}
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="time-outline" size={16} color={COLORS.TEXT_GRAY} />
                <Text style={[
                  tw`text-gray-400 text-sm ml-1`,
                  { fontFamily: 'Poppins-Medium' }
                ]}>
                  {course.expiryDate}
                </Text>
              </View>
            </View>

            {/* Price and Actions */}
            <View style={tw`flex-row justify-between items-center`}>
              <View>
                <Text style={[
                  tw`text-white text-xl font-bold`,
                  { fontFamily: 'Poppins-Bold' }
                ]}>
                  ₹{course.price}
                </Text>
                {course.originalPrice && (
                  <Text style={[
                    tw`text-gray-500 text-sm line-through`,
                    { fontFamily: 'Poppins-Medium' }
                  ]}>
                    ₹{course.originalPrice}
                  </Text>
                )}
              </View>
              
              <View style={tw`flex-row`}>
                <TouchableOpacity
                  onPress={() => handleShare(course)}
                  style={tw`bg-gray-700 p-2 rounded-lg mr-2`}
                >
                  <Ionicons name="share-outline" size={18} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => course.isPurchased ? null : handlePurchase(course)}
                  style={[
                    tw`px-4 py-2 rounded-lg`,
                    course.isPurchased 
                      ? tw`bg-green-600` 
                      : { backgroundColor: COLORS.PRIMARY }
                  ]}
                >
                  <Text style={[
                    tw`text-white font-bold text-sm`,
                    { fontFamily: 'Poppins-Bold' }
                  ]}>
                    {course.isPurchased ? 'Purchased' : 'Buy Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor: COLORS.BACKGROUND_DARK }]}>
      {/* Header */}
      <View style={tw`pt-12 pb-4 px-4`}>
        <Text style={[
          tw`text-white text-3xl font-bold`,
          { fontFamily: 'Poppins-Bold' }
        ]}>
          Courses
        </Text>
        <Text style={[
          tw`text-gray-400 text-base mt-1`,
          { fontFamily: 'Poppins-Medium' }
        ]}>
          Discover amazing courses to boost your learning
        </Text>
      </View>

      {/* Courses List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8`}
      >
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </ScrollView>
    </View>
  );
}