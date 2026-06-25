import type { SupabaseClient } from '@supabase/supabase-js';
import type { Contact } from '@presentei/shared/types';
import type { ContactInput } from '@presentei/shared/schemas';

/**
 * Returns all contacts belonging to the current user.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getContacts(supabase: SupabaseClient): Promise<Contact[]> {
  // @todo: implement
  // return supabase.from('contacts').select('*').throwOnError();
  return [];
}

/**
 * Returns a single contact by its ID.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getContactById(supabase: SupabaseClient, id: string): Promise<Contact | null> {
  // @todo: implement
  // const { data } = await supabase.from('contacts').select('*').eq('id', id).single().throwOnError();
  // return data;
  return null;
}

/**
 * Creates a new contact.
 *
 * @todo Implement actual Supabase mutation when Supabase is active.
 */
export async function createContact(supabase: SupabaseClient, data: ContactInput): Promise<Contact> {
  // @todo: implement
  // const { data: created } = await supabase.from('contacts').insert(data).select().single().throwOnError();
  // return created;
  throw new Error('[api-client] createContact is not yet implemented. Configure Supabase first.');
}

/**
 * Updates an existing contact.
 *
 * @todo Implement actual Supabase mutation when Supabase is active.
 */
export async function updateContact(
  supabase: SupabaseClient,
  id: string,
  data: Partial<ContactInput>,
): Promise<Contact> {
  // @todo: implement
  // const { data: updated } = await supabase.from('contacts').update(data).eq('id', id).select().single().throwOnError();
  // return updated;
  throw new Error('[api-client] updateContact is not yet implemented. Configure Supabase first.');
}

/**
 * Deletes a contact.
 *
 * If the contacts table has a `deleted_at` column, performs a soft delete.
 * Otherwise performs a hard delete.
 *
 * @todo Implement actual Supabase mutation when Supabase is active.
 */
export async function deleteContact(supabase: SupabaseClient, id: string): Promise<void> {
  // @todo: implement
  // await supabase.from('contacts').update({ deleted_at: new Date().toISOString() }).eq('id', id).throwOnError();
  // or: await supabase.from('contacts').delete().eq('id', id).throwOnError();
  throw new Error('[api-client] deleteContact is not yet implemented. Configure Supabase first.');
}
