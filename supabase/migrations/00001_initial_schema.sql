-- ============================================================================
-- Presentei — Initial Schema (Migration 00001)
-- ============================================================================
-- Este ficheiro contém o schema inicial completo:
--   - Extensão pgcrypto
--   - Função utilitária set_updated_at()
--   - Tabelas: profiles, contacts, categories, products, digital_cards,
--     orders, order_items, payments, subscriptions, notifications_log
--   - Triggers, índices e políticas RLS para cada tabela
--   - Trigger handle_new_user() para criar profile automaticamente no signup
-- ============================================================================

-- 0. Extensões
create extension if not exists "pgcrypto";

-- 1. Função utilitária: set_updated_at()
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. Tabela: profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  city text,
  notification_lead_days int[] default array[11, 5, 1],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- 2a. Trigger: handle_new_user()
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 3. Tabela: contacts
create type contact_relation as enum (
  'familia', 'amigo', 'parceiro', 'colega', 'outro'
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  full_name text not null,
  relation contact_relation not null default 'outro',
  birth_date date not null,
  photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_contacts_owner on contacts(owner_id);
create index idx_contacts_birth_date on contacts(birth_date);

create trigger trg_contacts_updated_at
  before update on contacts
  for each row execute function set_updated_at();

alter table contacts enable row level security;

create policy "Users manage own contacts"
  on contacts for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- 4. Tabela: categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_key text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

create policy "Anyone can read categories"
  on categories for select
  using (true);

-- Nota: Sem policy de insert/update/delete para usuários comuns;
-- gestão de catálogo feita via service_role (admin/dashboard interno futuro).

-- 5. Tabela: products
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price_kz numeric(12,2) not null check (price_kz >= 0),
  image_url text,
  is_active boolean not null default true,
  is_kit boolean not null default false,
  stock int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on products(category_id);
create index idx_products_active on products(is_active);

create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

alter table products enable row level security;

create policy "Anyone can read active products"
  on products for select
  using (is_active = true);

-- 6. Tabela: digital_cards
create table digital_cards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  template_key text not null,
  message text not null,
  recipient_name text,
  created_at timestamptz not null default now()
);

create index idx_digital_cards_owner on digital_cards(owner_id);

alter table digital_cards enable row level security;

create policy "Users manage own digital cards"
  on digital_cards for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- 7. Tabelas: orders + order_items
create type order_status as enum (
  'pendente', 'pagamento_processando', 'pago', 'preparando',
  'enviado', 'entregue', 'cancelado'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete restrict,
  contact_id uuid references contacts(id) on delete set null,
  digital_card_id uuid references digital_cards(id) on delete set null,
  status order_status not null default 'pendente',
  total_kz numeric(12,2) not null check (total_kz >= 0),
  scheduled_delivery_date date,
  delivery_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_owner on orders(owner_id);
create index idx_orders_status on orders(status);

create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

alter table orders enable row level security;

create policy "Users manage own orders"
  on orders for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  quantity int not null check (quantity > 0),
  unit_price_kz numeric(12,2) not null check (unit_price_kz >= 0),
  created_at timestamptz not null default now()
);

create index idx_order_items_order on order_items(order_id);

alter table order_items enable row level security;

create policy "Users manage items of own orders"
  on order_items for all
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.owner_id = auth.uid()
    )
  );

-- 8. Tabela: payments
create type payment_status as enum (
  'iniciado', 'sucesso', 'falhou', 'expirado'
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete restrict,
  provider text not null default 'emis',
  provider_transaction_id text,
  status payment_status not null default 'iniciado',
  amount_kz numeric(12,2) not null check (amount_kz >= 0),
  raw_webhook_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_payments_order on payments(order_id);

create trigger trg_payments_updated_at
  before update on payments
  for each row execute function set_updated_at();

alter table payments enable row level security;

create policy "Users read own payments"
  on payments for select
  using (
    exists (
      select 1 from orders
      where orders.id = payments.order_id
      and orders.owner_id = auth.uid()
    )
  );

-- Nota: Sem policy de insert/update para authenticated;
-- apenas service_role (usado pela Edge Function do webhook) pode escrever.

-- 9. Tabela: subscriptions
create type subscription_plan as enum ('basico', 'premium', 'familia');
create type subscription_status as enum ('ativa', 'cancelada', 'expirada');

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  plan subscription_plan not null,
  status subscription_status not null default 'ativa',
  current_period_end date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_owner on subscriptions(owner_id);

create trigger trg_subscriptions_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

alter table subscriptions enable row level security;

create policy "Users read own subscription"
  on subscriptions for select
  using (auth.uid() = owner_id);

-- Nota: Insert/update de subscriptions também deve passar por backend
-- (webhook de pagamento recorrente), não diretamente pelo client.

-- 10. Tabela: notifications_log
create table notifications_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  type text not null,
  lead_days int,
  sent_at timestamptz not null default now()
);

create index idx_notifications_log_owner on notifications_log(owner_id);
create unique index idx_notifications_unique_per_day
  on notifications_log(contact_id, type, lead_days, (sent_at::date));

alter table notifications_log enable row level security;

create policy "Users read own notification log"
  on notifications_log for select
  using (auth.uid() = owner_id);

-- Nota: Insert feito via service_role pela Edge Function de cron.
