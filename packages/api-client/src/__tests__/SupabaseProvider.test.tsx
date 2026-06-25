import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SupabaseProvider } from '../supabase/SupabaseProvider';
import { useSupabase } from '../supabase/useSupabase';
import type { SupabaseClient } from '@supabase/supabase-js';

// Create a minimal mock Supabase client
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

// Test component that consumes useSupabase
function TestConsumer() {
  const supabase = useSupabase();
  return <div data-testid="has-client">{typeof supabase.from === 'function' ? 'yes' : 'no'}</div>;
}

// Component that renders outside provider to test error
function TestOutside() {
  try {
    useSupabase();
    return <div data-testid="outside">no-error</div>;
  } catch (err) {
    return <div data-testid="outside">{(err as Error).message}</div>;
  }
}

describe('SupabaseProvider', () => {
  it('provides a supabase client to children when client prop is given', () => {
    render(
      <SupabaseProvider client={mockClient}>
        <TestConsumer />
      </SupabaseProvider>,
    );
    expect(screen.getByTestId('has-client').textContent).toBe('yes');
  });

  it('throws when useSupabase is used outside SupabaseProvider', () => {
    render(<TestOutside />);
    expect(screen.getByTestId('outside').textContent).toMatch(/useSupabase.+SupabaseProvider/i);
  });
});
