'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../supabase/useSupabase';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../queries/contacts';
import type { ContactInput } from '@presentei/shared/schemas';

const CONTACTS_QUERY_KEY = ['contacts'] as const;

/**
 * Fetches all contacts for the current user.
 */
export function useContacts() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: CONTACTS_QUERY_KEY,
    queryFn: () => getContacts(supabase),
  });
}

/**
 * Fetches a single contact by ID.
 */
export function useContact(id: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: [...CONTACTS_QUERY_KEY, id],
    queryFn: () => getContactById(supabase, id),
  });
}

/**
 * Mutation to create a new contact.
 */
export function useCreateContact() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactInput) => createContact(supabase, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
    },
  });
}

/**
 * Mutation to update an existing contact.
 */
export function useUpdateContact() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactInput> }) =>
      updateContact(supabase, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
    },
  });
}

/**
 * Mutation to delete a contact.
 */
export function useDeleteContact() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteContact(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
    },
  });
}
