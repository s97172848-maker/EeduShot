# API Integration Documentation

## Overview
This document describes the API integration for the EduSpark authentication system. The app now connects to your backend server at `http://192.168.1.8:3000` for all authentication operations.

## Backend API Endpoints

### Base URL
```
http://192.168.1.8:3000/api/auth
```

### Available Endpoints

#### 1. Registration
- **POST** `/register/teacher` - Register as a teacher
- **POST** `/register/student` - Register as a student
- **Body**: `{ name, email, password }`
- **Response**: `{ message: "Registration successful. OTP sent to email." }`

#### 2. Login
- **POST** `/login/teacher` - Login as a teacher
- **POST** `/login/student` - Login as a student
- **Body**: `{ email, password }`
- **Response**: `{ token, user: { _id, name, email, role, isVerified } }`

#### 3. OTP Verification
- **POST** `/verify-otp` - Verify email OTP
- **Body**: `{ email, otp }`
- **Response**: `{ message: "OTP verified successfully." }`

#### 4. Resend OTP
- **POST** `/resend-otp` - Resend OTP to email
- **Body**: `{ email }`
- **Response**: `{ message: "OTP resent to email." }`

#### 5. Forgot Password
- **POST** `/forgot-password` - Send password reset OTP
- **Body**: `{ email }`
- **Response**: `{ message: "OTP sent to email." }`

#### 6. Reset Password
- **POST** `/reset-password` - Reset password with OTP
- **Body**: `{ email, otp, newPassword }`
- **Response**: `{ message: "Password reset successful." }`

#### 7. Profile Management (Protected Routes)
- **GET** `/me` - Get user profile
- **PUT** `/me` - Update user profile
- **POST** `/change-password` - Change password

## Frontend Integration

### API Service (`services/api.ts`)
- Centralized API service with proper error handling
- Automatic token management
- Role-based authentication support

### User Context (`contexts/UserContext.tsx`)
- Authentication state management
- Token storage and retrieval
- User data persistence

### Authentication Flow

#### 1. Registration Flow
1. User selects role (teacher/student)
2. User fills registration form
3. App calls `/register/{role}` endpoint
4. Backend sends OTP to email
5. User enters OTP
6. App calls `/verify-otp` endpoint
7. Account is verified and ready for login

#### 2. Login Flow
1. User enters email and password
2. App calls `/login/{role}` endpoint
3. Backend validates credentials and role
4. App receives JWT token and user data
5. Token is stored in AsyncStorage
6. User is redirected to home screen

#### 3. Password Reset Flow
1. User enters email
2. App calls `/forgot-password` endpoint
3. Backend sends OTP to email
4. User enters OTP and new password
5. App calls `/reset-password` endpoint
6. Password is updated

### Error Handling
- Network errors are caught and displayed to user
- API error messages are shown in alerts
- Loading states are managed for better UX

### Security Features
- JWT tokens for authentication
- Role-based access control
- Secure password storage (handled by backend)
- OTP verification for sensitive operations

## Usage Examples

### Login
```typescript
const { login } = useUser();

try {
  await login(email, password, 'teacher');
  // User is now authenticated
} catch (error) {
  // Handle error
}
```

### Registration
```typescript
const { register, verifyOtp } = useUser();

try {
  await register(name, email, password, 'student');
  // OTP sent to email
  await verifyOtp(email, otp);
  // Account verified
} catch (error) {
  // Handle error
}
```

### Password Reset
```typescript
const { forgotPassword, resetPassword } = useUser();

try {
  await forgotPassword(email);
  // OTP sent to email
  await resetPassword(email, otp, newPassword);
  // Password reset successful
} catch (error) {
  // Handle error
}
```

## Configuration

### IP Address
The API base URL is configured in `services/api.ts`:
```typescript
const API_BASE_URL = 'http://192.168.1.8:3000/api/auth';
```

To change the IP address, update this constant.

### Environment Variables
Make sure your backend has the following environment variables:
- `JWT_SECRET` - Secret key for JWT tokens
- `OTP_TTL_MINUTES` - OTP expiration time (default: 10 minutes)

## Testing

### Backend Testing
1. Start your backend server
2. Ensure it's accessible at `http://192.168.1.8:3000`
3. Test API endpoints using Postman or similar tool

### Frontend Testing
1. Run the React Native app
2. Test registration flow
3. Test login flow
4. Test password reset flow
5. Verify role-based access

## Troubleshooting

### Common Issues

1. **Network Error**
   - Check if backend server is running
   - Verify IP address is correct
   - Ensure device/emulator can reach the IP

2. **CORS Error**
   - Backend should allow requests from React Native
   - Check backend CORS configuration

3. **Authentication Error**
   - Verify JWT_SECRET is set in backend
   - Check token expiration settings

4. **OTP Issues**
   - Verify email service is configured in backend
   - Check OTP_TTL_MINUTES setting

### Debug Mode
Enable console logging in the API service to debug network requests:
```typescript
console.log('API Request:', url, config);
console.log('API Response:', data);
```
