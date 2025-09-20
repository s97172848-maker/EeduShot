import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { COLORS, GRADIENTS } from '../constants/Colors';
import { useUser } from '../contexts/UserContext';

// Sample quiz questions
const quizQuestions = {
  '1': [ // React Native
    {
      id: 1,
      question: 'What is React Native?',
      options: [
        'A JavaScript library for building user interfaces',
        'A framework for building native mobile apps using React',
        'A database management system',
        'A programming language'
      ],
      correctAnswer: 1,
      explanation: 'React Native is a framework for building native mobile applications using React and JavaScript.'
    },
    {
      id: 2,
      question: 'Which component is used for navigation in React Native?',
      options: [
        'Navigator',
        'Router',
        'Stack Navigator',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'React Navigation provides various navigators including Stack Navigator for screen navigation.'
    },
    {
      id: 3,
      question: 'What is the purpose of useState hook?',
      options: [
        'To manage component state',
        'To handle side effects',
        'To optimize performance',
        'To create custom hooks'
      ],
      correctAnswer: 0,
      explanation: 'useState is a React hook that allows functional components to manage state.'
    },
    {
      id: 4,
      question: 'How do you style components in React Native?',
      options: [
        'Using CSS files',
        'Using StyleSheet API',
        'Using inline styles only',
        'Using external styling libraries only'
      ],
      correctAnswer: 1,
      explanation: 'React Native uses StyleSheet API for styling components, similar to CSS but with JavaScript objects.'
    },
    {
      id: 5,
      question: 'What is the difference between View and Text components?',
      options: [
        'View is for text, Text is for containers',
        'View is for containers, Text is for displaying text',
        'They are the same component',
        'View is deprecated, use Text instead'
      ],
      correctAnswer: 1,
      explanation: 'View is a container component similar to div, while Text is specifically for displaying text content.'
    }
  ],
  '2': [ // JavaScript
    {
      id: 1,
      question: 'What is the difference between let, const, and var?',
      options: [
        'They are all the same',
        'let and const are block-scoped, var is function-scoped',
        'const is mutable, let and var are immutable',
        'var is the newest, let and const are deprecated'
      ],
      correctAnswer: 1,
      explanation: 'let and const are block-scoped and introduced in ES6, while var is function-scoped and older.'
    },
    {
      id: 2,
      question: 'What is closure in JavaScript?',
      options: [
        'A way to close browser tabs',
        'A function that has access to variables in its outer scope',
        'A method to close database connections',
        'A way to end loops'
      ],
      correctAnswer: 1,
      explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.'
    },
    {
      id: 3,
      question: 'What does the map() method do?',
      options: [
        'Creates a new array with the results of calling a function for every array element',
        'Creates a map object',
        'Filters array elements',
        'Reduces array to a single value'
      ],
      correctAnswer: 0,
      explanation: 'map() creates a new array by calling a function for each element in the original array.'
    },
    {
      id: 4,
      question: 'What is the purpose of async/await?',
      options: [
        'To make code run faster',
        'To handle asynchronous operations more easily',
        'To create infinite loops',
        'To prevent errors'
      ],
      correctAnswer: 1,
      explanation: 'async/await is syntactic sugar for promises, making asynchronous code easier to read and write.'
    },
    {
      id: 5,
      question: 'What is the difference between == and ===?',
      options: [
        '== checks value and type, === checks only value',
        '== checks only value, === checks value and type',
        'They are identical',
        '== is deprecated, use === always'
      ],
      correctAnswer: 1,
      explanation: '== performs type coercion, while === checks both value and type (strict equality).'
    }
  ]
};

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const { userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const testId = params.testId as string;
  const questions = quizQuestions[testId as keyof typeof quizQuestions] || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Responsive sizing with calculated spacing system
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
    headerHeight: isSmallScreen ? 80 : isMediumScreen ? 90 : 100,
    cardPadding: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
    buttonHeight: isSmallScreen ? 48 : isMediumScreen ? 52 : 56,
    iconSize: isSmallScreen ? 20 : isMediumScreen ? 24 : 28,
    titleSize: isSmallScreen ? 18 : isMediumScreen ? 20 : 22,
    subtitleSize: isSmallScreen ? 14 : isMediumScreen ? 16 : 18,
    bodySize: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    captionSize: isSmallScreen ? 10 : isMediumScreen ? 12 : 14,
    optionHeight: isSmallScreen ? 56 : isMediumScreen ? 64 : 72,
    progressHeight: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
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

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isQuizComplete) {
      finishQuiz();
    }
  }, [timeLeft, isQuizComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (selectedAnswer === currentQuestion.correctAnswer && !showExplanation) {
      setScore(score + 1);
    }
    setIsQuizComplete(true);
  };

  const handleExitQuiz = () => {
    Alert.alert(
      'Exit Quiz',
      'Are you sure you want to exit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  const renderProgressBar = () => (
    <View style={[
      tw`mx-4 mb-6`,
      { marginTop: spacing.md }
    ]}>
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <Text
          style={[
            tw`font-semibold`,
            {
              fontFamily: 'Poppins-SemiBold',
              color: COLORS.TEXT_WHITE,
              fontSize: dimensions.captionSize,
            },
          ]}
        >
          Progress
        </Text>
        <Text
          style={[
            tw`font-semibold`,
            {
              fontFamily: 'Poppins-SemiBold',
              color: themeColor,
              fontSize: dimensions.captionSize,
            },
          ]}
        >
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>
      <View
        style={[
          tw`rounded-full overflow-hidden`,
          {
            height: dimensions.progressHeight,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        ]}
      >
        <Animated.View
          style={[
            tw`h-full rounded-full`,
            {
              backgroundColor: themeColor,
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );

  const renderQuestion = () => (
    <Animated.View
      style={[
        tw`mx-4 mb-6 rounded-2xl overflow-hidden`,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[themeColor + '10', 'rgba(255, 255, 255, 0.05)']}
        style={{ padding: dimensions.cardPadding }}
      >
        <View style={{ marginBottom: spacing.lg }}>
          <View style={[
            tw`flex-row items-center mb-3`,
            { marginBottom: spacing.md }
          ]}>
            <View
              style={[
                tw`rounded-full items-center justify-center mr-3`,
                {
                  width: dimensions.iconSize,
                  height: dimensions.iconSize,
                  backgroundColor: themeColor + '20',
                },
              ]}
            >
              <Ionicons name="help-circle" size={dimensions.iconSize - 8} color={themeColor} />
            </View>
            <Text
              style={[
                tw`font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: dimensions.titleSize,
                  lineHeight: dimensions.titleSize * 1.3,
                },
              ]}
            >
              Question {currentQuestionIndex + 1}
            </Text>
          </View>
          <Text
            style={[
              tw`font-semibold`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.TEXT_WHITE,
                fontSize: dimensions.subtitleSize,
                lineHeight: dimensions.subtitleSize * 1.4,
              },
            ]}
          >
            {currentQuestion.question}
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              style={[
                tw`rounded-xl border-2 overflow-hidden`,
                {
                  height: dimensions.optionHeight,
                  borderColor: selectedAnswer === index 
                    ? (index === currentQuestion.correctAnswer ? themeColor : '#FF3B30')
                    : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: selectedAnswer === index 
                    ? (index === currentQuestion.correctAnswer ? themeColor + '15' : 'rgba(255, 59, 48, 0.15)')
                    : 'rgba(255, 255, 255, 0.05)',
                },
              ]}
            >
              <View style={[
                tw`flex-row items-center h-full`,
                { paddingHorizontal: dimensions.cardPadding }
              ]}>
                <View
                  style={[
                    tw`rounded-full items-center justify-center mr-4`,
                    {
                      width: dimensions.iconSize,
                      height: dimensions.iconSize,
                      backgroundColor: selectedAnswer === index 
                        ? (index === currentQuestion.correctAnswer ? themeColor : '#FF3B30')
                        : 'rgba(255, 255, 255, 0.1)',
                    },
                  ]}
                >
                  {selectedAnswer === index && (
                    <Ionicons
                      name={index === currentQuestion.correctAnswer ? 'checkmark' : 'close'}
                      size={dimensions.iconSize - 8}
                      color={COLORS.TEXT_WHITE}
                    />
                  )}
                </View>
                <Text
                  style={[
                    tw`flex-1`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_WHITE,
                      fontSize: dimensions.bodySize,
                      lineHeight: dimensions.bodySize * 1.4,
                    },
                  ]}
                >
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedAnswer !== null && (
          <Animated.View
            style={[
              tw`mt-6 p-4 rounded-xl`,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            ]}
          >
            <View style={tw`flex-row items-center mb-3`}>
              <Ionicons
                name={selectedAnswer === currentQuestion.correctAnswer ? 'checkmark-circle' : 'close-circle'}
                size={dimensions.iconSize}
                color={selectedAnswer === currentQuestion.correctAnswer ? themeColor : '#FF3B30'}
                style={{ marginRight: spacing.sm }}
              />
              <Text
                style={[
                  tw`font-bold`,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: selectedAnswer === currentQuestion.correctAnswer ? themeColor : '#FF3B30',
                    fontSize: dimensions.subtitleSize,
                  },
                ]}
              >
                {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
              </Text>
            </View>
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
              {currentQuestion.explanation}
            </Text>
          </Animated.View>
        )}
      </LinearGradient>
    </Animated.View>
  );

  const renderQuizComplete = () => (
    <Animated.View
      style={[
        tw`flex-1 justify-center items-center px-4`,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View
        style={[
          tw`p-8 rounded-2xl items-center`,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            maxWidth: isSmallScreen ? width - 32 : isMediumScreen ? 400 : 450,
          },
        ]}
      >
        <LinearGradient
          colors={[themeColor + '20', 'rgba(255, 255, 255, 0.05)']}
          style={[
            tw`p-6 rounded-xl items-center`,
            { marginBottom: spacing.lg }
          ]}
        >
          <View
            style={[
              tw`rounded-full items-center justify-center mb-6`,
              {
                width: dimensions.iconSize * 2.5,
                height: dimensions.iconSize * 2.5,
                backgroundColor: themeColor + '20',
              },
            ]}
          >
            <Ionicons name="trophy" size={dimensions.iconSize * 1.5} color={themeColor} />
          </View>
          
          <Text
            style={[
              tw`font-bold text-center mb-2`,
              {
                fontFamily: 'Poppins-Bold',
                color: COLORS.TEXT_WHITE,
                fontSize: dimensions.titleSize + 4,
                lineHeight: (dimensions.titleSize + 4) * 1.2,
              },
            ]}
          >
            Quiz Complete!
          </Text>
          
          <Text
            style={[
              tw`text-center mb-6`,
              {
                fontFamily: 'Poppins-Medium',
                color: COLORS.TEXT_GRAY_LIGHT,
                fontSize: dimensions.subtitleSize,
                lineHeight: dimensions.subtitleSize * 1.4,
              },
            ]}
          >
            You scored {score} out of {questions.length} questions correctly
          </Text>
          
          <View
            style={[
              tw`px-8 py-4 rounded-full mb-6`,
              { backgroundColor: themeColor + '20' },
            ]}
          >
            <Text
              style={[
                tw`font-bold text-center`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: themeColor,
                  fontSize: dimensions.titleSize + 2,
                },
              ]}
            >
              {Math.round((score / questions.length) * 100)}%
            </Text>
          </View>
        </LinearGradient>
        
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            tw`py-4 px-8 rounded-xl`,
            {
              backgroundColor: themeColor,
              height: dimensions.buttonHeight,
              minWidth: 160,
            },
          ]}
        >
          <Text
            style={[
              tw`font-semibold text-center`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.TEXT_WHITE,
                fontSize: dimensions.subtitleSize,
              },
            ]}
          >
            Back to Tests
          </Text>
        </TouchableOpacity>
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

      {!isQuizComplete ? (
        <>
          {/* Header */}
          <Animated.View
            style={[
              tw`flex-row items-center justify-between`,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                paddingHorizontal: horizontalPadding,
                paddingVertical: spacing.lg,
                height: dimensions.headerHeight,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleExitQuiz}
              style={[
                tw`rounded-full items-center justify-center`,
                {
                  width: dimensions.iconSize + 8,
                  height: dimensions.iconSize + 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              ]}
            >
              <Ionicons name="close" size={dimensions.iconSize - 4} color={COLORS.TEXT_WHITE} />
            </TouchableOpacity>
            
            <View style={tw`items-center`}>
              <Text
                style={[
                  tw`font-bold`,
                  {
                    fontFamily: 'Poppins-Bold',
                    color: COLORS.TEXT_WHITE,
                    fontSize: dimensions.subtitleSize,
                  },
                ]}
              >
                Quiz
              </Text>
              <Text
                style={[
                  tw`text-xs`,
                  {
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.TEXT_GRAY_LIGHT,
                    fontSize: dimensions.captionSize,
                  },
                ]}
              >
                {formatTime(timeLeft)}
              </Text>
            </View>
            
            <View
              style={[
                tw`px-4 py-2 rounded-full`,
                { backgroundColor: themeColor + '20' },
              ]}
            >
              <Text
                style={[
                  tw`font-semibold text-xs`,
                  {
                    fontFamily: 'Poppins-SemiBold',
                    color: themeColor,
                    fontSize: dimensions.captionSize,
                  },
                ]}
              >
                {score}/{questions.length}
              </Text>
            </View>
          </Animated.View>

          {renderProgressBar()}

          <ScrollView
            style={tw`flex-1`}
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
            showsVerticalScrollIndicator={false}
          >
            {renderQuestion()}
            
            {selectedAnswer !== null && (
              <Animated.View
                style={[
                  tw`mx-4`,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={handleNextQuestion}
                  style={[
                    tw`rounded-xl items-center justify-center`,
                    {
                      backgroundColor: themeColor,
                      height: dimensions.buttonHeight,
                      paddingHorizontal: dimensions.cardPadding,
                    },
                  ]}
                >
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
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </ScrollView>
        </>
      ) : (
        renderQuizComplete()
      )}
    </View>
  );
} 