import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/config/colors';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/config/i18n';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="home" />
                    <Stack.Screen name="health-worker-dashboard" />
                    <Stack.Screen name="auth" />
                    <Stack.Screen name="role-selection" />
                    <Stack.Screen name="profile-setup" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
          <StatusBar style="auto" backgroundColor={colors.primary[500]} />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
