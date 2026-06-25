import type { SupabaseClient } from '@supabase/supabase-js';
import type { DigitalCard } from '@presentei/shared/types';
import type { DigitalCardInput } from '@presentei/shared/schemas';

export async function getDigitalCards(supabase: SupabaseClient): Promise<DigitalCard[]> {
  const { data, error } = await supabase
    .from('digital_cards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createDigitalCard(
  supabase: SupabaseClient,
  data: DigitalCardInput,
): Promise<DigitalCard> {
  const { data: created, error } = await supabase
    .from('digital_cards')
    .insert({
      template_key: data.templateKey,
      message: data.message,
      recipient_name: data.recipientName ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return created;
}
