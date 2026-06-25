'use client';

import { useContext } from 'react';
import { SupabaseContext } from './SupabaseProvider';

/**
 * Hook that provides the current Supabase client from the nearest SupabaseProvider.
 *
 * Must be used within a SupabaseProvider. Throws if called outside one.
 *
 * @returns The Supabase client instance.
 */
export function useSupabase() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error(
      '[api-client] useSupabase must be used within a <SupabaseProvider>. ' +
        'Wrap your application with <SupabaseProvider> to use Supabase hooks.',
    );
  }

  return context;
}
