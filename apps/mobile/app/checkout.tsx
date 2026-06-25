import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useProduct, useContacts, useCreateOrder } from '@presentei/api-client';
import { formatKz } from '@presentei/shared/utils';
import type { Contact } from '@presentei/shared/types';

const DEMO_CONTACTS: Contact[] = [
  { id: 'dc1', owner_id: '', full_name: 'Maria Santos', relation: 'amigo', birth_date: new Date().toISOString(), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'dc2', owner_id: '', full_name: 'João Agostinho', relation: 'familia', birth_date: new Date().toISOString(), photo_url: null, notes: null, created_at: '', updated_at: '' },
];

const DEMO_PRODUCT = {
  id: 'p1',
  category_id: '1',
  name: 'Kit Gourmet Especial',
  description: 'Seleção de vinhos e queijos',
  price_kz: 15000,
  image_url: null,
  is_active: true,
  is_kit: true,
  stock: 10,
  created_at: '',
  updated_at: '',
};

export default function CheckoutScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { data: apiProduct } = useProduct(productId ?? '');
  const { data: apiContacts } = useContacts();
  const createOrder = useCreateOrder();

  const product = apiProduct ?? DEMO_PRODUCT;
  const contacts = apiContacts && apiContacts.length > 0 ? apiContacts : DEMO_CONTACTS;

  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    if (!selectedContactId) {
      setError('Selecione um contacto.');
      return;
    }

    const items = [{ productId: product.id, quantity: 1 }];

    try {
      const orderData: {
        contactId: string;
        items: { productId: string; quantity: number }[];
        scheduledDeliveryDate?: string;
        deliveryAddress?: string;
      } = {
        contactId: selectedContactId,
        items,
      };

      if (deliveryDate.trim()) {
        const parsed = new Date(deliveryDate);
        if (isNaN(parsed.getTime())) {
          setError('Data de entrega inválida. Use AAAA-MM-DD.');
          return;
        }
        orderData.scheduledDeliveryDate = parsed.toISOString();
      }

      if (deliveryAddress.trim()) {
        orderData.deliveryAddress = deliveryAddress.trim();
      }

      await createOrder.mutateAsync(orderData);
      Alert.alert('Pedido criado!', 'O seu pedido foi registado com sucesso.', [
        {
          text: 'Ver pedidos',
          onPress: () => router.replace('/(tabs)/pedidos'),
        },
      ]);
    } catch {
      setError('Ocorreu um erro ao criar o pedido. Tente novamente.');
    }
  }

  return (
    <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-14 pb-6">
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} className="mb-6 self-start">
          <Text className="text-sm font-medium text-brand-pink">← Voltar</Text>
        </TouchableOpacity>

        <Text className="mb-6 text-2xl font-bold text-brand-purple-dark">Checkout</Text>

        {error && (
          <View className="mb-4 rounded-lg bg-red-50 p-3">
            <Text className="text-center text-sm text-red-600">{error}</Text>
          </View>
        )}

        {/* Product summary */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center gap-3">
            <View className="h-14 w-14 items-center justify-center rounded-xl bg-gray-50">
              <Text className="text-2xl text-gray-300">🎁</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-brand-purple-dark" numberOfLines={1}>
                {product.name}
              </Text>
              <Text className="text-sm font-semibold text-brand-pink">
                {formatKz(product.price_kz)}
              </Text>
            </View>
            <Text className="text-sm text-gray-400">×1</Text>
          </View>
        </View>

        {/* Contact selector */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-3 text-sm font-semibold text-brand-purple-dark">
            Selecionar contacto
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            <View className="flex-row gap-2 px-1">
              {contacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  onPress={() => setSelectedContactId(contact.id)}
                  className={`rounded-full border px-4 py-2 ${
                    selectedContactId === contact.id
                      ? 'border-brand-pink bg-brand-pink/10'
                      : 'border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedContactId === contact.id
                        ? 'text-brand-pink'
                        : 'text-gray-500'
                    }`}
                  >
                    {contact.full_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Delivery date */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-1 text-sm font-semibold text-brand-purple-dark">
            Data de entrega (opcional)
          </Text>
          <TextInput
            value={deliveryDate}
            onChangeText={setDeliveryDate}
            placeholder="AAAA-MM-DD"
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
          />
        </View>

        {/* Delivery address */}
        <View className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-1 text-sm font-semibold text-brand-purple-dark">
            Endereço de entrega (opcional)
          </Text>
          <TextInput
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            placeholder="Luanda, Angola"
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={createOrder.isPending}
          className="items-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-3.5"
        >
          <Text className="text-sm font-semibold text-white">
            {createOrder.isPending ? 'A criar pedido...' : 'Criar Pedido'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
