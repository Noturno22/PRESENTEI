import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { registerSchema } from '@presentei/shared/schemas';

const DEMO_ERROR = 'Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env';

export default function RegistoScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    const parsed = registerSchema.safeParse({ email, password, fullName });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos.');
      return;
    }

    setLoading(true);

    try {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        setError(DEMO_ERROR);
        return;
      }

      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { error: authError, data } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: {
            full_name: parsed.data.fullName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data?.user?.identities?.length === 0) {
        setSuccess('Já existe uma conta com este email.');
        return;
      }

      setSuccess('Conta criada com sucesso! Redirecionando…');
      setTimeout(() => {
        router.push('/(auth)/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-off-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingLeft: 24, paddingRight: 24, paddingTop: 48, paddingBottom: 48 }}>
          {/* Logo */}
          <View className="mb-10 items-center">
            <Text className="text-4xl font-bold">
              <Text className="text-brand-pink">P</Text>
              <Text className="text-brand-orange">resentei</Text>
            </Text>
            <Text className="mt-2 text-sm text-brand-purple-mid">
              Crie a sua conta e comece a surpreender.
            </Text>
          </View>

          {/* Error */}
          {error && (
            <View className="mb-4 rounded-lg bg-red-50 p-3">
              <Text className="text-center text-sm text-red-600">{error}</Text>
            </View>
          )}

          {/* Success */}
          {success && (
            <View className="mb-4 rounded-lg bg-green-50 p-3">
              <Text className="text-center text-sm text-green-700">{success}</Text>
            </View>
          )}

          {/* Form */}
          <View className="space-y-4">
            {/* Full Name */}
            <View>
              <Text className="mb-1.5 text-sm font-medium text-brand-purple-dark">
                Nome completo
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="O seu nome"
                autoCapitalize="words"
                autoComplete="name"
                className="rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-sm text-brand-purple-dark placeholder:text-gray-400"
              />
            </View>

            {/* Email */}
            <View>
              <Text className="mb-1.5 text-sm font-medium text-brand-purple-dark">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="o.seu@email.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                className="rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-sm text-brand-purple-dark placeholder:text-gray-400"
              />
            </View>

            {/* Password */}
            <View>
              <Text className="mb-1.5 text-sm font-medium text-brand-purple-dark">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 8 caracteres"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3.5 pr-12 text-sm text-brand-purple-dark placeholder:text-gray-400"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2"
                >
                  <Text className="text-sm text-gray-500">
                    {showPassword ? '🙈' : '👁'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="items-center rounded-lg bg-gradient-to-r from-brand-pink to-brand-orange px-4 py-3.5"
            >
              {loading ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-sm font-semibold text-white">A criar conta…</Text>
                </View>
              ) : (
                <Text className="text-sm font-semibold text-white">Criar conta</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="mt-8 items-center">
            <Text className="text-sm text-gray-500">
              Já tem conta?{' '}
              <Text className="font-medium text-brand-pink">Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
