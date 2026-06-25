import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Creates a Supabase client for mobile (Expo) with optional custom storage.
 *
 * Requires EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
 * environment variables to be set.
 *
 * @param storage - Optional custom storage adapter (e.g., expo-secure-store)
 * @returns A promise that resolves to a SupabaseClient instance.
 */
export async function createMobileClient(
  storage?: StorageAdapter,
): Promise<SupabaseClient> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      '[api-client] EXPO_PUBLIC_SUPABASE_URL is not defined. ' +
        'Set it in your .env file before using Supabase on mobile.',
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      '[api-client] EXPO_PUBLIC_SUPABASE_ANON_KEY is not defined. ' +
        'Set it in your .env file before using Supabase on mobile.',
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: storage ?? {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
      },
    },
  });
}
