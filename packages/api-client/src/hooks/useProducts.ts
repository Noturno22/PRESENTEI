'use client';

import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../supabase/useSupabase';
import {
  getProducts,
  getProductsByCategory,
  getKits,
  getProductById,
} from '../queries/products';

const PRODUCTS_QUERY_KEY = ['products'] as const;

/**
 * Fetches all active products.
 */
export function useProducts() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => getProducts(supabase),
  });
}

/**
 * Fetches products filtered by category.
 */
export function useProductsByCategory(categoryId: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'category', categoryId],
    queryFn: () => getProductsByCategory(supabase, categoryId),
  });
}

/**
 * Fetches only kit products (is_kit = true).
 */
export function useKits() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'kits'],
    queryFn: () => getKits(supabase),
  });
}

/**
 * Fetches a single product by ID.
 */
export function useProduct(id: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: () => getProductById(supabase, id),
  });
}
