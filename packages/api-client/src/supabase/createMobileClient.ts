import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client for mobile (Expo) using expo-secure-store for session persistence.
 *
 * Requires EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
 * environment variables to be set.
 *
 * @returns A promise that resolves to a SupabaseClient instance.
 */
export async function createMobileClient(): Promise<SupabaseClient> {
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

  // @todo: integrate expo-secure-store for session persistence when Supabase is active
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
      },
    },
  });
}
