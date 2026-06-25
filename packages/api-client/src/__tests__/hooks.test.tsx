import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from '../supabase/SupabaseProvider';
import { useContacts, useContact } from '../hooks/useContacts';
import { useProducts, useProduct, useProductsByCategory, useKits } from '../hooks/useProducts';
import { useOrders, useOrder } from '../hooks/useOrders';
import { useUpcomingBirthdays } from '../hooks/useUpcomingBirthdays';
import { useProfile } from '../hooks/useProfile';
import { useCategories } from '../hooks/useCategories';
import { useDigitalCards } from '../hooks/useDigitalCards';
import type { SupabaseClient } from '@supabase/supabase-js';

// Create a minimal mock Supabase client for testing
function createMockClient(): SupabaseClient {
  return {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
  } as unknown as SupabaseClient;
}

const mockClient = createMockClient();

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider client={mockClient}>{children}</SupabaseProvider>
      </QueryClientProvider>
    );
  };
}

describe('useContacts', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useContacts(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useContact', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useContact('test-id'), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useProducts', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useProduct', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useProduct('test-id'), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useProductsByCategory', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useProductsByCategory('cat-id'), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useKits', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useKits(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useOrders', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useOrder', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useOrder('test-id'), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useUpcomingBirthdays', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useUpcomingBirthdays(30), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useProfile', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useCategories', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});

describe('useDigitalCards', () => {
  it('returns a query with initial pending state', () => {
    const { result } = renderHook(() => useDigitalCards(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
  });
});
