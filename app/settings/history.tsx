import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
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

const historyData = [
  {
    id: '1',
    type: 'course',
    title: 'React Native Mastery',
    description: 'Course completed',
    amount: null,
    date: '2024-01-15',
    time: '2:30 PM',
    status: 'completed',
    icon: '🎓',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Course Purchase',
    description: 'React Native Mastery',
    amount: 49.99,
    date: '2024-01-10',
    time: '10:15 AM',
    status: 'paid',
    icon: '💳',
  },
  {
    id: '3',
    type: 'withdrawal',
    title: 'Withdrawal',
    description: 'Bank Transfer',
    amount: -150.00,
    date: '2024-01-08',
    time: '3:45 PM',
    status: 'completed',
    icon: '🏦',
  },
  {
    id: '4',
    type: 'course',
    title: 'JavaScript Fundamentals',
    description: 'Course started',
    amount: null,
    date: '2024-01-05',
    time: '9:20 AM',
    status: 'in-progress',
    icon: '📚',
  },
  {
    id: '5',
    type: 'payment',
    title: 'Course Purchase',
    description: 'UI/UX Design',
    amount: 39.99,
    date: '2024-01-03',
    time: '1:30 PM',
    status: 'paid',
    icon: '💳',
  },
  {
    id: '6',
    type: 'withdrawal',
    title: 'Withdrawal',
    description: 'PayPal',
    amount: -75.50,
    date: '2023-12-28',
    time: '11:00 AM',
    status: 'completed',
    icon: '💳',
  },
  {
    id: '7',
    type: 'course',
    title: 'Data Science Basics',
    description: 'Course completed',
    amount: null,
    date: '2023-12-25',
    time: '4:15 PM',
    status: 'completed',
    icon: '🎓',
  },
  {
    id: '8',
    type: 'payment',
    title: 'Course Purchase',
    description: 'Data Science Basics',
    amount: 29.99,
    date: '2023-12-20',
    time: '2:00 PM',
    status: 'paid',
    icon: '💳',
  },
];

const filterOptions = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'courses', label: 'Courses', icon: 'library' },
  { id: 'payments', label: 'Payments', icon: 'card' },
  { id: 'withdrawals', label: 'Withdrawals', icon: 'trending-down' },
];

export default function HistoryScreen() {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredData, setFilteredData] = useState(historyData);

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
    if (selectedFilter === 'all') {
      setFilteredData(historyData);
    } else {
      const filtered = historyData.filter(item => item.type === selectedFilter);
      setFilteredData(filtered);
    }
  }, [selectedFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return themeColor;
      case 'in-progress':
        return COLORS.ACCENT;
      case 'paid':
        return COLORS.SECONDARY;
      default:
        return COLORS.TEXT_GRAY;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'paid':
        return 'Paid';
      default:
        return status;
    }
  };

  const renderHistoryItem = (item: any) => (
    <Animated.View
      key={item.id}
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
      <View style={tw`flex-row items-center`}>
        <View
          style={[
            tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
            { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          ]}
        >
          <Text style={tw`text-2xl`}>{item.icon}</Text>
        </View>
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center justify-between mb-1`}>
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
            {item.amount !== null && (
              <Text
                style={[
                  tw`font-bold`,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: item.amount > 0 ? COLORS.SECONDARY : COLORS.ACCENT,
                    fontSize: isSmallScreen ? 14 : 16,
                  },
                ]}
              >
                {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
              </Text>
            )}
          </View>
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
            {item.description}
          </Text>
          <View style={tw`flex-row items-center justify-between`}>
            <Text
              style={[
                tw`text-xs`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY,
                },
              ]}
            >
              {item.date} • {item.time}
            </Text>
            <View
              style={[
                tw`px-2 py-1 rounded-full`,
                { backgroundColor: getStatusColor(item.status) + '20' },
              ]}
            >
              <Text
                style={[
                  tw`text-xs font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: getStatusColor(item.status),
                  },
                ]}
              >
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderFilterButton = (filter: any) => (
    <TouchableOpacity
      key={filter.id}
      onPress={() => setSelectedFilter(filter.id)}
      style={[
        tw`px-4 py-2 rounded-lg mr-2`,
        {
          backgroundColor: selectedFilter === filter.id ? themeColor : 'rgba(255, 255, 255, 0.08)',
        },
      ]}
    >
      <View style={tw`flex-row items-center`}>
        <Ionicons
          name={filter.icon as any}
          size={16}
          color={selectedFilter === filter.id ? COLORS.TEXT_WHITE : COLORS.TEXT_GRAY}
        />
        <Text
          style={[
            tw`ml-1 font-semibold`,
            {
              fontFamily: 'Poppins-SemiBold',
              color: selectedFilter === filter.id ? COLORS.TEXT_WHITE : COLORS.TEXT_GRAY,
              fontSize: isSmallScreen ? 12 : 14,
            },
          ]}
        >
          {filter.label}
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
            onPress={router.back}
            style={[
              tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
              { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            ]}
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
              History
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
              Your activity history
            </Text>
          </View>
        </Animated.View>

        {/* Filter Buttons */}
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
            {filterOptions.map(renderFilterButton)}
          </ScrollView>
        </Animated.View>

        {/* History Items */}
        <Animated.View
          style={[
            tw`flex-1`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {filteredData.length > 0 ? (
            filteredData.map(renderHistoryItem)
          ) : (
            <View style={tw`mx-4 p-8 items-center`}>
              <Ionicons name="document-outline" size={64} color={COLORS.TEXT_GRAY} />
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
                No History Found
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
                No {selectedFilter === 'all' ? 'activities' : selectedFilter} found in your history
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
} 