import { ScrollView, View, Text } from 'react-native';
import { useOrders } from '@presentei/api-client';
import { formatKz } from '@presentei/shared/utils';
import type { OrderStatus } from '@presentei/shared/types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

const DEMO_ORDERS = [
  { id: 'ORD-001', owner_id: '', contact_id: null, digital_card_id: null, status: 'entregue' as OrderStatus, total_kz: 15000, scheduled_delivery_date: null, delivery_address: null, created_at: daysAgo(30), updated_at: daysAgo(28) },
  { id: 'ORD-002', owner_id: '', contact_id: null, digital_card_id: null, status: 'enviado' as OrderStatus, total_kz: 25000, scheduled_delivery_date: daysFromNow(2), delivery_address: 'Luanda, Angola', created_at: daysAgo(5), updated_at: daysAgo(3) },
  { id: 'ORD-003', owner_id: '', contact_id: null, digital_card_id: null, status: 'pago' as OrderStatus, total_kz: 12000, scheduled_delivery_date: daysFromNow(7), delivery_address: null, created_at: daysAgo(2), updated_at: daysAgo(1) },
  { id: 'ORD-004', owner_id: '', contact_id: null, digital_card_id: null, status: 'pendente' as OrderStatus, total_kz: 35000, scheduled_delivery_date: null, delivery_address: null, created_at: daysAgo(0), updated_at: daysAgo(0) },
  { id: 'ORD-005', owner_id: '', contact_id: null, digital_card_id: null, status: 'cancelado' as OrderStatus, total_kz: 8500, scheduled_delivery_date: null, delivery_address: null, created_at: daysAgo(15), updated_at: daysAgo(14) },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pendente: { label: 'Pendente', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  pagamento_processando: { label: 'A processar', bg: 'bg-blue-100', text: 'text-blue-800' },
  pago: { label: 'Pago', bg: 'bg-green-100', text: 'text-green-800' },
  preparando: { label: 'Preparando', bg: 'bg-blue-100', text: 'text-blue-800' },
  enviado: { label: 'Enviado', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  entregue: { label: 'Entregue', bg: 'bg-gray-100', text: 'text-gray-600' },
  cancelado: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-800' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PedidosTab() {
  const { data: apiOrders } = useOrders();
  const orders = apiOrders && apiOrders.length > 0 ? apiOrders : DEMO_ORDERS;

  return (
    <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-14 pb-6">
        <Text className="mb-6 text-2xl font-bold text-brand-purple-dark">Pedidos</Text>

        {orders.length === 0 ? (
          <View className="items-center py-16">
            <Text className="mb-4 text-6xl">🛍️</Text>
            <Text className="text-lg font-medium text-brand-purple-dark">
              Nenhum pedido ainda
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              Os seus pedidos aparecerão aqui depois de realizar uma compra.
            </Text>
          </View>
        ) : (
          orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pendente;
            return (
              <View key={order.id} className="mb-3 rounded-xl bg-white p-4 shadow-sm">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-brand-purple-dark">
                    {order.id}
                  </Text>
                  <View className={`rounded-full px-3 py-1 ${statusCfg.bg}`}>
                    <Text className={`text-xs font-medium ${statusCfg.text}`}>
                      {statusCfg.label}
                    </Text>
                  </View>
                </View>
                <View className="flex-row flex-wrap gap-x-4 gap-y-1">
                  <Text className="text-xs text-gray-500">{formatDate(order.created_at)}</Text>
                  <Text className="text-xs font-semibold text-brand-purple-dark">
                    {formatKz(order.total_kz)}
                  </Text>
                  {order.scheduled_delivery_date && (
                    <Text className="text-xs text-gray-500">
                      Entrega: {formatDate(order.scheduled_delivery_date)}
                    </Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
