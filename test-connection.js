// Test script to check backend connectivity
const API_BASE_URL = 'http://192.168.1.8:5000/api';

async function testConnection() {
  console.log('Testing backend connection...\n');

  try {
    // Test 1: Check if server is running
    const testResponse = await fetch(`${API_BASE_URL}/test`);
    const testData = await testResponse.json();
    console.log('✅ Server is running');
    console.log('Test response:', testData);

    // Test 2: Test registration endpoint
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register/student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const registerData = await registerResponse.json();
    console.log('\n✅ Registration endpoint working');
    console.log('Registration response:', registerData);

  } catch (error) {
    console.log('❌ Connection failed');
    console.log('Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\nPossible solutions:');
      console.log('1. Make sure backend server is running on port 5000');
      console.log('2. Check if IP address 192.168.1.8 is correct');
      console.log('3. Ensure both devices are on same network');
      console.log('4. Check firewall settings');
    }
  }
}

testConnection();
