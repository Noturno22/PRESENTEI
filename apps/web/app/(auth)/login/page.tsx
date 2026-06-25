'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema } from '@presentei/shared/schemas';
import { useSupabaseSafe, isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const supabase = useSupabaseSafe();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isConfigured = isSupabaseConfigured();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate with Zod
    const parsed = loginSchema.safeParse({ email, password });
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
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push('/inicio');
      router.refresh();
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
            Lembra, Escolhe e Surpreende.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
                required
                autoComplete="current-password"
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
                A entrar…
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Ainda não tem conta?{' '}
          <Link href="/registo" className="font-medium text-brand-pink hover:underline">
            Registar
          </Link>
        </p>
      </div>
    </div>
  );
}
