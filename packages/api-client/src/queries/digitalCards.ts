import type { SupabaseClient } from '@supabase/supabase-js';
import type { DigitalCard } from '@presentei/shared/types';
import type { DigitalCardInput } from '@presentei/shared/schemas';

/**
 * Returns all digital cards belonging to the current user.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getDigitalCards(supabase: SupabaseClient): Promise<DigitalCard[]> {
  // @todo: implement
  // return supabase.from('digital_cards').select('*').throwOnError();
  return [];
}

/**
 * Creates a new digital card.
 *
 * @todo Implement actual Supabase mutation when Supabase is active.
 */
export async function createDigitalCard(
  supabase: SupabaseClient,
  data: DigitalCardInput,
): Promise<DigitalCard> {
  // @todo: implement
  // const { data: created } = await supabase.from('digital_cards').insert(data).select().single().throwOnError();
  // return created;
  throw new Error('[api-client] createDigitalCard is not yet implemented. Configure Supabase first.');
}
