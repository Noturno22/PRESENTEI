'use client';

import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../supabase/useSupabase';
import { getUpcomingBirthdays } from '../queries/calendar';

/**
 * Fetches contacts whose birthdays fall within the next `daysAhead` days.
 */
export function useUpcomingBirthdays(daysAhead: number) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['upcomingBirthdays', daysAhead],
    queryFn: () => getUpcomingBirthdays(supabase, daysAhead),
  });
}
