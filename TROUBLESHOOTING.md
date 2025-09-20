# Troubleshooting Network Connection Issues

## Problem: Network Error when sending OTP

### Step 1: Check Backend Server
1. Make sure backend server is running:
   ```bash
   cd Backendapp
   npm start
   ```
   You should see: `Server running on port 5000`

### Step 2: Find Your Computer's IP Address
1. **Windows**: Open Command Prompt and type:
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" (usually starts with 192.168.x.x)

2. **Mac/Linux**: Open Terminal and type:
   ```bash
   ifconfig
   ```
   Look for "inet" followed by IP address

### Step 3: Update API URL
1. Open `EdusParklive/services/api.ts`
2. Replace `192.168.1.8` with your actual IP address:
   ```typescript
   const API_BASE_URL = __DEV__ 
     ? 'http://YOUR_IP_ADDRESS:5000/api/auth'  // Replace YOUR_IP_ADDRESS
     : 'http://YOUR_IP_ADDRESS:5000/api/auth';
   ```

### Step 4: Test Connection
1. Run the test script:
   ```bash
   cd EdusParklive
   node test-connection.js
   ```

### Step 5: Check Network
1. Make sure both your computer and phone/emulator are on the same WiFi network
2. Try pinging your computer's IP from another device

### Step 6: Check Firewall
1. Make sure port 5000 is not blocked by firewall
2. Temporarily disable firewall to test

### Step 7: Alternative Solutions
1. **Use ngrok** (if above doesn't work):
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Start backend server
   cd Backendapp
   npm start
   
   # In another terminal, expose port 5000
   ngrok http 5000
   ```
   
   Then use the ngrok URL in your API configuration.

2. **Use localhost for emulator only**:
   If using Android emulator, you can use `10.0.2.2:5000` instead of localhost.

### Common Issues:
- **"Network request failed"**: IP address is wrong or server not running
- **"Cannot connect"**: Firewall blocking connection
- **"Email configuration missing"**: Backend .env file not configured

### Quick Test:
1. Open browser on your phone
2. Go to: `http://YOUR_IP_ADDRESS:5000/api/test`
3. Should see: `{"message":"Backend server is running!"}`

If this works, the issue is in the React Native app configuration.
If this doesn't work, the issue is network/server related.
