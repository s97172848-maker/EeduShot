import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import { store } from '../store';
import { UserProvider } from "../contexts/UserContext";
import "../global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/continue" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="video-player" options={{ headerShown: false }} />
        <Stack.Screen name="quiz-screen" options={{ headerShown: false }} />
        <Stack.Screen name="upload-video" options={{ headerShown: false }} />
        </Stack>
      </UserProvider>
    </Provider>
  );
}
