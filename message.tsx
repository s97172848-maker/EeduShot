import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from './constants/Colors';
import { useUser } from './contexts/UserContext';

interface Message {
  id: string;
  text: string;
  time: string;
  isTeacher: boolean;
  teacherName?: string;
}

interface TeacherMessage {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  course: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

interface StudyGroup {
  id: string;
  name: string;
  members: number;
  lastActivity: string;
  avatar: string;
  unread: number;
  teacherName: string;
  teacherAvatar: string;
  messages: Message[];
}

const teacherMessages: TeacherMessage[] = [
  {
    id: '1',
    teacherName: 'Dr. John Smith',
    teacherAvatar: '👨‍🏫',
    course: 'React Native Mastery',
    lastMessage: 'Great work on the UI design assignment! Keep up the excellent progress.',
    time: '2 min ago',
    unread: 2,
    online: true,
    messages: [
      {
        id: '1',
        text: 'Welcome to React Native Mastery course!',
        time: '10:00 AM',
        isTeacher: true,
      },
      {
        id: '2',
        text: 'Thank you for joining us.',
        time: '10:01 AM',
        isTeacher: true,
      },
      {
        id: '3',
        text: 'Great work on the UI design assignment! Keep up the excellent progress.',
        time: '2 min ago',
        isTeacher: true,
      },
    ]
  },
  {
    id: '2',
    teacherName: 'Prof. Sarah Wilson',
    teacherAvatar: '👩‍🎨',
    course: 'UI/UX Design',
    lastMessage: 'Your design portfolio is looking fantastic!',
    time: '1 hour ago',
    unread: 0,
    online: false,
    messages: [
      {
        id: '1',
        text: 'Hello everyone! Welcome to UI/UX Design.',
        time: '9:00 AM',
        isTeacher: true,
      },
      {
        id: '2',
        text: 'Your design portfolio is looking fantastic!',
        time: '1 hour ago',
        isTeacher: true,
      },
    ]
  },
  {
    id: '3',
    teacherName: 'Dr. Mike Chen',
    teacherAvatar: '👨‍💻',
    course: 'JavaScript Fundamentals',
    lastMessage: 'Remember to practice array methods daily.',
    time: '3 hours ago',
    unread: 1,
    online: true,
    messages: [
      {
        id: '1',
        text: 'Welcome to JavaScript Fundamentals!',
        time: '8:00 AM',
        isTeacher: true,
      },
      {
        id: '2',
        text: 'Remember to practice array methods daily.',
        time: '3 hours ago',
        isTeacher: true,
      },
    ]
  },
  {
    id: '4',
    teacherName: 'Prof. Emma Davis',
    teacherAvatar: '👩‍🎓',
    course: 'Data Science',
    lastMessage: 'Your data analysis project is approved!',
    time: '1 day ago',
    unread: 0,
    online: false,
    messages: [
      {
        id: '1',
        text: 'Welcome to Data Science course!',
        time: '7:00 AM',
        isTeacher: true,
      },
      {
        id: '2',
        text: 'Your data analysis project is approved!',
        time: '1 day ago',
        isTeacher: true,
      },
    ]
  },
];

const studyGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'React Native Study Group',
    members: 24,
    lastActivity: '5 min ago',
    avatar: '⚛️',
    unread: 5,
    teacherName: 'Dr. John Smith',
    teacherAvatar: '👨‍🏫',
    messages: [
      {
        id: '1',
        text: 'Welcome to React Native Study Group!',
        time: '9:00 AM',
        isTeacher: true,
        teacherName: 'Dr. John Smith',
      },
      {
        id: '2',
        text: 'Today we will discuss React Native navigation.',
        time: '5 min ago',
        isTeacher: true,
        teacherName: 'Dr. John Smith',
      },
    ]
  },
  {
    id: '2',
    name: 'Design Community',
    members: 18,
    lastActivity: '1 hour ago',
    avatar: '🎨',
    unread: 2,
    teacherName: 'Prof. Sarah Wilson',
    teacherAvatar: '👩‍🎨',
    messages: [
      {
        id: '1',
        text: 'Welcome to Design Community!',
        time: '8:00 AM',
        isTeacher: true,
        teacherName: 'Prof. Sarah Wilson',
      },
      {
        id: '2',
        text: 'Let\'s share our latest design inspirations.',
        time: '1 hour ago',
        isTeacher: true,
        teacherName: 'Prof. Sarah Wilson',
      },
    ]
  },
  {
    id: '3',
    name: 'JavaScript Coders',
    members: 32,
    lastActivity: '2 hours ago',
    avatar: '💻',
    unread: 0,
    teacherName: 'Dr. Mike Chen',
    teacherAvatar: '👨‍💻',
    messages: [
      {
        id: '1',
        text: 'Welcome to JavaScript Coders group!',
        time: '7:00 AM',
        isTeacher: true,
        teacherName: 'Dr. Mike Chen',
      },
      {
        id: '2',
        text: 'Today\'s topic: Advanced JavaScript concepts.',
        time: '2 hours ago',
        isTeacher: true,
        teacherName: 'Dr. Mike Chen',
      },
    ]
  },
];

