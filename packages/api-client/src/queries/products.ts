import type { SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '@presentei/shared/types';

/**
 * Returns all active products.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getProducts(supabase: SupabaseClient): Promise<Product[]> {
  // @todo: implement
  // return supabase.from('products').select('*').eq('is_active', true).throwOnError();
  return [];
}

/**
 * Returns products filtered by category.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getProductsByCategory(
  supabase: SupabaseClient,
  categoryId: string,
): Promise<Product[]> {
  // @todo: implement
  // return supabase.from('products').select('*').eq('category_id', categoryId).eq('is_active', true).throwOnError();
  return [];
}

/**
 * Returns only kit products (is_kit = true).
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getKits(supabase: SupabaseClient): Promise<Product[]> {
  // @todo: implement
  // return supabase.from('products').select('*').eq('is_kit', true).eq('is_active', true).throwOnError();
  return [];
}

/**
 * Returns a single product by its ID.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getProductById(
  supabase: SupabaseClient,
  id: string,
): Promise<Product | null> {
  // @todo: implement
  // const { data } = await supabase.from('products').select('*').eq('id', id).single().throwOnError();
  // return data;
  return null;
}
