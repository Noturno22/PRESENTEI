import type { SupabaseClient } from '@supabase/supabase-js';
import type { Order } from '@presentei/shared/types';
import type { CreateOrderInput } from '@presentei/shared/schemas';

export async function getOrders(supabase: SupabaseClient): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getOrderById(
  supabase: SupabaseClient,
  id: string,
): Promise<(Order & { items: unknown[] }) | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createOrder(
  supabase: SupabaseClient,
  data: CreateOrderInput,
): Promise<Order> {
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      contact_id: data.contactId,
      digital_card_id: data.digitalCardId ?? null,
      scheduled_delivery_date: data.scheduledDeliveryDate ?? null,
      delivery_address: data.deliveryAddress ?? null,
      total_kz: 0,
    })
    .select()
    .single();

  if (error) throw error;

  const itemsPayload = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price_kz: 0,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsPayload);

  if (itemsError) throw itemsError;

  return order;
}