export default function MessageScreen() {
  const { width, height } = useWindowDimensions();
  const { userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('teachers');
  const [selectedConversation, setSelectedConversation] = useState<TeacherMessage | StudyGroup | null>(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);

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

  const handleConversationPress = (conversation: TeacherMessage | StudyGroup) => {
    setSelectedConversation(conversation);
    setShowMessageDetail(true);
  };

  const renderTeacherMessage = ({ item }: { item: TeacherMessage }) => (
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
      <TouchableOpacity 
        style={tw`flex-row items-center`}
        onPress={() => handleConversationPress(item)}
      >
        <View style={tw`relative`}>
          <View
            style={[
              tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
              { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            ]}
          >
            <Text style={tw`text-2xl`}>{item.teacherAvatar}</Text>
          </View>
          {item.online && (
            <View
              style={[
                tw`absolute bottom-0 right-3 w-3 h-3 rounded-full border-2`,
                {
                  backgroundColor: themeColor,
                  borderColor: COLORS.BACKGROUND_DARK,
                },
              ]}
            />
          )}
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
              {item.teacherName}
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
              {item.time}
            </Text>
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
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>

          <View style={tw`flex-row items-center justify-between`}>
            <Text
              style={[
                tw`text-xs`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: themeColor,
                },
              ]}
            >
              {item.course}
            </Text>
            {item.unread > 0 && (
              <View
                style={[
                  tw`w-5 h-5 rounded-full items-center justify-center`,
                  { backgroundColor: themeColor },
                ]}
              >
                <Text
                  style={[
                    tw`text-xs font-bold`,
                    {
                      fontFamily: 'Poppins-Bold',
                      color: COLORS.TEXT_WHITE,
                    },
                  ]}
                >
                  {item.unread}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStudyGroup = ({ item }: { item: StudyGroup }) => (
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
      <TouchableOpacity 
        style={tw`flex-row items-center`}
        onPress={() => handleConversationPress(item)}
      >
        <View
          style={[
            tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
            { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          ]}
        >
          <Text style={tw`text-2xl`}>{item.avatar}</Text>
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
              {item.name}
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
              {item.lastActivity}
            </Text>
          </View>

          <View style={tw`flex-row items-center justify-between`}>
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
              {item.members} members • {item.teacherName}
            </Text>
            {item.unread > 0 && (
              <View
                style={[
                  tw`w-5 h-5 rounded-full items-center justify-center`,
                  { backgroundColor: COLORS.SECONDARY },
                ]}
              >
                <Text
                  style={[
                    tw`text-xs font-bold`,
                    {
                      fontFamily: 'Poppins-Bold',
                      color: COLORS.TEXT_WHITE,
                    },
                  ]}
                >
                  {item.unread}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={tw`mb-4`}>
      <View style={tw`flex-row items-start`}>
        <View
          style={[
            tw`w-8 h-8 rounded-full items-center justify-center mr-3 mt-1`,
            { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          ]}
        >
          <Text style={tw`text-lg`}>
            {selectedConversation && ('teacherAvatar' in selectedConversation ? selectedConversation.teacherAvatar : (selectedConversation as StudyGroup).avatar)}
          </Text>
        </View>
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center mb-1`}>
            <Text
              style={[
                tw`font-semibold mr-2`,
                {
                  fontFamily: 'Poppins-SemiBold',
                  color: themeColor,
                  fontSize: isSmallScreen ? 12 : 14,
                },
              ]}
            >
              {item.teacherName || selectedConversation?.teacherName}
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
              {item.time}
            </Text>
          </View>
          <View
            style={[
              tw`p-3 rounded-lg`,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 13 : 15,
                },
              ]}
            >
              {item.text}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const MessageDetailModal = () => (
    <Modal
      visible={showMessageDetail}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={tw`flex-1`}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
        
        {/* Background Gradient */}
        <LinearGradient
          colors={GRADIENTS.BACKGROUND}
          style={tw`absolute inset-0`}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Header */}
        <View
          style={[
            tw`flex-row items-center p-4 border-b`,
            {
              borderBottomColor: 'rgba(255, 255, 255, 0.1)',
              borderBottomWidth: 1,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setShowMessageDetail(false)}
            style={tw`mr-3`}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_WHITE} />
          </TouchableOpacity>
          
          <View
            style={[
              tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
              { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            ]}
          >
            <Text style={tw`text-xl`}>
              {selectedConversation && ('teacherAvatar' in selectedConversation ? selectedConversation.teacherAvatar : (selectedConversation as StudyGroup).avatar)}
            </Text>
          </View>
          
          <View style={tw`flex-1`}>
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
              {selectedConversation && ('teacherName' in selectedConversation ? selectedConversation.teacherName : (selectedConversation as StudyGroup).name)}
            </Text>
            <Text
              style={[
                tw`text-xs`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY_LIGHT,
                },
              ]}
            >
              {selectedConversation && ('course' in selectedConversation ? selectedConversation.course : `${(selectedConversation as StudyGroup).members} members`)}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={selectedConversation?.messages || []}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={tw`flex-1`}
          contentContainerStyle={tw`p-4`}
          showsVerticalScrollIndicator={false}
        />

        {/* Read Only Notice */}
        <View
          style={[
            tw`p-4 border-t`,
            {
              borderTopColor: 'rgba(255, 255, 255, 0.1)',
              borderTopWidth: 1,
            },
          ]}
        >
          <View
            style={[
              tw`p-3 rounded-lg items-center`,
              { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
            ]}
          >
            <Ionicons name="eye" size={20} color={COLORS.TEXT_GRAY} />
            <Text
              style={[
                tw`text-sm mt-1 text-center`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY,
                },
              ]}
            >
              Read Only - Students can only view messages
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={tw`flex-1`}>
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
              Messages
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
              View teacher messages and study groups
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
              placeholder="Search messages..."
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        {/* Tab Buttons */}
        <Animated.View
          style={[
            tw`px-4 mb-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={tw`flex-row bg-gray-800 rounded-xl p-1`}>
            <TouchableOpacity
              onPress={() => setSelectedTab('teachers')}
              style={[
                tw`flex-1 py-3 px-4 rounded-lg items-center`,
                {
                  backgroundColor: selectedTab === 'teachers' ? themeColor : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  tw`font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: selectedTab === 'teachers' ? COLORS.TEXT_WHITE : COLORS.TEXT_GRAY_LIGHT,
                    fontSize: isSmallScreen ? 12 : 14,
                  },
                ]}
              >
                Teachers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab('groups')}
              style={[
                tw`flex-1 py-3 px-4 rounded-lg items-center`,
                {
                  backgroundColor: selectedTab === 'groups' ? themeColor : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  tw`font-semibold`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: selectedTab === 'groups' ? COLORS.TEXT_WHITE : COLORS.TEXT_GRAY_LIGHT,
                    fontSize: isSmallScreen ? 12 : 14,
                  },
                ]}
              >
                Study Groups
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={[
            tw`flex-1`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {selectedTab === 'teachers' ? (
            <>
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
                Teacher Messages
              </Text>
              {teacherMessages.map((item) => renderTeacherMessage({ item }))}
            </>
          ) : (
            <>
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
                Study Groups
              </Text>
              {studyGroups.map((item) => renderStudyGroup({ item }))}
            </>
          )}
        </Animated.View>

        {/* Read Only Notice */}
        <Animated.View
          style={[
            tw`mx-4 mt-6 p-4 rounded-xl`,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={tw`flex-row items-center`}>
            <Ionicons name="eye" size={24} color={COLORS.TEXT_GRAY} />
            <View style={tw`ml-3 flex-1`}>
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
                Read Only Mode
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
                Students can only view messages from teachers and study groups
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Message Detail Modal */}
      <MessageDetailModal />
    </View>
    </SafeAreaView>
  );
} 