import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { COLORS } from '../constants/Colors';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.BACKGROUND_DARK }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={{ color: COLORS.TEXT_WHITE, marginTop: 16, fontFamily: 'Poppins-Medium' }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.BACKGROUND_DARK }}>
        <Text style={{ color: COLORS.TEXT_WHITE, fontFamily: 'Poppins-Medium' }}>
          Please login to continue
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};
