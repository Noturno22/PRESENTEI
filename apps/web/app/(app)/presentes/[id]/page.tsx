'use client';

import { use } from 'react';
import Link from 'next/link';
import { useProduct } from '@presentei/api-client';
import { formatKz } from '@presentei/shared/utils';
import { GiftIcon } from '@/components/GiftIcon';

const DEMO_PRODUCTS: Record<string, {
  id: string; category_id: string | null; name: string; description: string | null;
  price_kz: number; image_url: string | null; is_active: boolean; is_kit: boolean;
  stock: number | null; created_at: string; updated_at: string;
}> = {
  p1: { id: 'p1', category_id: '1', name: 'Kit Gourmet Especial', description: 'Seleção de vinhos e queijos importados, perfeito para uma noite especial.', price_kz: 15000, image_url: null, is_active: true, is_kit: true, stock: 10, created_at: '', updated_at: '' },
  p2: { id: 'p2', category_id: '2', name: 'Jantar Romântico', description: 'Jantar para duas pessoas num restaurante exclusivo com menu personalizado.', price_kz: 25000, image_url: null, is_active: true, is_kit: false, stock: 5, created_at: '', updated_at: '' },
  p3: { id: 'p3', category_id: '3', name: 'Auriculares Bluetooth', description: 'Som premium com cancelamento de ruído ativo e bateria de longa duração.', price_kz: 35000, image_url: null, is_active: true, is_kit: false, stock: 20, created_at: '', updated_at: '' },
  p4: { id: 'p4', category_id: '4', name: 'Kit Beleza Premium', description: 'Conjunto de cuidados essenciais com produtos selecionados.', price_kz: 12000, image_url: null, is_active: true, is_kit: true, stock: 15, created_at: '', updated_at: '' },
  p5: { id: 'p5', category_id: '1', name: 'Cesta de Café da Manhã', description: 'Para começar o dia bem com produtos frescos e especiais.', price_kz: 8500, image_url: null, is_active: true, is_kit: true, stock: 25, created_at: '', updated_at: '' },
  p6: { id: 'p6', category_id: '3', name: 'Smartwatch Desportivo', description: 'Monitorize a sua saúde e atividades desportivas com estilo.', price_kz: 45000, image_url: null, is_active: true, is_kit: false, stock: 8, created_at: '', updated_at: '' },
  p7: { id: 'p7', category_id: '4', name: 'Perfume Importado', description: 'Fragrância única e duradoura para ocasiões especiais.', price_kz: 28000, image_url: null, is_active: true, is_kit: false, stock: 12, created_at: '', updated_at: '' },
  p8: { id: 'p8', category_id: '2', name: 'Aula de Culinária', description: 'Aprenda pratos típicos angolanos com chefs experientes.', price_kz: 18000, image_url: null, is_active: true, is_kit: false, stock: 10, created_at: '', updated_at: '' },
};

export default function ProdutoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: apiProduct, isLoading } = useProduct(id);

  const product = apiProduct ?? DEMO_PRODUCTS[id] ?? null;

  return (
    <div className="mx-auto max-w-3xl">
      {/* ── Back link ───────────────────────────────────────────────────── */}
      <Link
        href="/presentes"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand-pink transition-colors hover:text-pink-600"
      >
        <span aria-hidden>&larr;</span>
        Voltar para presentes
      </Link>

      {isLoading ? (
        /* ── Loading skeleton ──────────────────────────────────────────── */
        <div className="animate-pulse space-y-6">
          <div className="aspect-video w-full rounded-2xl bg-gray-200" />
          <div className="space-y-3">
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-4 w-1/4 rounded bg-gray-200" />
            <div className="h-20 w-full rounded bg-gray-200" />
          </div>
        </div>
      ) : !product ? (
        /* ── 404 state ────────────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GiftIcon className="mb-4 text-gray-300" size={64} />
          <p className="text-lg font-medium text-brand-purple-dark">
            Presente não encontrado
          </p>
          <p className="mt-1 text-sm text-gray-500">
            O presente que procura não existe ou foi removido.
          </p>
          <Link
            href="/presentes"
            className="mt-6 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Ver todos os presentes
          </Link>
        </div>
      ) : (
        /* ── Product details ──────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Image */}
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gray-50">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <GiftIcon className="text-gray-300" size={80} />
            )}
            {product.is_kit && (
              <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-3 py-1 text-xs font-semibold text-white">
                Kit
              </span>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold text-brand-purple-dark">
              {product.name}
            </h1>

            <p className="mt-3 text-2xl font-bold text-brand-pink">
              {formatKz(product.price_kz)}
            </p>

            <div className="mt-4 space-y-2">
              {product.stock !== null && (
                <p className="text-sm text-gray-500">
                  Stock:{' '}
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                    {product.stock > 0 ? `${product.stock} unidades` : 'Indisponível'}
                  </span>
                </p>
              )}
            </div>

            {product.description && (
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}
          </div>

          {/* Buy button */}
          <Link
            href={`/checkout?productId=${product.id}`}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-10 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Comprar
          </Link>
        </div>
      )}
    </div>
  );
}
