import type { SupabaseClient } from '@supabase/supabase-js';
import type { Profile } from '@presentei/shared/types';

export async function getProfile(supabase: SupabaseClient): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  supabase: SupabaseClient,
  data: Partial<Profile>,
): Promise<Profile> {
  const { data: updated, error } = await supabase
    .from('profiles')
    .update(data)
    .select()
    .single();

  if (error) throw error;
  return updated;
}
