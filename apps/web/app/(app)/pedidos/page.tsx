'use client';

import { useOrders } from '@presentei/api-client';
import { formatKz } from '@presentei/shared/utils';
import type { OrderStatus } from '@presentei/shared/types';
import { BagIcon } from '@/components/BagIcon';

function daysAgo(n: number): string {
  const d = new Date(2025, 5, 25);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number): string {
  const d = new Date(2025, 5, 25);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_ORDERS = [
  {
    id: 'ORD-001', owner_id: '', contact_id: null, digital_card_id: null,
    status: 'entregue' as OrderStatus, total_kz: 15000,
    scheduled_delivery_date: null, delivery_address: null,
    created_at: daysAgo(30), updated_at: daysAgo(28),
  },
  {
    id: 'ORD-002', owner_id: '', contact_id: null, digital_card_id: null,
    status: 'enviado' as OrderStatus, total_kz: 25000,
    scheduled_delivery_date: daysFromNow(2), delivery_address: 'Luanda, Angola',
    created_at: daysAgo(5), updated_at: daysAgo(3),
  },
  {
    id: 'ORD-003', owner_id: '', contact_id: null, digital_card_id: null,
    status: 'pago' as OrderStatus, total_kz: 12000,
    scheduled_delivery_date: daysFromNow(7), delivery_address: null,
    created_at: daysAgo(2), updated_at: daysAgo(1),
  },
  {
    id: 'ORD-004', owner_id: '', contact_id: null, digital_card_id: null,
    status: 'pendente' as OrderStatus, total_kz: 35000,
    scheduled_delivery_date: null, delivery_address: null,
    created_at: daysAgo(0), updated_at: daysAgo(0),
  },
  {
    id: 'ORD-005', owner_id: '', contact_id: null, digital_card_id: null,
    status: 'cancelado' as OrderStatus, total_kz: 8500,
    scheduled_delivery_date: null, delivery_address: null,
    created_at: daysAgo(15), updated_at: daysAgo(14),
  },
];

// ── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pendente: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
  pagamento_processando: { label: 'A processar', className: 'bg-blue-100 text-blue-800' },
  pago: { label: 'Pago', className: 'bg-green-100 text-green-800' },
  preparando: { label: 'Preparando', className: 'bg-blue-100 text-blue-800' },
  enviado: { label: 'Enviado', className: 'bg-indigo-100 text-indigo-800' },
  entregue: { label: 'Entregue', className: 'bg-gray-100 text-gray-600' },
  cancelado: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} de ${['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][d.getMonth()]} de ${d.getFullYear()}`;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PedidosPage() {
  const { data: apiOrders, isLoading } = useOrders();

  const orders = apiOrders && apiOrders.length > 0 ? apiOrders : DEMO_ORDERS;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-purple-dark">Pedidos</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-5 w-20 rounded-full bg-gray-200" />
              </div>
              <div className="h-3 w-32 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BagIcon className="mb-4 text-gray-300" size={64} />
          <p className="text-lg font-medium text-brand-purple-dark">
            Nenhum pedido ainda
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Os seus pedidos aparecerão aqui depois de realizar uma compra.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pendente;
            return (
              <div
                key={order.id}
                className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-brand-purple-dark">
                    {order.id}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusCfg.className}`}
                  >
                    {statusCfg.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>{formatDate(order.created_at)}</span>
                  <span className="font-semibold text-brand-purple-dark">
                    {formatKz(order.total_kz)}
                  </span>
                  {order.scheduled_delivery_date && (
                    <span>
                      Entrega: {formatDate(order.scheduled_delivery_date)}
                    </span>
                  )}
                  {order.delivery_address && (
                    <span className="truncate">{order.delivery_address}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
