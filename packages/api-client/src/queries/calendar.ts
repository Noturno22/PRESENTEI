import type { SupabaseClient } from '@supabase/supabase-js';
import type { Contact } from '@presentei/shared/types';

/**
 * Returns contacts whose birthdays fall within the next `daysAhead` days.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getUpcomingBirthdays(
  supabase: SupabaseClient,
  daysAhead: number,
): Promise<Contact[]> {
  // @todo: implement
  // const today = new Date();
  // const future = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  // Use PostgreSQL date extraction to compare month and day
  return [];
}

/**
 * Returns contacts who celebrate their birthday in a given month (1-12).
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getContactsByMonth(
  supabase: SupabaseClient,
  month: number,
): Promise<Contact[]> {
  // @todo: implement
  // return supabase.from('contacts')
  //   .select('*')
  //   .where('EXTRACT(MONTH FROM birth_date) = ?', month)
  //   .throwOnError();
  return [];
}
