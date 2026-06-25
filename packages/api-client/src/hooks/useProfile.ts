'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../supabase/useSupabase';
import { getProfile, updateProfile } from '../queries/profiles';
import type { Profile } from '@presentei/shared/types';

const PROFILE_QUERY_KEY = ['profile'] as const;

/**
 * Fetches the profile of the currently authenticated user.
 */
export function useProfile() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => getProfile(supabase),
  });
}

/**
 * Mutation to update the current user's profile.
 */
export function useUpdateProfile() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Profile>) => updateProfile(supabase, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}
