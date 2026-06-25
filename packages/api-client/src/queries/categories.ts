import type { SupabaseClient } from '@supabase/supabase-js';
import type { Category } from '@presentei/shared/types';

/**
 * Returns all product categories, ordered by display_order.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getCategories(supabase: SupabaseClient): Promise<Category[]> {
  // @todo: implement
  // return supabase.from('categories').select('*').order('display_order', { ascending: true }).throwOnError();
  return [];
}
