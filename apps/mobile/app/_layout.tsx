import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SupabaseProvider, createMobileClient } from '@presentei/api-client';
import type { SupabaseClient } from '@supabase/supabase-js';
import '../global.css';

const supabaseConfigured = !!(
  process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    async function init() {
      if (!supabaseConfigured) {
        setReady(true);
        return;
      }

      try {
        let storageAdapter: { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void>; removeItem(key: string): Promise<void> } | undefined;
        try {
          const SecureStore = await import('expo-secure-store');
          storageAdapter = {
            getItem: (key: string) => SecureStore.getItemAsync(key),
            setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
            removeItem: (key: string) => SecureStore.deleteItemAsync(key),
          };
        } catch {
          // SecureStore not available
        }

        const client = await createMobileClient(storageAdapter ?? undefined);
        setSupabaseClient(client);

        const { data: { session } } = await client.auth.getSession();
        if (!session) {
          router.replace('/(auth)/login');
        }
      } catch {
        // On error, go to tabs
      }

      setReady(true);
    }

    init();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F7FB' }}>
        <ActivityIndicator size="large" color="#FF4D8D" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SupabaseProvider client={supabaseClient ?? undefined}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="criar-cartao" />
          <Stack.Screen name="presentes" />
        </Stack>
      </SupabaseProvider>
    </SafeAreaProvider>
  );
}
