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
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../../constants/Colors';
import { useUser } from '../../contexts/UserContext';

const paymentMethods = [
  {
    id: '1',
    name: 'Bank Transfer',
    icon: '🏦',
    description: 'Transfer to your bank account',
    color: COLORS.PRIMARY,
  },
  {
    id: '2',
    name: 'PayPal',
    icon: '💳',
    description: 'Withdraw to PayPal account',
    color: COLORS.SECONDARY,
  },
  {
    id: '3',
    name: 'Stripe',
    icon: '💳',
    description: 'Direct card withdrawal',
    color: COLORS.ACCENT,
  },
];

export default function WithdrawMoneyScreen() {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [accountDetails, setAccountDetails] = useState('');

  const { userRoleColor } = useUser();
  
  // Define theme color based on selected role
  const themeColor = userRoleColor || COLORS.PRIMARY;

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

  const handleWithdraw = () => {
    if (!amount || !selectedMethod || !accountDetails) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < 10) {
      Alert.alert('Error', 'Minimum withdrawal amount is $10');
      return;
    }

    if (numAmount > 1000) {
      Alert.alert('Error', 'Maximum withdrawal amount is $1000');
      return;
    }

    Alert.alert(
      'Confirm Withdrawal',
      `Are you sure you want to withdraw $${amount} to ${selectedMethod}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Withdraw',
          onPress: () => {
            Alert.alert(
              'Success',
              'Withdrawal request submitted successfully! You will receive the money within 3-5 business days.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setAmount('');
                    setSelectedMethod('');
                    setAccountDetails('');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const renderPaymentMethod = (method: any) => (
    <TouchableOpacity
      key={method.id}
      onPress={() => setSelectedMethod(method.name)}
      style={[
        tw`mx-4 mb-3 p-4 rounded-xl`,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 2,
          borderColor: selectedMethod === method.name ? method.color : 'rgba(255, 255, 255, 0.1)',
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={tw`flex-row items-center`}>
        <View
          style={[
            tw`w-12 h-12 rounded-full items-center justify-center mr-3`,
            { backgroundColor: `${method.color}20` },
          ]}
        >
          <Text style={tw`text-2xl`}>{method.icon}</Text>
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
            {method.name}
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
            {method.description}
          </Text>
        </View>
        {selectedMethod === method.name && (
          <Ionicons name="checkmark-circle" size={24} color={method.color} />
        )}
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
              Withdraw Money
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
              Withdraw your earnings
            </Text>
          </View>
        </Animated.View>

        {/* Balance Card */}
        <Animated.View
          style={[
            tw`mx-4 mt-6 p-6 rounded-xl`,
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
            colors={[themeColor + '20', 'rgba(255, 255, 255, 0.05)']}
            style={tw`p-4 rounded-lg`}
          >
            <Text
              style={[
                tw`text-center mb-2`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_GRAY_LIGHT,
                  fontSize: isSmallScreen ? 14 : 16,
                },
              ]}
            >
              Available Balance
            </Text>
            <Text
              style={[
                tw`text-center font-bold`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 32 : 36,
                },
              ]}
            >
              $2,450.00
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
              Minimum withdrawal: $10
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Amount Input */}
        <Animated.View
          style={[
            tw`mx-4 mt-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={[
              tw`font-semibold mb-2`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.TEXT_WHITE,
                fontSize: isSmallScreen ? 14 : 16,
              },
            ]}
          >
            Withdrawal Amount
          </Text>
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
            <Text
              style={[
                tw`font-bold mr-2`,
                {
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 16 : 18,
                },
              ]}
            >
              $
            </Text>
            <TextInput
              style={[
                tw`flex-1`,
                {
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 16 : 18,
                },
              ]}
              placeholder="0.00"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </Animated.View>

        {/* Payment Methods */}
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
            Payment Method
          </Text>
          {paymentMethods.map(renderPaymentMethod)}
        </Animated.View>

        {/* Account Details */}
        {selectedMethod && (
          <Animated.View
            style={[
              tw`mx-4 mt-6`,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text
              style={[
                tw`font-semibold mb-2`,
                {
                  fontFamily: 'Poppins-SemiBold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 14 : 16,
                },
              ]}
            >
              {selectedMethod === 'Bank Transfer' ? 'Bank Account Details' : 
               selectedMethod === 'PayPal' ? 'PayPal Email' : 'Card Details'}
            </Text>
            <TextInput
              style={[
                tw`rounded-xl px-4 py-3`,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 14 : 16,
                },
              ]}
              placeholder={
                selectedMethod === 'Bank Transfer' ? 'Enter bank account number' :
                selectedMethod === 'PayPal' ? 'Enter PayPal email' : 'Enter card number'
              }
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={accountDetails}
              onChangeText={setAccountDetails}
            />
          </Animated.View>
        )}

        {/* Withdraw Button */}
        <Animated.View
          style={[
            tw`mx-4 mt-6`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleWithdraw}
            style={[
              tw`py-4 px-6 rounded-xl items-center`,
              { backgroundColor: themeColor },
            ]}
          >
            <Text
              style={[
                tw`font-semibold`,
                {
                  fontFamily: 'Poppins-SemiBold',
                  color: COLORS.TEXT_WHITE,
                  fontSize: isSmallScreen ? 16 : 18,
                },
              ]}
            >
              Withdraw Money
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 