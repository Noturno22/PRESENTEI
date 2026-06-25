import type { SupabaseClient } from '@supabase/supabase-js';
import type { Category } from '@presentei/shared/types';

export async function getCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
