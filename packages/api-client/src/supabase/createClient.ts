import { createServerClient as _createServerClient, createBrowserClient as _createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client for server-side usage (Next.js App Router).
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * environment variables to be set.
 *
 * @returns A promise that resolves to a SupabaseClient instance.
 */
export async function createServerClient(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      '[api-client] NEXT_PUBLIC_SUPABASE_URL is not defined. ' +
        'Set it in your .env.local file before using Supabase.',
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      '[api-client] NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. ' +
        'Set it in your .env.local file before using Supabase.',
    );
  }

  // @todo: configure cookie handling for Next.js App Router when Supabase is active
  return _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // no-op until Supabase is active
      },
    },
  });
}

/**
 * Creates a Supabase client for browser-side usage (Next.js client components).
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * environment variables to be set.
 *
 * @returns A promise that resolves to a SupabaseClient instance.
 */
export async function createBrowserClient(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      '[api-client] NEXT_PUBLIC_SUPABASE_URL is not defined. ' +
        'Set it in your .env.local file before using Supabase.',
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      '[api-client] NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. ' +
        'Set it in your .env.local file before using Supabase.',
    );
  }

  // @todo: configure cookie handling for browser when Supabase is active
  return _createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // no-op until Supabase is active
      },
    },
  });
}
