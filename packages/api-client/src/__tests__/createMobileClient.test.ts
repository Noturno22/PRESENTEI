import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const originalEnv = { ...process.env };

describe('createMobileClient', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('exports createMobileClient function', async () => {
    const mod = await import('../supabase/createMobileClient');
    expect(typeof mod.createMobileClient).toBe('function');
  });

  it('throws if EXPO_PUBLIC_SUPABASE_URL is not set', async () => {
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
    const { createMobileClient } = await import('../supabase/createMobileClient');
    await expect(createMobileClient()).rejects.toThrow(/EXPO_PUBLIC_SUPABASE_URL/i);
  });

  it('throws if EXPO_PUBLIC_SUPABASE_ANON_KEY is not set', async () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    const { createMobileClient } = await import('../supabase/createMobileClient');
    await expect(createMobileClient()).rejects.toThrow(/EXPO_PUBLIC_SUPABASE_ANON_KEY/i);
  });

  it('throws if both env vars are not set', async () => {
    const { createMobileClient } = await import('../supabase/createMobileClient');
    await expect(createMobileClient()).rejects.toThrow(/EXPO_PUBLIC_SUPABASE_URL/i);
  });
});
