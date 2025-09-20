// Test script for forgot password API integration
const API_BASE_URL = 'http://93.127.213.176:3002/api';

async function testForgotPasswordAPI() {
  console.log('🔐 Testing Forgot Password API Integration...\n');
  console.log('🌐 Base URL:', API_BASE_URL);

  // Test email for forgot password
  const testEmail = 'chetan.jaangid25@gmail.com';

  try {
    // Test 1: Forgot Password API
    console.log('📧 Test 1: Testing forgot password endpoint...');
    const forgotPasswordResponse = await fetch(`${API_BASE_URL}/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail
      })
    });

    const forgotPasswordData = await forgotPasswordResponse.json();
    console.log('📧 Forgot Password Response Status:', forgotPasswordResponse.status);
    console.log('📧 Forgot Password Response:', forgotPasswordData);

    if (forgotPasswordResponse.ok) {
      console.log('✅ Forgot Password API is working correctly!');
      
      // If successful, we can test other endpoints
      console.log('\n🔄 Test 2: Testing OTP verification endpoint...');
      
      // Note: This will fail because we don't have a real OTP, but we can test the endpoint structure
      const verifyOtpResponse = await fetch(`${API_BASE_URL}/users/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          otp: '123456' // This will likely fail, but tests the endpoint
        })
      });

      const verifyOtpData = await verifyOtpResponse.json();
      console.log('🔍 Verify OTP Response Status:', verifyOtpResponse.status);
      console.log('🔍 Verify OTP Response:', verifyOtpData);

      if (verifyOtpResponse.status === 400 || verifyOtpResponse.status === 422) {
        console.log('✅ OTP verification endpoint is accessible (expected to fail with invalid OTP)');
      }

      // Test reset password endpoint structure
      console.log('\n🔄 Test 3: Testing reset password endpoint structure...');
      const resetPasswordResponse = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          otp: '123456',
          newPassword: 'newPassword123'
        })
      });

      const resetPasswordData = await resetPasswordResponse.json();
      console.log('🔄 Reset Password Response Status:', resetPasswordResponse.status);
      console.log('🔄 Reset Password Response:', resetPasswordData);

      if (resetPasswordResponse.status === 400 || resetPasswordResponse.status === 422) {
        console.log('✅ Reset password endpoint is accessible (expected to fail with invalid OTP)');
      }

    } else {
      console.log('❌ Forgot Password API failed:', forgotPasswordData.message || 'Unknown error');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n🔧 Possible solutions:');
      console.log('1. Make sure backend server is running on port 3002');
      console.log('2. Check if IP address 93.127.213.176 is correct');
      console.log('3. Ensure server has the /users/forgot-password endpoint');
      console.log('4. Check firewall settings');
    }
  }

  console.log('\n🏁 Forgot Password API test completed!');
}

// Test the API integration
testForgotPasswordAPI().catch(console.error);
