import { createServerClient as _createServerClient, createBrowserClient as _createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Cookie {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

interface CookieStore {
  getAll(): Cookie[];
  set(name: string, value: string, options?: Record<string, unknown>): void;
}

/**
 * Creates a Supabase client for server-side usage (Next.js App Router).
 */
export async function createServerClient(
  cookieStore?: CookieStore,
): Promise<SupabaseClient> {
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

  return _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore?.getAll() ?? [];
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore?.set(name, value, options);
        });
      },
    },
  });
}

/**
 * Creates a Supabase client for browser-side usage (Next.js client components).
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

  return _createBrowserClient(supabaseUrl, supabaseAnonKey);
}
