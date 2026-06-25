import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { useUpcomingBirthdays, useCategories, useProducts, useProfile } from '@presentei/api-client';
import { formatKz, daysUntil, formatDate, getAge } from '@presentei/shared/utils';

const DEMO_BIRTHDAYS = [
  { id: '1', owner_id: '', full_name: 'Maria Santos', relation: 'amigo' as const, birth_date: new Date(Date.now() + 2 * 86400000).toISOString(), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: '2', owner_id: '', full_name: 'João Agostinho', relation: 'familia' as const, birth_date: new Date(Date.now() + 5 * 86400000).toISOString(), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: '3', owner_id: '', full_name: 'Ana Paula', relation: 'parceiro' as const, birth_date: new Date(Date.now() + 12 * 86400000).toISOString(), photo_url: null, notes: null, created_at: '', updated_at: '' },
];

const DEMO_CATEGORIES = [
  { id: '1', name: 'Kits', icon_key: 'gift', display_order: 1, created_at: '' },
  { id: '2', name: 'Experiências', icon_key: 'network', display_order: 2, created_at: '' },
  { id: '3', name: 'Tecnologia', icon_key: 'device', display_order: 3, created_at: '' },
  { id: '4', name: 'Beleza', icon_key: 'bottle', display_order: 4, created_at: '' },
];

const DEMO_PRODUCTS = [
  { id: '1', category_id: '1', name: 'Kit Gourmet Especial', description: null, price_kz: 15000, image_url: null, is_active: true, is_kit: true, stock: 10, created_at: '', updated_at: '' },
  { id: '2', category_id: '2', name: 'Jantar Romântico', description: null, price_kz: 25000, image_url: null, is_active: true, is_kit: false, stock: 5, created_at: '', updated_at: '' },
  { id: '3', category_id: '3', name: 'Auriculares Bluetooth', description: null, price_kz: 35000, image_url: null, is_active: true, is_kit: false, stock: 20, created_at: '', updated_at: '' },
  { id: '4', category_id: '4', name: 'Kit Beleza Premium', description: null, price_kz: 12000, image_url: null, is_active: true, is_kit: true, stock: 15, created_at: '', updated_at: '' },
];

const DEMO_PROFILE = { id: '', full_name: 'João', phone: null, avatar_url: null, city: null, notification_lead_days: null, created_at: '', updated_at: '' };

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function AvatarCircle({ name, photoUrl, size = 40 }: { name: string; photoUrl?: string | null; size?: number }) {
  const initials = getInitials(name);
  return (
    <View
      className="items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-orange"
      style={{ width: size, height: size }}
    >
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} className="h-full w-full rounded-full" />
      ) : (
        <Text className="text-xs font-bold text-white">{initials}</Text>
      )}
    </View>
  );
}

const CATEGORY_EMOJIS: Record<string, string> = {
  gift: '🎁', network: '🎟', device: '📱', bottle: '🧴',
};

export default function InicioTab() {
  const { data: apiBirthdays } = useUpcomingBirthdays(30);
  const { data: apiCategories } = useCategories();
  const { data: apiProducts } = useProducts();
  const { data: apiProfile } = useProfile();

  const birthdays = apiBirthdays && apiBirthdays.length > 0 ? apiBirthdays : DEMO_BIRTHDAYS;
  const categories = apiCategories && apiCategories.length > 0 ? apiCategories : DEMO_CATEGORIES;
  const products = apiProducts && apiProducts.length > 0 ? apiProducts : DEMO_PRODUCTS;
  const profile = apiProfile ?? DEMO_PROFILE;

  const firstName = profile?.full_name?.split(' ')[0] ?? 'João';

  return (
    <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-14 pb-6">
        {/* Greeting */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-brand-purple-dark">
            Olá, {firstName}! 👋
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            Nunca mais esqueça alguém especial.
          </Text>
        </View>

        {/* Upcoming Birthdays */}
        <View className="mb-6 rounded-2xl bg-brand-purple-dark p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-white">Próximos aniversários</Text>
            <TouchableOpacity>
              <Text className="text-sm font-medium text-brand-pink">Ver todos</Text>
            </TouchableOpacity>
          </View>

          {birthdays.length === 0 ? (
            <Text className="text-sm text-white/60">Nenhum aniversário nos próximos 30 dias.</Text>
          ) : (
            birthdays.slice(0, 3).map((contact) => {
              const days = daysUntil(contact.birth_date);
              const age = getAge(contact.birth_date);
              return (
                <View key={contact.id} className="mb-3 flex-row items-center gap-3">
                  <AvatarCircle name={contact.full_name} photoUrl={contact.photo_url} size={40} />
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-white" numberOfLines={1}>
                      {contact.full_name}
                    </Text>
                    <Text className="text-xs text-white/60">
                      {age} anos — {formatDate(contact.birth_date)}
                    </Text>
                  </View>
                  <View className="rounded-full bg-brand-pink/20 px-3 py-1">
                    <Text className="text-xs font-medium text-brand-pink">Falta {days}d</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Categories */}
        <View className="mb-6">
          <Text className="mb-4 text-lg font-semibold text-brand-purple-dark">Categorias</Text>
          <View className="flex-row flex-wrap gap-4">
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} className="items-center gap-2">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <Text className="text-2xl">{CATEGORY_EMOJIS[cat.icon_key] ?? '🎁'}</Text>
                </View>
                <Text className="text-xs font-medium text-gray-600">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Kits Banner */}
        <View className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple-dark p-6">
          <View className="max-w-[70%]">
            <Text className="text-xl font-bold text-white">Kits em promoção 🎉</Text>
            <Text className="mt-1 text-sm text-white/70">
              Conjuntos especiais com preços imperdíveis
            </Text>
            <TouchableOpacity className="mt-4 self-start rounded-full bg-brand-pink px-6 py-2">
              <Text className="text-sm font-semibold text-white">Ver kits</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Suggestions */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-brand-purple-dark">Sugestões</Text>
            <TouchableOpacity>
              <Text className="text-sm font-medium text-brand-pink">Ver mais</Text>
            </TouchableOpacity>
          </View>

          {products.length === 0 ? (
            <Text className="text-sm text-gray-400">Nenhum produto disponível.</Text>
          ) : (
            <View className="flex-row flex-wrap gap-4">
              {products.slice(0, 4).map((product) => (
                <TouchableOpacity key={product.id} className="w-[calc(50%-8px)]">
                  <View className="mb-2 aspect-square items-center justify-center rounded-xl bg-white shadow-sm">
                    <Text className="text-4xl text-gray-300">🎁</Text>
                    {product.is_kit && (
                      <View className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-2 py-0.5">
                        <Text className="text-[10px] font-semibold text-white">Kit</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm font-medium text-brand-purple-dark" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text className="text-sm font-semibold text-brand-purple-dark">
                    {formatKz(product.price_kz)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
