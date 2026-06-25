'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useUpcomingBirthdays, useCategories, useProducts, useProfile } from '@presentei/api-client';
import { formatKz, daysUntil, formatDate, getAge } from '@presentei/shared/utils';
import { GiftIcon } from '@/components/GiftIcon';
import { HeartIcon } from '@/components/HeartIcon';

function daysFromNow(n: number): string {
  const d = new Date(2025, 5, 25);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

// ── Demo data fallbacks ──────────────────────────────────────────────────────

const DEMO_BIRTHDAYS = [
  {
    id: '1',
    owner_id: '',
    full_name: 'Maria Santos',
    relation: 'amigo' as const,
    birth_date: daysFromNow(2),
    photo_url: null,
    notes: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    owner_id: '',
    full_name: 'João Agostinho',
    relation: 'familia' as const,
    birth_date: daysFromNow(5),
    photo_url: null,
    notes: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    owner_id: '',
    full_name: 'Ana Paula',
    relation: 'parceiro' as const,
    birth_date: daysFromNow(12),
    photo_url: null,
    notes: null,
    created_at: '',
    updated_at: '',
  },
];

const DEMO_CATEGORIES = [
  { id: '1', name: 'Kits', icon_key: 'gift', display_order: 1, created_at: '' },
  { id: '2', name: 'Experiências', icon_key: 'network', display_order: 2, created_at: '' },
  { id: '3', name: 'Tecnologia', icon_key: 'device', display_order: 3, created_at: '' },
  { id: '4', name: 'Beleza', icon_key: 'bottle', display_order: 4, created_at: '' },
];

const DEMO_PRODUCTS = [
  {
    id: '1', category_id: '1', name: 'Kit Gourmet Especial', description: null,
    price_kz: 15000, image_url: null, is_active: true, is_kit: true, stock: 10,
    created_at: '', updated_at: '',
  },
  {
    id: '2', category_id: '2', name: 'Jantar Romântico', description: null,
    price_kz: 25000, image_url: null, is_active: true, is_kit: false, stock: 5,
    created_at: '', updated_at: '',
  },
  {
    id: '3', category_id: '3', name: 'Auriculares Bluetooth', description: null,
    price_kz: 35000, image_url: null, is_active: true, is_kit: false, stock: 20,
    created_at: '', updated_at: '',
  },
  {
    id: '4', category_id: '4', name: 'Kit Beleza Premium', description: null,
    price_kz: 12000, image_url: null, is_active: true, is_kit: true, stock: 15,
    created_at: '', updated_at: '',
  },
];

const DEMO_PROFILE = {
  id: '',
  full_name: 'João',
  phone: null,
  avatar_url: null,
  city: null,
  notification_lead_days: null,
  created_at: '',
  updated_at: '',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const CATEGORY_ICONS: Record<string, string> = {
  gift: '🎁',
  network: '🎟',
  device: '📱',
  bottle: '🧴',
};

// ── Components ───────────────────────────────────────────────────────────────

function AvatarCircle({ name, photoUrl, className = '' }: { name: string; photoUrl?: string | null; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-orange text-sm font-bold text-white ${className}`}
    >
      {photoUrl ? (
        <img src={photoUrl} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const SSR_NOW = new Date(2025, 5, 25);

export default function InicioPage() {
  const now = useMemo(() => SSR_NOW, []);

  const { data: apiBirthdays, isLoading: loadingBirthdays } = useUpcomingBirthdays(30);
  const { data: apiCategories, isLoading: loadingCategories } = useCategories();
  const { data: apiProducts, isLoading: loadingProducts } = useProducts();
  const { data: apiProfile, isLoading: loadingProfile } = useProfile();

  const birthdays = apiBirthdays && apiBirthdays.length > 0 ? apiBirthdays : DEMO_BIRTHDAYS;
  const categories = apiCategories && apiCategories.length > 0 ? apiCategories : DEMO_CATEGORIES;
  const products = apiProducts && apiProducts.length > 0 ? apiProducts : DEMO_PRODUCTS;
  const profile = apiProfile ?? DEMO_PROFILE;

  const firstName = profile?.full_name?.split(' ')[0] ?? 'João';
  const upcomingBirthdays = birthdays.slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ── Greeting ────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-brand-purple-dark md:text-3xl">
          Olá, {firstName}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Nunca mais esqueça alguém especial.
        </p>
      </div>

      {/* ── Upcoming Birthdays Card ─────────────────────────────────────── */}
      <section className="rounded-2xl bg-brand-purple-dark p-5 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Próximos aniversários</h2>
          <Link
            href="/calendario"
            className="text-sm font-medium text-brand-pink transition-colors hover:text-pink-300"
          >
            Ver todos
          </Link>
        </div>

        {loadingBirthdays ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-white/20" />
                  <div className="h-2 w-24 rounded bg-white/10" />
                </div>
                <div className="h-6 w-16 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
        ) : upcomingBirthdays.length === 0 ? (
          <p className="text-sm text-white/60">Nenhum aniversário nos próximos 30 dias.</p>
        ) : (
          <ul className="space-y-3">
            {upcomingBirthdays.map((contact) => {
              const age = getAge(contact.birth_date, now);
              const days = daysUntil(contact.birth_date, now);
              return (
                <li key={contact.id} className="flex items-center gap-3">
                  <AvatarCircle
                    name={contact.full_name}
                    photoUrl={contact.photo_url}
                    className="h-10 w-10 shrink-0 text-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{contact.full_name}</p>
                    <p className="text-xs text-white/60">
                      {age} anos — {formatDate(contact.birth_date)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-pink/20 px-3 py-1 text-xs font-medium text-brand-pink">
                    Falta {days}d
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {birthdays.length > 3 && (
          <Link
            href="/calendario"
            className="mt-3 block text-center text-sm font-medium text-brand-pink transition-colors hover:text-pink-300"
          >
            Ver todos ({birthdays.length} aniversários)
          </Link>
        )}
      </section>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-brand-purple-dark">
          Categorias
        </h2>
        {loadingCategories ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex shrink-0 flex-col items-center gap-2">
                <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/presentes?categoria=${encodeURIComponent(cat.name)}`}
                className="flex shrink-0 flex-col items-center gap-2"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl shadow-sm transition-transform hover:scale-105">
                  {CATEGORY_ICONS[cat.icon_key] ?? '🎁'}
                </div>
                <span className="text-xs font-medium text-gray-600">{cat.name}</span>
              </Link>
            ))}
            <Link
              href="/presentes"
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl shadow-sm transition-transform hover:scale-105">
                ⋯
              </div>
              <span className="text-xs font-medium text-gray-600">Ver todas</span>
            </Link>
          </div>
        )}
      </section>

      {/* ── Kits em promoção Banner ─────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple-dark to-[#3D1A5C] p-6 text-white">
        <div className="relative z-10 max-w-[70%]">
          <h3 className="text-xl font-bold">Kits em promoção 🎉</h3>
          <p className="mt-1 text-sm text-white/70">
            Conjuntos especiais com preços imperdíveis
          </p>
          <Link
            href="/presentes?categoria=Kits"
            className="mt-4 inline-block rounded-full bg-brand-pink px-6 py-2 text-sm font-semibold transition-colors hover:bg-pink-600"
          >
            Ver kits
          </Link>
        </div>
        <div className="absolute bottom-0 right-0 opacity-20">
          <GiftIcon size={140} className="text-white" />
        </div>
      </section>

      {/* ── Sugestões ───────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-purple-dark">
            Sugestões
          </h2>
          <Link
            href="/presentes"
            className="text-sm font-medium text-brand-pink transition-colors hover:text-pink-600"
          >
            Ver mais
          </Link>
        </div>

        {loadingProducts ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex shrink-0 flex-col gap-2">
                <div className="h-36 w-36 animate-pulse rounded-xl bg-gray-200" />
                <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum produto disponível.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {products.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href={`/presentes`}
                className="flex shrink-0 flex-col gap-2"
              >
                <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-white shadow-sm">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <GiftIcon className="text-gray-300" size={48} />
                  )}
                </div>
                <p className="max-w-[144px] truncate text-sm font-medium text-brand-purple-dark">
                  {product.name}
                </p>
                <p className="text-sm font-semibold text-brand-purple-dark">
                  {formatKz(product.price_kz)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
