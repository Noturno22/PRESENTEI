'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProduct, useContacts, useCreateOrder } from '@presentei/api-client';
import { formatKz } from '@presentei/shared/utils';
import { GiftIcon } from '@/components/GiftIcon';

const DEMO_PRODUCT = {
  id: 'p1', category_id: '1', name: 'Kit Gourmet Especial',
  description: 'Seleção de vinhos e queijos', price_kz: 15000,
  image_url: null, is_active: true, is_kit: true, stock: 10,
  created_at: '', updated_at: '',
};

const DEMO_CONTACTS = [
  { id: 'c1', owner_id: '', full_name: 'Maria Santos', relation: 'amigo' as const, birth_date: '', photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c2', owner_id: '', full_name: 'João Agostinho', relation: 'familia' as const, birth_date: '', photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c3', owner_id: '', full_name: 'Ana Paula', relation: 'parceiro' as const, birth_date: '', photo_url: null, notes: null, created_at: '', updated_at: '' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [productId, setProductId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProductId(params.get('productId') ?? '');
  }, []);

  const { data: apiProduct, isLoading: loadingProduct } = useProduct(productId);
  const { data: apiContacts, isLoading: loadingContacts } = useContacts();
  const createOrder = useCreateOrder();

  const product = apiProduct ?? DEMO_PRODUCT;
  const contacts = apiContacts && apiContacts.length > 0 ? apiContacts : DEMO_CONTACTS;

  const [contactId, setContactId] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    if (!productId) {
      setError('Nenhum produto selecionado.');
      return;
    }

    if (!contactId) {
      setError('Selecione um contacto.');
      return;
    }

    try {
      await createOrder.mutateAsync({
        contactId,
        scheduledDeliveryDate: deliveryDate || undefined,
        deliveryAddress: deliveryAddress || undefined,
        items: [{ productId, quantity: 1 }],
      });
      router.push('/pedidos');
    } catch {
      setError('Ocorreu um erro ao criar o pedido.');
    }
  }

  if (loadingProduct || loadingContacts) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse space-y-6">
        <div className="h-8 w-32 rounded bg-gray-200" />
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 space-y-2">
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 space-y-1">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-10 w-full rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-purple-dark">Checkout</h1>

      {/* ── Product summary ────────────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full rounded-xl object-cover" />
            ) : (
              <GiftIcon className="text-gray-300" size={32} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-purple-dark">{product.name}</p>
            <p className="text-sm font-semibold text-brand-pink">{formatKz(product.price_kz)}</p>
            <p className="text-xs text-gray-500">Quantidade: 1</p>
          </div>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {/* Contact */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Contacto
            </label>
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
            >
              <option value="">Selecione um contacto</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Data de entrega
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
            />
            <p className="mt-1 text-xs text-gray-400">Opcional</p>
          </div>

          {/* Delivery address */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Endereço de entrega
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
              placeholder="Luanda, Angola"
            />
            <p className="mt-1 text-xs text-gray-400">Opcional</p>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={createOrder.isPending}
          className="mt-6 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createOrder.isPending ? 'A criar pedido...' : 'Criar pedido'}
        </button>
      </div>
    </div>
  );
}
