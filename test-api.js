const axios = require('axios');

// Test different API endpoint patterns
async function testAPIEndpoints() {
  const baseURL = 'http://93.127.213.176:3002';
  
  console.log('🔍 Testing different API endpoint patterns...');
  console.log('🌐 Base URL:', baseURL);
  
  // Common endpoint patterns to test
  const endpointsToTest = [
    // Root level
    '/api/users/send-otp',
    '/api/users/verify',
    '/api/auth/send-otp',
    '/api/auth/verify',
    '/api/auth/verify-otp',
    
    // Without /api prefix
    '/users/send-otp',
    '/users/verify',
    '/auth/send-otp',
    '/auth/verify',
    '/auth/verify-otp',
    
    // Different patterns
    '/api/user/send-otp',
    '/api/user/verify',
    '/api/otp/send',
    '/api/otp/verify',
    
    // Check what endpoints exist
    '/api',
    '/',
    '/health',
    '/api/health'
  ];
  
  for (const endpoint of endpointsToTest) {
    try {
      console.log(`\n🔍 Testing: ${baseURL}${endpoint}`);
      
      if (endpoint.includes('send-otp') || endpoint.includes('send')) {
        // Test POST for send OTP
        const response = await axios.post(`${baseURL}${endpoint}`, {
          email: 'test@example.com'
        }, { timeout: 5000 });
        console.log(`✅ POST ${endpoint} Success:`, response.status, response.data);
      } else if (endpoint.includes('verify')) {
        // Test POST for verify OTP
        const response = await axios.post(`${baseURL}${endpoint}`, {
          email: 'test@example.com',
          otp: '123456'
        }, { timeout: 5000 });
        console.log(`✅ POST ${endpoint} Success:`, response.status, response.data);
      } else {
        // Test GET for info endpoints
        const response = await axios.get(`${baseURL}${endpoint}`, { timeout: 5000 });
        console.log(`✅ GET ${endpoint} Success:`, response.status, response.data);
      }
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint} - Status: ${error.response.status}`);
        if (error.response.status !== 404) {
          console.log(`   Response:`, error.response.data);
        }
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${endpoint} - Connection refused`);
        break; // Stop testing if server is down
      } else {
        console.log(`❌ ${endpoint} - Error:`, error.message);
      }
    }
  }
  
  // Test if server is running at all
  try {
    console.log('\n🌐 Testing server root...');
    const response = await axios.get(baseURL, { timeout: 5000 });
    console.log('✅ Server is running:', response.status);
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
  }
}

testAPIEndpoints().catch(console.error);