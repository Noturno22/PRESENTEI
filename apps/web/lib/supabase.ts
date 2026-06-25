'use client';

import { useContext } from 'react';
import { SupabaseContext } from '@presentei/api-client/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Safe hook to access the Supabase client.
 * Returns the client if available, or null if env vars are missing.
 * Does NOT throw like useSupabase() — use this in auth forms to gracefully
 * handle missing Supabase configuration during development.
 */
export function useSupabaseSafe(): SupabaseClient | null {
  const context = useContext(SupabaseContext);
  return context ?? null;
}

/**
 * Check if Supabase environment variables are configured.
 */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
