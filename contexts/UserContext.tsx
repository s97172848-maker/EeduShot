import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import apiService from '../services/api';
import loginService from '../services/loginService';
import { useAppDispatch } from '../store';
import { forgotPasswordThunk, getProfileThunk, loginThunk, registerThunk, resendOtpThunk, resetPasswordThunk, sendOtpThunk, setAuthState, verifyOtpThunk } from '../store/slices/auth.slice';

type UserRole = 'teacher' | 'student' | null;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  isVerified: boolean;
}

interface UserContextType {
  userRole: UserRole;
  userRoleColor: string;
  setUserRole: (role: UserRole, color: string) => void;
  isRoleSelected: boolean;
  setIsRoleSelected: (selected: boolean) => void;
  clearUserData: () => void;
  // Auth related
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  // Send OTP for email verification (before registration)
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  registerAfterVerification: (name: string, email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userRoleColor, setUserRoleColor] = useState<string>('');
  const [isRoleSelected, setIsRoleSelected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from AsyncStorage on app start
    loadUserData();
    checkAuthStatus();
  }, []);

  const loadUserData = async () => {
    try {
      const savedRole = await AsyncStorage.getItem('userRole');
      const savedColor = await AsyncStorage.getItem('userRoleColor');
      const roleSelected = await AsyncStorage.getItem('isRoleSelected');
      
      if (savedRole && (savedRole === 'teacher' || savedRole === 'student')) {
        setUserRole(savedRole as UserRole);
      }
      
      if (savedColor) {
        setUserRoleColor(savedColor);
      }
      
      if (roleSelected === 'true') {
        setIsRoleSelected(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await loginService.getToken();
      const userData = await loginService.getUserData();
      
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        dispatch(setAuthState({ token, user: userData }));
        dispatch(getProfileThunk());
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await loginService.clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUserRole = async (role: UserRole, color: string) => {
    try {
      setUserRole(role);
      setUserRoleColor(color);
      if (role) {
        await AsyncStorage.setItem('userRole', role);
        await AsyncStorage.setItem('userRoleColor', color);
        await AsyncStorage.setItem('isRoleSelected', 'true');
        setIsRoleSelected(true);
      }
    } catch (error) {
      console.error('Error saving user role:', error);
    }
  };

  const handleSetIsRoleSelected = async (selected: boolean) => {
    try {
      setIsRoleSelected(selected);
      await AsyncStorage.setItem('isRoleSelected', selected.toString());
    } catch (error) {
      console.error('Error saving role selection status:', error);
    }
  };

  const clearUserData = async () => {
    try {
      setUserRole(null);
      setUserRoleColor('');
      setIsRoleSelected(false);
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userRoleColor');
      await AsyncStorage.removeItem('isRoleSelected');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  // Authentication methods
  const login = async (email: string, password: string, role: 'teacher' | 'student') => {
    try {
      const action = await dispatch(loginThunk({ email, password, role }));
      if (loginThunk.fulfilled.match(action)) {
        setUser(action.payload.user);
        setIsAuthenticated(true);
      } else if (loginThunk.rejected.match(action)) {
        throw new Error(action.payload as string);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'teacher' | 'student') => {
    try {
      console.log('🔐 UserContext: Starting registration...');
      console.log('🔐 UserContext: Registration params:', { name, email, password: '***', role });
      const action = await dispatch(registerThunk({ name, email, password, role }));
      if (registerThunk.rejected.match(action)) {
        throw new Error(action.payload as string);
      }
      console.log('🔐 UserContext: Registration successful');
    } catch (error) {
      console.error('🔐 UserContext: Registration failed:', error);
      throw error;
    }
  };

  // Send OTP for email verification (before registration)
  const sendOtp = async (email: string) => {
    try {
      console.log('📮 UserContext: Sending OTP for email verification...');
      console.log('📮 UserContext: Email:', email);
      
      const otpAction = await dispatch(sendOtpThunk({ email }));
      if (sendOtpThunk.rejected.match(otpAction)) {
        console.error('❌ UserContext: Send OTP failed:', otpAction.payload);
        throw new Error(otpAction.payload as string);
      }
      console.log('✅ UserContext: OTP sent successfully for email verification');
    } catch (error) {
      console.error('💥 UserContext: Send OTP failed:', error);
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      console.log('🔍 UserContext: Verifying OTP...');
      console.log('🔍 UserContext: Email:', email, 'OTP:', otp);
      
      const action = await dispatch(verifyOtpThunk({ email, otp }));
      if (verifyOtpThunk.rejected.match(action)) {
        console.error('❌ UserContext: OTP verification failed:', action.payload);
        throw new Error(action.payload as string);
      }
      console.log('✅ UserContext: OTP verification successful');
    } catch (error) {
      console.error('💥 UserContext: OTP verification error:', error);
      throw error;
    }
  };

  // Register user after OTP verification
  const registerAfterVerification = async (name: string, email: string, password: string, role: 'teacher' | 'student') => {
    try {
      console.log('🔐 UserContext: Registering user after OTP verification...');
      console.log('🔐 UserContext: User data:', { name, email, password: '***', role });
      
      const action = await dispatch(registerThunk({ name, email, password, role }));
      if (registerThunk.rejected.match(action)) {
        console.error('❌ UserContext: Registration failed:', action.payload);
        throw new Error(action.payload as string);
      }
      console.log('✅ UserContext: Registration successful after OTP verification');
    } catch (error) {
      console.error('💥 UserContext: Registration failed:', error);
      throw error;
    }
  };


  const resendOtp = async (email: string) => {
    try {
      console.log('🔄 UserContext: Resending OTP...');
      console.log('🔄 UserContext: Email:', email);
      
      const action = await dispatch(resendOtpThunk({ email }));
      if (resendOtpThunk.rejected.match(action)) {
        console.error('❌ UserContext: Resend OTP failed:', action.payload);
        throw new Error(action.payload as string);
      }
      console.log('✅ UserContext: OTP resent successfully');
    } catch (error) {
      console.error('💥 UserContext: Resend OTP error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const action = await dispatch(forgotPasswordThunk({ email }));
      if (forgotPasswordThunk.rejected.match(action)) {
        throw new Error(action.payload as string);
      }
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      const action = await dispatch(resetPasswordThunk({ email, otp, newPassword }));
      if (resetPasswordThunk.rejected.match(action)) {
        throw new Error(action.payload as string);
      }
    } catch (error) {
      throw error;
    }
  };

  const value: UserContextType = {
    userRole,
    userRoleColor,
    setUserRole: handleSetUserRole,
    isRoleSelected,
    setIsRoleSelected: handleSetIsRoleSelected,
    clearUserData,
    // Auth related
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    sendOtp,
    verifyOtp,
    registerAfterVerification,
    resendOtp,
    logout,
    forgotPassword,
    resetPassword,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 