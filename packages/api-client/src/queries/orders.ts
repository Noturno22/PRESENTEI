import type { SupabaseClient } from '@supabase/supabase-js';
import type { Order } from '@presentei/shared/types';
import type { CreateOrderInput } from '@presentei/shared/schemas';

/**
 * Returns all orders for the current user.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getOrders(supabase: SupabaseClient): Promise<Order[]> {
  // @todo: implement
  // return supabase.from('orders').select('*').throwOnError();
  return [];
}

/**
 * Returns a single order with its items.
 *
 * @todo Implement actual Supabase query when Supabase is active.
 */
export async function getOrderById(
  supabase: SupabaseClient,
  id: string,
): Promise<(Order & { items: unknown[] }) | null> {
  // @todo: implement
  // const { data } = await supabase.from('orders').select('*, order_items(*)').eq('id', id).single().throwOnError();
  // return data;
  return null;
}

/**
 * Creates an order and its items in a single transaction.
 *
 * @todo Implement actual Supabase mutation when Supabase is active.
 */
export async function createOrder(
  supabase: SupabaseClient,
  data: CreateOrderInput,
): Promise<Order> {
  // @todo: implement
  // return supabase.rpc('create_order', { p_data: data }).throwOnError();
  throw new Error('[api-client] createOrder is not yet implemented. Configure Supabase first.');
}
