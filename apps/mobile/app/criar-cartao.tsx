import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useCreateDigitalCard } from '@presentei/api-client';

const TEMPLATES = [
  { key: 'default', label: 'Clássico' },
  { key: 'romantico', label: 'Romântico' },
  { key: 'divertido', label: 'Divertido' },
  { key: 'elegante', label: 'Elegante' },
];

export default function CriarCartaoScreen() {
  const createDigitalCard = useCreateDigitalCard();

  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [templateKey, setTemplateKey] = useState('default');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    id: string;
    recipientName: string | null;
    message: string;
    templateKey: string;
  } | null>(null);

  async function handleSubmit() {
    setError(null);

    if (!message.trim()) {
      setError('A mensagem é obrigatória.');
      return;
    }

    try {
      const result = await createDigitalCard.mutateAsync({
        templateKey,
        message: message.trim(),
        recipientName: recipientName.trim() || undefined,
      });
      setPreview({
        id: result.id,
        recipientName: result.recipient_name,
        message: result.message,
        templateKey: result.template_key,
      });
    } catch {
      setError('Ocorreu um erro ao criar o cartão. Tente novamente.');
    }
  }

  if (preview) {
    return (
      <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-14 pb-6">
          <Text className="mb-6 text-2xl font-bold text-brand-purple-dark">
            Cartão Criado 🎉
          </Text>

          <View className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple-dark p-6 shadow-sm">
            <View className="mb-4 items-center">
              <Text className="text-4xl">
                {preview.templateKey === 'romantico'
                  ? '❤️'
                  : preview.templateKey === 'divertido'
                  ? '🎉'
                  : preview.templateKey === 'elegante'
                  ? '✨'
                  : '💌'}
              </Text>
            </View>
            {preview.recipientName && (
              <Text className="mb-2 text-lg font-bold text-white">
                Para {preview.recipientName}
              </Text>
            )}
            <Text className="text-sm leading-6 text-white/90">{preview.message}</Text>
            <View className="mt-4 items-end">
              <Text className="text-xs text-white/50">Presentei</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-3"
          >
            <Text className="text-sm font-semibold text-white">Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-14 pb-6">
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} className="mb-6 self-start">
          <Text className="text-sm font-medium text-brand-pink">← Voltar</Text>
        </TouchableOpacity>

        <Text className="mb-6 text-2xl font-bold text-brand-purple-dark">
          Criar Cartão Digital
        </Text>

        {error && (
          <View className="mb-4 rounded-lg bg-red-50 p-3">
            <Text className="text-center text-sm text-red-600">{error}</Text>
          </View>
        )}

        <View className="rounded-2xl bg-white p-5 shadow-sm">
          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-medium text-gray-600">
              Nome do destinatário (opcional)
            </Text>
            <TextInput
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Quem vai receber?"
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-medium text-gray-600">
              Mensagem
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Escreva a sua mensagem..."
              multiline
              numberOfLines={4}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
              style={{ minHeight: 100 }}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-medium text-gray-600">Modelo</Text>
            <View className="flex-row flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setTemplateKey(t.key)}
                  className={`rounded-full border px-4 py-2 ${
                    templateKey === t.key
                      ? 'border-brand-pink bg-brand-pink/10'
                      : 'border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      templateKey === t.key ? 'text-brand-pink' : 'text-gray-500'
                    }`}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={createDigitalCard.isPending}
            className="items-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-3"
          >
            <Text className="text-sm font-semibold text-white">
              {createDigitalCard.isPending ? 'A criar...' : 'Criar Cartão'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
