import AsyncStorage from '@react-native-async-storage/async-storage';

// Use environment-specific API URL
// For React Native, use your computer's IP address instead of localhost
const API_BASE_URL = __DEV__ 
  ? 'http://93.127.213.176:3002/api'  // Development - use your server IP
  : 'http://93.127.213.176:3002/api'; // Production - change this to your server IP

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student';
    isVerified: boolean;
  };
}

interface RegisterResponse {
  message: string;
}

interface OtpResponse {
  message: string;
}

interface ApiError {
  message: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('🚀 Making request to:', url);
      console.log('📤 Request config:', {
        method: config.method || 'GET',
        headers: config.headers,
        body: config.body ? (typeof config.body === 'string' ? JSON.parse(config.body) : 'Stream/Blob') : undefined
      });
      
      const response = await fetch(url, config);
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);
      
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (!response.ok) {
        console.error('❌ Request failed with status:', response.status);
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('✅ Request successful');
      return data;
    } catch (error) {
      console.error('💥 API Error:', error);
      console.error('💥 Error type:', typeof error);
      console.error('💥 Error message:', error instanceof Error ? error.message : 'Unknown error');
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          console.error('🌐 Network request failed - possible causes:');
          console.error('   - Server not running');
          console.error('   - Wrong IP address');
          console.error('   - Firewall blocking connection');
          console.error('   - Devices not on same network');
          throw new Error('Cannot connect to server. Please check your internet connection and server status.');
        }
        throw new Error(error.message);
      }
      throw new Error('Network error occurred');
    }
  }

  // Login with role
  async login(email: string, password: string, role: 'teacher' | 'student'): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Register with role
  async register(name: string, email: string, password: string, role: 'teacher' | 'student'): Promise<RegisterResponse> {
    console.log('🔐 API Service: Starting user registration...');
    console.log('🔐 API Service: Registration data:', { name, email, password: '***', role });
    
    const response = await this.makeRequest<RegisterResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    
    console.log('✅ API Service: Registration successful:', response);
    return response;
  }

  // Send OTP for email verification (before registration)
  async sendOtp(email: string): Promise<OtpResponse> {
    console.log('📧 API Service: Sending OTP for email verification...');
    console.log('📧 API Service: Email:', email);
    
    const response = await this.makeRequest<OtpResponse>('/users/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    console.log('✅ API Service: OTP sent successfully:', response);
    return response;
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string): Promise<OtpResponse> {
    console.log('🔍 API Service: Verifying OTP...');
    console.log('🔍 API Service: Email:', email, 'OTP:', otp);
    
    const response = await this.makeRequest<OtpResponse>('/users/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
    
    console.log('✅ API Service: OTP verification successful:', response);
    return response;
  }

  // Resend OTP
  async resendOtp(email: string): Promise<OtpResponse> {
    console.log('🔄 API Service: Resending OTP...');
    console.log('🔄 API Service: Email:', email);
    
    const response = await this.makeRequest<OtpResponse>('/users/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    console.log('✅ API Service: OTP resent successfully:', response);
    return response;
  }

  // Forgot Password
  async forgotPassword(email: string): Promise<OtpResponse> {
    return this.makeRequest<OtpResponse>('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Reset Password
  async resetPassword(email: string, otp: string, newPassword: string): Promise<OtpResponse> {
    return this.makeRequest<OtpResponse>('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

  // Get user profile (requires token)
  async getProfile(): Promise<{ user: any }> {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.makeRequest<{ user: any }>('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Update user profile (requires token)
  async updateProfile(name: string): Promise<{ user: any }> {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.makeRequest<{ user: any }>('/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
  }

  // Change password (requires token)
  async changePassword(oldPassword: string, newPassword: string): Promise<OtpResponse> {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.makeRequest<OtpResponse>('/change-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  // Save authentication token
  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem('authToken', token);
  }

  // Get authentication token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  // Remove authentication token
  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
  }

  // Save user data
  async saveUserData(userData: any): Promise<void> {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  }

  // Get user data
  async getUserData(): Promise<any | null> {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  // Remove user data
  async removeUserData(): Promise<void> {
    await AsyncStorage.removeItem('userData');
  }

  // Clear all auth data
  async clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove(['authToken', 'userData']);
  }
}

export const apiService = new ApiService();
export default apiService;
