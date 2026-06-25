import { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SupabaseProvider, createMobileClient } from '@presentei/api-client';
import type { SupabaseClient } from '@supabase/supabase-js';
import './global.css';

const supabaseConfigured = !!(
  process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<'loading' | 'auth' | 'tabs'>('loading');
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    async function init() {
      if (!supabaseConfigured) {
        setInitialRoute('tabs');
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
        setInitialRoute(session ? 'tabs' : 'auth');
      } catch {
        setInitialRoute('tabs');
      }
    }

    init();
  }, []);

  if (initialRoute === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-brand-off-white">
        <ActivityIndicator size="large" color="#FF4D8D" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SupabaseProvider client={supabaseClient ?? undefined}>
        <Stack screenOptions={{ headerShown: false }}>
          {initialRoute === 'auth' ? (
            <Stack.Screen name="(auth)" />
          ) : (
            <Stack.Screen name="(tabs)" />
          )}
        </Stack>
      </SupabaseProvider>
    </SafeAreaProvider>
  );
}
