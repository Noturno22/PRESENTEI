import { useState, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useProducts, useCategories } from '@presentei/api-client';
import { formatKz } from '@presentei/shared/utils';

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

export default function PresentesTab() {
  const { data: apiProducts } = useProducts();
  const { data: apiCategories } = useCategories();
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
    <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-14 pb-6">
        <Text className="mb-6 text-2xl font-bold text-brand-purple-dark">Presentes</Text>

        {/* Category filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setActiveCategory(null)}
              className={`rounded-full px-5 py-2 ${activeCategory === null ? 'bg-brand-pink' : 'bg-white'}`}
            >
              <Text className={`text-sm font-medium ${activeCategory === null ? 'text-white' : 'text-gray-600'}`}>
                Todos
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.name)}
                className={`rounded-full px-5 py-2 ${activeCategory === cat.name ? 'bg-brand-pink' : 'bg-white'}`}
              >
                <Text className={`text-sm font-medium ${activeCategory === cat.name ? 'text-white' : 'text-gray-600'}`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <View className="items-center py-16">
            <Text className="mb-4 text-4xl">🎁</Text>
            <Text className="text-lg font-medium text-brand-purple-dark">
              Nenhum presente encontrado
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              Tente selecionar outra categoria.
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-4">
            {filteredProducts.map((product) => (
              <TouchableOpacity key={product.id} className="w-[calc(50%-8px)] rounded-xl bg-white p-3 shadow-sm">
                <View className="relative mb-3 aspect-square items-center justify-center rounded-lg bg-gray-50">
                  <Text className="text-4xl text-gray-300">🎁</Text>
                  {product.is_kit && (
                    <View className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-2.5 py-0.5">
                      <Text className="text-[10px] font-semibold text-white">Kit</Text>
                    </View>
                  )}
                </View>
                <Text className="text-sm font-medium text-brand-purple-dark" numberOfLines={1}>
                  {product.name}
                </Text>
                <Text className="mt-1 text-sm font-semibold text-brand-purple-dark">
                  {formatKz(product.price_kz)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
