import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

const faqData = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'Go to your profile settings and select "Change Password". You can reset your password by entering your current password and setting a new one.',
    category: 'Account',
  },
  {
    id: '2',
    question: 'How do I download course videos?',
    answer: 'While watching a video, tap the download icon in the video player. Videos will be saved to your device for offline viewing.',
    category: 'Courses',
  },
  {
    id: '3',
    question: 'Can I get a refund for a course?',
    answer: 'Yes, you can request a refund within 30 days of purchase. Contact our support team with your order details.',
    category: 'Payment',
  },
  {
    id: '4',
    question: 'How do I contact my instructor?',
    answer: 'You can message your instructor through the Messages tab. They typically respond within 24-48 hours.',
    category: 'Communication',
  },
  {
    id: '5',
    question: 'What payment methods are accepted?',
    answer: 'We accept credit cards, debit cards, PayPal, and bank transfers for course purchases.',
    category: 'Payment',
  },
  {
    id: '6',
    question: 'How do I earn certificates?',
    answer: 'Complete all course modules and pass the final assessment to earn your certificate. Certificates are automatically generated.',
    category: 'Certificates',
  },
];

const supportOptions = [
  {
    id: '1',
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: 'chatbubbles',
    color: COLORS.PRIMARY,
    action: 'chat',
  },
  {
    id: '2',
    title: 'Email Support',
    description: 'Send us an email',
    icon: 'mail',
    color: COLORS.SECONDARY,
    action: 'email',
  },
  {
    id: '3',
    title: 'Phone Support',
    description: 'Call us directly',
    icon: 'call',
    color: COLORS.ACCENT,
    action: 'phone',
  },
  {
    id: '4',
    title: 'FAQ',
    description: 'Browse common questions',
    icon: 'help-circle',
    color: COLORS.PRIMARY,
    action: 'faq',
  },
];

const categories = [
  { id: 'all', name: 'All', icon: 'list' },
  { id: 'Account', name: 'Account', icon: 'person' },
  { id: 'Courses', name: 'Courses', icon: 'library' },
  { id: 'Payment', name: 'Payment', icon: 'card' },
  { id: 'Communication', name: 'Communication', icon: 'chatbubbles' },
  { id: 'Certificates', name: 'Certificates', icon: 'ribbon' },
];

export default function HelpSupportScreen() {
  const { width, height } = useWindowDimensions();
  const { userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [filteredFaq, setFilteredFaq] = useState(faqData);

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
    if (selectedCategory === 'all') {
      setFilteredFaq(faqData);
    } else {
      const filtered = faqData.filter(faq => faq.category === selectedCategory);
      setFilteredFaq(filtered);
    }
  }, [selectedCategory]);

  const handleSupportAction = (action: string) => {
    switch (action) {
      case 'chat':
        Alert.alert('Live Chat', 'Connecting you to our support team...');
        break;
      case 'email':
        Alert.alert('Email Support', 'Opening email client...');
        break;
      case 'phone':
        Alert.alert('Phone Support', 'Calling support: +1-800-EDUSPARK');
        break;
      case 'faq':
        // Scroll to FAQ section
        break;
    }
  };

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const renderSupportOption = (option: any) => (
    <TouchableOpacity
      key={option.id}
      onPress={() => handleSupportAction(option.action)}
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
            { backgroundColor: `${option.color}20` },
          ]}
        >
          <Ionicons name={option.icon as any} size={24} color={option.color} />
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
          >
            {option.title}
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
            {option.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT_GRAY} />
      </View>
    </TouchableOpacity>
  );

  const renderFaqItem = (faq: any) => (
    <Animated.View
      key={faq.id}
      style={[
        tw`mx-4 mb-3`,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => toggleFaq(faq.id)}
        style={tw`p-4`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <Text
            style={[
              tw`font-semibold flex-1 mr-3`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.TEXT_WHITE,
                fontSize: isSmallScreen ? 14 : 16,
              },
            ]}
          >
            {faq.question}
          </Text>
          <Ionicons
            name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORS.TEXT_GRAY}
          />
        </View>
      </TouchableOpacity>
      
      {expandedFaq === faq.id && (
        <Animated.View
          style={[
            tw`px-4 pb-4`,
            {
              borderTopWidth: 1,
              borderTopColor: 'rgba(255, 255, 255, 0.1)',
            },
          ]}
        >
          <Text
            style={[
              tw`text-sm mt-3`,
              {
                fontFamily: 'Poppins-Medium',
                color: COLORS.TEXT_GRAY_LIGHT,
                fontSize: isSmallScreen ? 12 : 14,
                lineHeight: 20,
              },
            ]}
          >
            {faq.answer}
          </Text>
        </Animated.View>
      )}
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
              Help & Support
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
              We're here to help you
            </Text>
          </View>
        </Animated.View>

        {/* Support Options */}
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
                fontSize: isSmallScreen ? 16 : 18,
              },
            ]}
          >
            Get Help
          </Text>
          {supportOptions.map(renderSupportOption)}
        </Animated.View>

        {/* FAQ Section */}
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
                fontSize: isSmallScreen ? 16 : 18,
              },
            ]}
          >
            Frequently Asked Questions
          </Text>

          {/* Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          >
            {categories.map(renderCategoryButton)}
          </ScrollView>

          {/* FAQ Items */}
          {filteredFaq.length > 0 ? (
            filteredFaq.map(renderFaqItem)
          ) : (
            <View style={tw`mx-4 p-8 items-center`}>
              <Ionicons name="help-circle-outline" size={64} color={COLORS.TEXT_GRAY} />
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
                No Questions Found
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
                No questions found for this category
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Contact Info */}
        <Animated.View
          style={[
            tw`mx-4 mt-6 p-4 rounded-xl`,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={[
              tw`font-bold mb-3 text-center`,
              {
                fontFamily: 'Poppins-Bold',
                color: COLORS.TEXT_WHITE,
                fontSize: isSmallScreen ? 16 : 18,
              },
            ]}
          >
            Still Need Help?
          </Text>
          <Text
            style={[
              tw`text-center mb-3`,
              {
                fontFamily: 'Poppins-Medium',
                color: COLORS.TEXT_GRAY_LIGHT,
                fontSize: isSmallScreen ? 12 : 14,
              },
            ]}
          >
            Our support team is available 24/7 to assist you
          </Text>
          <View style={tw`flex-row justify-center space-x-4`}>
            <Text
              style={[
                tw`text-sm`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: themeColor,
                  fontSize: isSmallScreen ? 12 : 14,
                },
              ]}
            >
              Email: support@eduspark.com
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 