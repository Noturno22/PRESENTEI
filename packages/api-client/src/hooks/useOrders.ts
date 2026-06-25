'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../supabase/useSupabase';
import { getOrders, getOrderById, createOrder } from '../queries/orders';
import type { CreateOrderInput } from '@presentei/shared/schemas';

const ORDERS_QUERY_KEY = ['orders'] as const;

/**
 * Fetches all orders for the current user.
 */
export function useOrders() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => getOrders(supabase),
  });
}

/**
 * Fetches a single order by ID (with items).
 */
export function useOrder(id: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: () => getOrderById(supabase, id),
  });
}

/**
 * Mutation to create a new order (with items in a transaction).
 */
export function useCreateOrder() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderInput) => createOrder(supabase, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}
