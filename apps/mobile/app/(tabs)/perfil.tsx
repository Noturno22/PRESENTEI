import { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useProfile, useUpdateProfile } from '@presentei/api-client';

const DEMO_PROFILE = {
  id: 'demo', full_name: 'João Silva', phone: '+244 923 456 789',
  avatar_url: null, city: 'Luanda', notification_lead_days: [11, 5, 1],
  created_at: '', updated_at: '',
};

export default function PerfilTab() {
  const { data: apiProfile } = useProfile();
  const updateProfile = useUpdateProfile();
  const profile = apiProfile ?? DEMO_PROFILE;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [leadDays, setLeadDays] = useState<number[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setPhone(profile.phone ?? '');
      setCity(profile.city ?? '');
      setLeadDays(profile.notification_lead_days ?? [11, 5, 1]);
    }
  }, [profile]);

  function toggleLeadDay(day: number) {
    setLeadDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => b - a),
    );
  }

  async function handleSave() {
    setSaved(false);
    try {
      await updateProfile.mutateAsync({
        full_name: fullName,
        phone: phone || null,
        city: city || null,
        notification_lead_days: leadDays,
      });
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-14 pb-6">
        <Text className="mb-6 text-2xl font-bold text-brand-purple-dark">Perfil</Text>

        {/* Profile card */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          {/* Avatar + Name */}
          <View className="mb-6 flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-orange">
              <Text className="text-xl font-bold text-white">
                {profile.full_name?.charAt(0)?.toUpperCase() ?? '👤'}
              </Text>
            </View>
            <View>
              <Text className="text-lg font-semibold text-brand-purple-dark">
                {profile.full_name || 'Utilizador'}
              </Text>
              <Text className="text-sm text-gray-500">
                {profile.id === 'demo' ? 'Modo demonstração' : 'Conta ativa'}
              </Text>
            </View>
          </View>

          {/* Personal info */}
          <View className="space-y-4">
            <View>
              <Text className="mb-1 text-sm font-medium text-gray-600">Nome completo</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Seu nome"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
              />
            </View>

            <View>
              <Text className="mb-1 text-sm font-medium text-gray-600">Email</Text>
              <View className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
                <Text className="text-sm text-gray-400">utilizador@exemplo.com</Text>
              </View>
              <Text className="mt-1 text-xs text-gray-400">O email não pode ser alterado.</Text>
            </View>

            <View>
              <Text className="mb-1 text-sm font-medium text-gray-600">Telefone</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+244 900 000 000"
                keyboardType="phone-pad"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
              />
            </View>

            <View>
              <Text className="mb-1 text-sm font-medium text-gray-600">Cidade</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Luanda"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
              />
            </View>
          </View>
        </View>

        {/* Notification preferences */}
        <View className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-brand-purple-dark">
            Preferências de notificação
          </Text>
          <Text className="mb-3 text-sm text-gray-500">
            Com quantos dias de antecedência deseja ser lembrado?
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {[11, 5, 1].map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => toggleLeadDay(day)}
                className={`rounded-full border px-4 py-2 ${
                  leadDays.includes(day)
                    ? 'border-brand-pink bg-brand-pink/10'
                    : 'border-gray-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    leadDays.includes(day) ? 'text-brand-pink' : 'text-gray-500'
                  }`}
                >
                  {day === 1 ? '1 dia antes' : `${day} dias antes`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={updateProfile.isPending}
          className="items-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-3"
        >
          <Text className="text-sm font-semibold text-white">
            {updateProfile.isPending ? 'A guardar...' : 'Guardar alterações'}
          </Text>
        </TouchableOpacity>
        {saved && (
          <Text className="mt-2 text-center text-sm text-green-600">
            Alterações guardadas com sucesso!
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
