import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const originalEnv = { ...process.env };

describe('createClient (web)', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('exports createServerClient and createBrowserClient functions', async () => {
    const mod = await import('../supabase/createClient');
    expect(typeof mod.createServerClient).toBe('function');
    expect(typeof mod.createBrowserClient).toBe('function');
  });

  it('createServerClient throws if NEXT_PUBLIC_SUPABASE_URL is not set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
    const { createServerClient } = await import('../supabase/createClient');
    await expect(createServerClient()).rejects.toThrow(/NEXT_PUBLIC_SUPABASE_URL/i);
  });

  it('createServerClient throws if NEXT_PUBLIC_SUPABASE_ANON_KEY is not set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    const { createServerClient } = await import('../supabase/createClient');
    await expect(createServerClient()).rejects.toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/i);
  });

  it('createServerClient throws if both env vars are not set', async () => {
    const { createServerClient } = await import('../supabase/createClient');
    await expect(createServerClient()).rejects.toThrow(/NEXT_PUBLIC_SUPABASE_URL/i);
  });

  it('createBrowserClient throws if NEXT_PUBLIC_SUPABASE_URL is not set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
    const { createBrowserClient } = await import('../supabase/createClient');
    await expect(createBrowserClient()).rejects.toThrow(/NEXT_PUBLIC_SUPABASE_URL/i);
  });

  it('createBrowserClient throws if NEXT_PUBLIC_SUPABASE_ANON_KEY is not set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    const { createBrowserClient } = await import('../supabase/createClient');
    await expect(createBrowserClient()).rejects.toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/i);
  });
});
