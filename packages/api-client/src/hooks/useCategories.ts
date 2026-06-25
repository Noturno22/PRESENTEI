'use client';

import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../supabase/useSupabase';
import { getCategories } from '../queries/categories';

const CATEGORIES_QUERY_KEY = ['categories'] as const;

/**
 * Fetches all product categories.
 */
export function useCategories() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => getCategories(supabase),
  });
}
