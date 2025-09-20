import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import http from '../../services/http';

export type Role = 'teacher' | 'student';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    params: { email: string; password: string; role: Role },
    { rejectWithValue }
  ) => {
    try {
      const res = await http.post('/users/login', {
        email: params.email,
        password: params.password,
      });
      const { token, user } = res.data;
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      return { token, user } as { token: string; user: User };
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Login failed';
      return rejectWithValue(msg);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (
    params: { name: string; email: string; password: string; role: Role },
    { rejectWithValue }
  ) => {
    try {
      console.log('🔐 Auth Slice: Starting registration...');
      console.log('🔐 Auth Slice: Registration params:', { 
        name: params.name, 
        email: params.email, 
        password: '***', 
        role: params.role 
      });
      
      const response = await http.post('/users/register', {
        name: params.name,
        email: params.email,
        password: params.password,
        role: params.role,
      });
      
      console.log('✅ Auth Slice: Registration response:', response.data);
      return true;
    } catch (e: any) {
      console.error('❌ Auth Slice: Registration error:', e);
      console.error('❌ Auth Slice: Error response:', e?.response?.data);
      const msg = e?.response?.data?.message || e.message || 'Registration failed';
      return rejectWithValue(msg);
    }
  }
);

export const sendOtpThunk = createAsyncThunk(
  'auth/sendOtp',
  async (params: { email: string }, { rejectWithValue }) => {
    try {
      console.log('📧 Auth Slice: Sending OTP...');
      console.log('📧 Auth Slice: Email:', params.email);
      
      const response = await http.post('/users/send-otp', params);
      console.log('✅ Auth Slice: Send OTP response:', response.data);
      return true;
    } catch (e: any) {
      console.error('❌ Auth Slice: Send OTP error:', e);
      console.error('❌ Auth Slice: Error response:', e?.response?.data);
      const msg = e?.response?.data?.message || e.message || 'Send OTP failed';
      return rejectWithValue(msg);
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async (params: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      console.log('🔍 Auth Slice: Verifying OTP...');
      console.log('🔍 Auth Slice: Email:', params.email, 'OTP:', params.otp);
      
      const response = await http.post('/users/verify-otp', { otp: params.otp });
      console.log('✅ Auth Slice: Verify OTP response:', response.data);
      return true;
    } catch (e: any) {
      console.error('❌ Auth Slice: Verify OTP error:', e);
      console.error('❌ Auth Slice: Error response:', e?.response?.data);
      const msg = e?.response?.data?.message || e.message || 'OTP verification failed';
      return rejectWithValue(msg);
    }
  }
);

export const resendOtpThunk = createAsyncThunk(
  'auth/resendOtp',
  async (params: { email: string }, { rejectWithValue }) => {
    try {
      console.log('🔄 Auth Slice: Resending OTP...');
      console.log('🔄 Auth Slice: Email:', params.email);
      
      const response = await http.post('/users/send-otp', params);
      console.log('✅ Auth Slice: Resend OTP response:', response.data);
      return true;
    } catch (e: any) {
      console.error('❌ Auth Slice: Resend OTP error:', e);
      console.error('❌ Auth Slice: Error response:', e?.response?.data);
      const msg = e?.response?.data?.message || e.message || 'Resend OTP failed';
      return rejectWithValue(msg);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (params: { email: string }, { rejectWithValue }) => {
    try {
      await http.post('/users/forgot-password', params);
      return true;
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Forgot password failed';
      return rejectWithValue(msg);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async (params: { email: string; otp: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await http.post('/users/reset-password', params);
      return true;
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Reset password failed';
      return rejectWithValue(msg);
    }
  }
);

export const getProfileThunk = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await http.get('/auth/me');
    return res.data.user as User;
  } catch (e: any) {
    const msg = e?.response?.data?.message || e.message || 'Fetch profile failed';
    return rejectWithValue(msg);
  }
});

export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (params: { name: string }, { rejectWithValue }) => {
    try {
      const res = await http.put('/auth/me', params);
      return res.data.user as User;
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Update profile failed';
      return rejectWithValue(msg);
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (params: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await http.post('/auth/change-password', params);
      return true;
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Change password failed';
      return rejectWithValue(msg);
    }
  }
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<{ token: string | null; user: User | null }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logoutSuccess(state) {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || 'Login failed';
      })
      .addCase(getProfileThunk.fulfilled, (s, a) => {
        if (s.user) s.user = { ...s.user, ...a.payload };
        else s.user = a.payload;
      })
      .addCase(updateProfileThunk.fulfilled, (s, a) => {
        if (s.user) s.user = { ...s.user, ...a.payload };
        else s.user = a.payload;
      });
  },
});

export const { setAuthState, logoutSuccess } = slice.actions;
export default slice.reducer;


