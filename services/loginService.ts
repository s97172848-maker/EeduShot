import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = 'http://93.127.213.176:3002/api';

// Types for API Response
interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student';
    isVerified: boolean;
  };
  message?: string;
}

interface ApiError {
  message: string;
  error?: string;
}

class LoginService {
  /**
   * Test the login API with your provided credentials
   * This function helps verify the API response format
   */
  async testLoginAPI(): Promise<void> {
    try {
      console.log('🧪 Testing login API...');
      
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "email": "naman101@gmail.com",
        "password": "123456"
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      };

      const response = await fetch(`${API_BASE_URL}/users/login`, requestOptions);
      const result = await response.text();
      
      console.log('📥 Raw API Response:', result);
      console.log('📊 Response Status:', response.status);
      console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
      
      // Try to parse as JSON
      try {
        const jsonResult = JSON.parse(result);
        console.log('✅ Parsed JSON Response:', jsonResult);
      } catch (parseError) {
        console.log('❌ Failed to parse as JSON:', parseError);
      }
      
    } catch (error) {
      console.error('💥 Test API Error:', error);
    }
  }

  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('🔐 Starting login process...');
      console.log('📧 Email:', email);
      console.log('🔒 Password length:', password.length);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email,
        password
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      };

      console.log('🚀 Making request to:', `${API_BASE_URL}/users/login`);
      
      const response = await fetch(`${API_BASE_URL}/users/login`, requestOptions);
      const responseText = await response.text();
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response text:', responseText);

      // Parse the response
      let responseData: any;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        throw new Error('Invalid response format from server');
      }

      // Check if request was successful
      if (!response.ok) {
        const errorMessage = responseData.message || responseData.error || 'Login failed';
        console.error('❌ Login failed:', errorMessage);
        throw new Error(errorMessage);
      }

      // Validate response structure
      if (!responseData.token || !responseData.user) {
        console.error('❌ Invalid response structure:', responseData);
        throw new Error('Invalid response from server - missing token or user data');
      }

      // Save authentication data
      await this.saveAuthData(responseData.token, responseData.user);
      
      console.log('✅ Login successful!');
      console.log('👤 User:', responseData.user);
      console.log('🔑 Token saved');

      return responseData as LoginResponse;

    } catch (error) {
      console.error('💥 Login error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          throw new Error('Cannot connect to server. Please check your internet connection.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred during login');
    }
  }

  /**
   * Save authentication data to AsyncStorage
   */
  private async saveAuthData(token: string, user: any): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      console.log('💾 Auth data saved successfully');
    } catch (error) {
      console.error('❌ Failed to save auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Get stored authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('❌ Failed to get token:', error);
      return null;
    }
  }

  /**
   * Get stored user data
   */
  async getUserData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Failed to get user data:', error);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      console.log('🗑️ Auth data cleared');
    } catch (error) {
      console.error('❌ Failed to clear auth data:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      const userData = await this.getUserData();
      return !!(token && userData);
    } catch (error) {
      console.error('❌ Failed to check auth status:', error);
      return false;
    }
  }
}

export const loginService = new LoginService();
export default loginService;
