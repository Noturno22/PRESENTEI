// ============================================================================
// Presentei — Database Types (auto-generated placeholder)
// ============================================================================
// Este ficheiro será gerado automaticamente pelo Supabase CLI após aplicar
// as migrations e conectar o projeto local.
//
// Para gerar os tipos manualmente (quando o Supabase local estiver ativo):
//   supabase gen types typescript --local > packages/shared/src/types/database.ts
//
// ATENÇÃO: Este ficheiro é um PLACEHOLDER. Não editar manualmente.
// Os tipos reais devem ser gerados pelo comando acima.
// ============================================================================

import type { Database as GeneratedDatabase } from './database.generated';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = GeneratedDatabase;

// Enums (definidos manualmente como fallback até gerar os tipos oficiais)
export type ContactRelation = 'familia' | 'amigo' | 'parceiro' | 'colega' | 'outro';
export type OrderStatus =
  | 'pendente'
  | 'pagamento_processando'
  | 'pago'
  | 'preparando'
  | 'enviado'
  | 'entregue'
  | 'cancelado';
export type PaymentStatus = 'iniciado' | 'sucesso' | 'falhou' | 'expirado';
export type SubscriptionPlan = 'basico' | 'premium' | 'familia';
export type SubscriptionStatus = 'ativa' | 'cancelada' | 'expirada';

// Table row types (placeholders — usar Database['public']['Tables']['table_name']['Row'] após gerar)
export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  city: string | null;
  notification_lead_days: number[] | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  owner_id: string;
  full_name: string;
  relation: ContactRelation;
  birth_date: string;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon_key: string;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price_kz: number;
  image_url: string | null;
  is_active: boolean;
  is_kit: boolean;
  stock: number | null;
  created_at: string;
  updated_at: string;
}

export interface DigitalCard {
  id: string;
  owner_id: string;
  template_key: string;
  message: string;
  recipient_name: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  owner_id: string;
  contact_id: string | null;
  digital_card_id: string | null;
  status: OrderStatus;
  total_kz: number;
  scheduled_delivery_date: string | null;
  delivery_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_kz: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string;
  provider_transaction_id: string | null;
  status: PaymentStatus;
  amount_kz: number;
  raw_webhook_payload: Json | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  owner_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  owner_id: string;
  contact_id: string | null;
  type: string;
  lead_days: number | null;
  sent_at: string;
}
