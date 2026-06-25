import type { SupabaseClient } from '@supabase/supabase-js';
import type { Contact } from '@presentei/shared/types';

export async function getUpcomingBirthdays(
  supabase: SupabaseClient,
  daysAhead: number,
): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*');

  if (error) throw error;
  if (!data) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = new Date(today.getTime() + daysAhead * 86400000);

  return data.filter((contact) => {
    const birthDate = new Date(contact.birth_date);
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    return nextBirthday >= today && nextBirthday <= future;
  });
}

export async function getContactsByMonth(
  supabase: SupabaseClient,
  month: number,
): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*');

  if (error) throw error;
  if (!data) return [];

  return data.filter((contact) => {
    const d = new Date(contact.birth_date);
    return d.getMonth() === month;
  });
}
