'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../supabase/useSupabase';
import { getDigitalCards, createDigitalCard } from '../queries/digitalCards';
import type { DigitalCardInput } from '@presentei/shared/schemas';

const DIGITAL_CARDS_QUERY_KEY = ['digitalCards'] as const;

/**
 * Fetches all digital cards for the current user.
 */
export function useDigitalCards() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: DIGITAL_CARDS_QUERY_KEY,
    queryFn: () => getDigitalCards(supabase),
  });
}

/**
 * Mutation to create a new digital card.
 */
export function useCreateDigitalCard() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DigitalCardInput) => createDigitalCard(supabase, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DIGITAL_CARDS_QUERY_KEY });
    },
  });
}
