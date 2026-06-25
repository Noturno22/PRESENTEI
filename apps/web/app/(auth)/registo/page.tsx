'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerSchema } from '@presentei/shared/schemas';
import { useSupabaseSafe, isSupabaseConfigured } from '@/lib/supabase';

export default function RegistoPage() {
  const router = useRouter();
  const supabase = useSupabaseSafe();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isConfigured = isSupabaseConfigured();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate with Zod
    const parsed = registerSchema.safeParse({ email, password, fullName });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      setError(firstError?.message ?? 'Dados inválidos.');
      return;
    }

    if (!supabase) {
      setError('Supabase não está configurado. Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY ao .env.local');
      return;
    }

    setLoading(true);

    try {
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

      // If email confirmation is required, show success message
      if (data?.user?.identities?.length === 0) {
        setSuccess('Já existe uma conta com este email.');
        return;
      }

      setSuccess('Conta criada com sucesso! Redirecionando para o login…');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text text-4xl font-bold text-transparent">
            Presentei
          </h1>
          <p className="mt-2 text-sm text-brand-purple-mid">
            Crie a sua conta e comece a surpreender.
          </p>
        </div>

        {/* Dev mode notice */}
        {!isConfigured && (
          <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-center text-sm text-yellow-800">
            ⚠ Modo de desenvolvimento: Supabase não configurado.
            <br />
            Adiciona{' '}
            <code className="rounded bg-yellow-100 px-1 font-mono text-xs">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{' '}
            e{' '}
            <code className="rounded bg-yellow-100 px-1 font-mono text-xs">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{' '}
            ao .env.local.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-brand-purple-dark">
              Nome completo
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="O seu nome"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-brand-purple-dark placeholder-gray-400 outline-none transition-colors focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-brand-purple-dark">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="o.seu@email.com"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-brand-purple-dark placeholder-gray-400 outline-none transition-colors focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-brand-purple-dark">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-brand-purple-dark placeholder-gray-400 outline-none transition-colors focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-brand-purple-mid"
                tabIndex={-1}
                aria-label={showPassword ? 'Esconder password' : 'Mostrar password'}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-brand-pink to-brand-orange px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                A criar conta…
              </span>
            ) : (
              'Criar conta'
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Já tem conta?{' '}
          <Link href="/login" className="font-medium text-brand-pink hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
