'use client';

import React, { createContext, useState, useEffect, useMemo } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from './createClient';
import type { ReactNode } from 'react';

// Create a context with an initial value of undefined
export const SupabaseContext = createContext<SupabaseClient | undefined>(undefined);

export interface SupabaseProviderProps {
  children: ReactNode;
  /**
   * Optional pre-initialized Supabase client. If not provided, the provider
   * will attempt to create a browser client using env vars.
   */
  client?: SupabaseClient;
}

/**
 * Provides a Supabase client instance to the component tree.
 *
 * On web, it uses createBrowserClient from @supabase/ssr.
 * On mobile, pass a pre-initialized client via the `client` prop.
 *
 * Usage:
 * ```tsx
 * <SupabaseProvider>
 *   <App />
 * </SupabaseProvider>
 * ```
 */
export function SupabaseProvider({ children, client: initialClient }: SupabaseProviderProps) {
  const [client, setClient] = useState<SupabaseClient | null>(initialClient ?? null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If a client was already provided, skip auto-initialization
    if (initialClient) return;

    let cancelled = false;

    createBrowserClient()
      .then((c) => {
        if (!cancelled) setClient(c);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [initialClient]);

  const value = useMemo(() => client ?? undefined, [client]);

  if (error) {
    // In dev, show a clear error so the developer knows env vars are missing
    if (process.env.NODE_ENV === 'development') {
      console.warn('[api-client] Supabase client initialization failed:', error.message);
    }
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}
