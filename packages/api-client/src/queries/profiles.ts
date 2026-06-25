import type { SupabaseClient } from '@supabase/supabase-js';
import type { Profile } from '@presentei/shared/types';

/**
 * Returns the profile of the currently authenticated user.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getProfile(supabase: SupabaseClient): Promise<Profile | null> {
  // @todo: implement
  // const { data } = await supabase.from('profiles').select('*').single().throwOnError();
  // return data;
  return null;
}

/**
 * Updates the profile of the currently authenticated user.
 *
 * @todo Implement actual Supabase mutation when Supabase is active.
 */
export async function updateProfile(
  supabase: SupabaseClient,
  data: Partial<Profile>,
): Promise<Profile> {
  // @todo: implement
  // const { data: updated } = await supabase.from('profiles').update(data).select().single().throwOnError();
  // return updated;
  throw new Error('[api-client] updateProfile is not yet implemented. Configure Supabase first.');
}
