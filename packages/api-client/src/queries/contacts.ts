import type { SupabaseClient } from '@supabase/supabase-js';
import type { Contact } from '@presentei/shared/types';
import type { ContactInput } from '@presentei/shared/schemas';

export async function getContacts(supabase: SupabaseClient): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getContactById(supabase: SupabaseClient, id: string): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createContact(supabase: SupabaseClient, data: ContactInput): Promise<Contact> {
  const { data: created, error } = await supabase
    .from('contacts')
    .insert({
      full_name: data.fullName,
      relation: data.relation,
      birth_date: data.birthDate,
      photo_url: data.photoUrl ?? null,
      notes: data.notes ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return created;
}

export async function updateContact(
  supabase: SupabaseClient,
  id: string,
  data: Partial<ContactInput>,
): Promise<Contact> {
  const payload: Record<string, unknown> = {};
  if (data.fullName !== undefined) payload.full_name = data.fullName;
  if (data.relation !== undefined) payload.relation = data.relation;
  if (data.birthDate !== undefined) payload.birth_date = data.birthDate;
  if (data.photoUrl !== undefined) payload.photo_url = data.photoUrl ?? null;
  if (data.notes !== undefined) payload.notes = data.notes ?? null;

  const { data: updated, error } = await supabase
    .from('contacts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

export async function deleteContact(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
