import { describe, it, expect } from 'vitest';
import * as apiClient from '../index';

describe('package exports', () => {
  it('exports supabase module', () => {
    expect(apiClient.createServerClient).toBeDefined();
    expect(apiClient.createBrowserClient).toBeDefined();
    expect(apiClient.createMobileClient).toBeDefined();
    expect(apiClient.SupabaseProvider).toBeDefined();
    expect(apiClient.useSupabase).toBeDefined();
  });

  it('exports hook modules', () => {
    expect(apiClient.useContacts).toBeDefined();
    expect(apiClient.useContact).toBeDefined();
    expect(apiClient.useCreateContact).toBeDefined();
    expect(apiClient.useUpdateContact).toBeDefined();
    expect(apiClient.useDeleteContact).toBeDefined();
    expect(apiClient.useProducts).toBeDefined();
    expect(apiClient.useProductsByCategory).toBeDefined();
    expect(apiClient.useKits).toBeDefined();
    expect(apiClient.useProduct).toBeDefined();
    expect(apiClient.useOrders).toBeDefined();
    expect(apiClient.useOrder).toBeDefined();
    expect(apiClient.useCreateOrder).toBeDefined();
    expect(apiClient.useUpcomingBirthdays).toBeDefined();
    expect(apiClient.useProfile).toBeDefined();
    expect(apiClient.useUpdateProfile).toBeDefined();
    expect(apiClient.useCategories).toBeDefined();
    expect(apiClient.useDigitalCards).toBeDefined();
    expect(apiClient.useCreateDigitalCard).toBeDefined();
  });

  it('exports query modules', () => {
    expect(apiClient.getContacts).toBeDefined();
    expect(apiClient.getProducts).toBeDefined();
    expect(apiClient.getOrders).toBeDefined();
    expect(apiClient.getUpcomingBirthdays).toBeDefined();
    expect(apiClient.getProfile).toBeDefined();
    expect(apiClient.getCategories).toBeDefined();
    expect(apiClient.getDigitalCards).toBeDefined();
  });
});
