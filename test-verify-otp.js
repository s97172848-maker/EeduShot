// Test script for OTP verification API integration
const API_BASE_URL = 'http://93.127.213.176:3002/api';

async function testVerifyOtpAPI() {
  console.log('🔍 Testing OTP Verification API Integration...\n');
  console.log('🌐 Base URL:', API_BASE_URL);

  // Test OTP for verification
  const testOtp = '308422'; // Using the OTP from your example

  try {
    // Test 1: Verify OTP API with the new endpoint
    console.log('🔍 Test 1: Testing OTP verification endpoint...');
    console.log('📤 Sending OTP:', testOtp);
    
    const verifyOtpResponse = await fetch(`${API_BASE_URL}/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: testOtp
      })
    });

    const verifyOtpData = await verifyOtpResponse.json();
    console.log('🔍 Verify OTP Response Status:', verifyOtpResponse.status);
    console.log('🔍 Verify OTP Response:', verifyOtpData);

    if (verifyOtpResponse.ok) {
      console.log('✅ OTP verification successful!');
      console.log('📝 Response message:', verifyOtpData.message || 'OTP verified successfully');
    } else {
      console.log('❌ OTP verification failed:', verifyOtpData.message || 'Unknown error');
      
      // Check if it's a validation error (expected for invalid OTP)
      if (verifyOtpResponse.status === 400 || verifyOtpResponse.status === 422) {
        console.log('ℹ️  This is expected if the OTP is invalid or expired');
      }
    }

    // Test 2: Test with invalid OTP to see error handling
    console.log('\n🔍 Test 2: Testing with invalid OTP...');
    const invalidOtpResponse = await fetch(`${API_BASE_URL}/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: '000000' // Invalid OTP
      })
    });

    const invalidOtpData = await invalidOtpResponse.json();
    console.log('🔍 Invalid OTP Response Status:', invalidOtpResponse.status);
    console.log('🔍 Invalid OTP Response:', invalidOtpData);

    if (invalidOtpResponse.status === 400 || invalidOtpResponse.status === 422) {
      console.log('✅ Error handling works correctly for invalid OTP');
    }

    // Test 3: Test endpoint accessibility
    console.log('\n🔍 Test 3: Testing endpoint accessibility...');
    const testResponse = await fetch(`${API_BASE_URL}/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: '123456'
      })
    });

    console.log('🔍 Test Response Status:', testResponse.status);
    console.log('✅ Endpoint is accessible and responding');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n🔧 Possible solutions:');
      console.log('1. Make sure backend server is running on port 3002');
      console.log('2. Check if IP address 93.127.213.176 is correct');
      console.log('3. Ensure server has the /users/verify-otp endpoint');
      console.log('4. Check firewall settings');
      console.log('5. Verify the server is accessible from your network');
    }
  }

  console.log('\n🏁 OTP Verification API test completed!');
}

// Test the API integration
testVerifyOtpAPI().catch(console.error);
