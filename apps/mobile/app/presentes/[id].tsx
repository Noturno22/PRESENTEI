import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useProduct } from '@presentei/api-client';
import { formatKz } from '@presentei/shared/utils';

const DEMO_PRODUCT = {
  id: 'p1',
  category_id: '1',
  name: 'Kit Gourmet Especial',
  description: 'Seleção de vinhos e queijos importados, acompanhados de uma tábua de madeira artesanal. O presente perfeito para ocasiões especiais.',
  price_kz: 15000,
  image_url: null,
  is_active: true,
  is_kit: true,
  stock: 10,
  created_at: '',
  updated_at: '',
};

function LoadingSkeleton() {
  return (
    <View className="flex-1 bg-brand-off-white">
      <View className="px-4 pt-14 pb-6">
        <View className="mb-4 h-6 w-20 rounded bg-gray-200" />
        <View className="mb-4 aspect-square w-full rounded-2xl bg-gray-200" />
        <View className="mb-2 h-8 w-3/4 rounded bg-gray-200" />
        <View className="mb-1 h-6 w-1/3 rounded bg-gray-200" />
        <View className="mt-4 h-20 w-full rounded bg-gray-200" />
        <View className="mt-6 h-12 w-full rounded-full bg-gray-200" />
      </View>
    </View>
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: apiProduct, isLoading } = useProduct(id ?? '');
  const product = apiProduct ?? DEMO_PRODUCT;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const outOfStock = product.stock !== null && product.stock <= 0;

  return (
    <View className="flex-1 bg-brand-off-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-14 pb-6">
          {/* Back button */}
          <TouchableOpacity onPress={() => router.back()} className="mb-4 self-start">
            <Text className="text-sm font-medium text-brand-pink">← Voltar</Text>
          </TouchableOpacity>

          {/* Product image placeholder */}
          <View className="mb-5 aspect-square w-full items-center justify-center rounded-2xl bg-white shadow-sm">
            <Text className="text-6xl text-gray-300">🎁</Text>
            {product.is_kit && (
              <View className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-3 py-1">
                <Text className="text-xs font-semibold text-white">Kit</Text>
              </View>
            )}
          </View>

          {/* Product info */}
          <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <Text className="mb-1 text-2xl font-bold text-brand-purple-dark">
              {product.name}
            </Text>

            <View className="mb-4 flex-row items-center gap-3">
              <Text className="text-xl font-bold text-brand-purple-dark">
                {formatKz(product.price_kz)}
              </Text>
              {product.stock !== null && (
                <View
                  className={`rounded-full px-3 py-0.5 ${
                    outOfStock ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      outOfStock ? 'text-red-600' : 'text-green-700'
                    }`}
                  >
                    {outOfStock ? 'Esgotado' : `${product.stock} em stock`}
                  </Text>
                </View>
              )}
            </View>

            {product.description && (
              <View>
                <Text className="mb-1 text-sm font-semibold text-brand-purple-dark">
                  Descrição
                </Text>
                <Text className="text-sm leading-5 text-gray-600">
                  {product.description}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Buy button */}
      <View className="border-t border-gray-100 bg-white px-4 py-4">
        <TouchableOpacity
          onPress={() => {
            if (!outOfStock) {
              (router as any).push(`/checkout?productId=${product.id}`);
            }
          }}
          disabled={outOfStock}
          className={`items-center rounded-full px-6 py-3.5 ${
            outOfStock
              ? 'bg-gray-300'
              : 'bg-gradient-to-r from-brand-pink to-brand-orange'
          }`}
        >
          <Text className="text-sm font-semibold text-white">
            {outOfStock ? 'Indisponível' : 'Comprar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
