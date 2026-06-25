'use client';

import { useState, useMemo } from 'react';
import { useProducts, useCategories } from '@presentei/api-client';
import { formatKz } from '@presentei/shared/utils';
import { GiftIcon } from '@/components/GiftIcon';

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_CATEGORIES = [
  { id: '1', name: 'Kits', icon_key: 'gift', display_order: 1, created_at: '' },
  { id: '2', name: 'Experiências', icon_key: 'network', display_order: 2, created_at: '' },
  { id: '3', name: 'Tecnologia', icon_key: 'device', display_order: 3, created_at: '' },
  { id: '4', name: 'Beleza', icon_key: 'bottle', display_order: 4, created_at: '' },
];

const DEMO_PRODUCTS = [
  { id: 'p1', category_id: '1', name: 'Kit Gourmet Especial', description: 'Seleção de vinhos e queijos', price_kz: 15000, image_url: null, is_active: true, is_kit: true, stock: 10, created_at: '', updated_at: '' },
  { id: 'p2', category_id: '2', name: 'Jantar Romântico', description: 'Jantar para duas pessoas', price_kz: 25000, image_url: null, is_active: true, is_kit: false, stock: 5, created_at: '', updated_at: '' },
  { id: 'p3', category_id: '3', name: 'Auriculares Bluetooth', description: 'Som premium', price_kz: 35000, image_url: null, is_active: true, is_kit: false, stock: 20, created_at: '', updated_at: '' },
  { id: 'p4', category_id: '4', name: 'Kit Beleza Premium', description: 'Cuidados essenciais', price_kz: 12000, image_url: null, is_active: true, is_kit: true, stock: 15, created_at: '', updated_at: '' },
  { id: 'p5', category_id: '1', name: 'Cesta de Café da Manhã', description: 'Para começar o dia bem', price_kz: 8500, image_url: null, is_active: true, is_kit: true, stock: 25, created_at: '', updated_at: '' },
  { id: 'p6', category_id: '3', name: 'Smartwatch Desportivo', description: 'Para quem ama desporto', price_kz: 45000, image_url: null, is_active: true, is_kit: false, stock: 8, created_at: '', updated_at: '' },
  { id: 'p7', category_id: '4', name: 'Perfume Importado', description: 'Fragrância única', price_kz: 28000, image_url: null, is_active: true, is_kit: false, stock: 12, created_at: '', updated_at: '' },
  { id: 'p8', category_id: '2', name: 'Aula de Culinária', description: 'Aprenda pratos angolanos', price_kz: 18000, image_url: null, is_active: true, is_kit: false, stock: 10, created_at: '', updated_at: '' },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PresentesPage() {
  const { data: apiProducts, isLoading: loadingProducts } = useProducts();
  const { data: apiCategories, isLoading: loadingCategories } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = apiCategories && apiCategories.length > 0 ? apiCategories : DEMO_CATEGORIES;
  const allProducts = apiProducts && apiProducts.length > 0 ? apiProducts : DEMO_PRODUCTS;

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return allProducts;
    const cat = categories.find((c) => c.name === activeCategory);
    if (!cat) return allProducts;
    return allProducts.filter((p) => p.category_id === cat.id);
  }, [allProducts, activeCategory, categories]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-purple-dark">Presentes</h1>

      {/* ── Category filters ────────────────────────────────────────────── */}
      {loadingCategories ? (
        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-brand-pink text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.name
                  ? 'bg-brand-pink text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Products grid ──────────────────────────────────────────────── */}
      {loadingProducts ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse space-y-2 rounded-xl bg-white p-3 shadow-sm">
              <div className="aspect-square rounded-lg bg-gray-200" />
              <div className="h-3 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GiftIcon className="mb-4 text-gray-300" size={64} />
          <p className="text-lg font-medium text-brand-purple-dark">
            Nenhum presente encontrado
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Tente selecionar outra categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image placeholder */}
              <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <GiftIcon className="text-gray-300" size={48} />
                )}
                {product.is_kit && (
                  <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    Kit
                  </span>
                )}
              </div>
              <p className="truncate text-sm font-medium text-brand-purple-dark">
                {product.name}
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-purple-dark">
                {formatKz(product.price_kz)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
