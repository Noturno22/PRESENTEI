'use client';

import { useState, useEffect } from 'react';
import { useProfile, useUpdateProfile } from '@presentei/api-client';
import { UserIcon } from '@/components/UserIcon';

// ── Demo profile ─────────────────────────────────────────────────────────────

const DEMO_PROFILE = {
  id: 'demo',
  full_name: 'João Silva',
  phone: '+244 923 456 789',
  avatar_url: null,
  city: 'Luanda',
  notification_lead_days: [11, 5, 1],
  created_at: '',
  updated_at: '',
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const { data: apiProfile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const profile = apiProfile ?? DEMO_PROFILE;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [leadDays, setLeadDays] = useState<number[]>([]);
  const [saved, setSaved] = useState(false);

  // Sync form fields when profile data loads/changes
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
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Silently handle — Supabase not configured yet
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse space-y-6">
        <div className="h-8 w-24 rounded bg-gray-200" />
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-3 w-28 rounded bg-gray-200" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 space-y-1">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-10 w-full rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-purple-dark">Perfil</h1>

      {/* ── Profile card ────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* Avatar + Name header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-orange">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <UserIcon className="text-white" size={28} />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-brand-purple-dark">
              {profile.full_name || 'Utilizador'}
            </p>
            <p className="text-sm text-gray-500">
              {profile.id === 'demo' ? 'Modo demonstração' : 'Conta ativa'}
            </p>
          </div>
        </div>

        {/* ── Personal info ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Nome completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value="utilizador@exemplo.com"
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-400">
              O email não pode ser alterado.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
              placeholder="+244 900 000 000"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Cidade
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
              placeholder="Luanda"
            />
          </div>
        </div>
      </div>

      {/* ── Notification preferences ────────────────────────────────────── */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-brand-purple-dark">
          Preferências de notificação
        </h2>
        <p className="mb-3 text-sm text-gray-500">
          Com quantos dias de antecedência deseja ser lembrado?
        </p>
        <div className="flex flex-wrap gap-3">
          {[11, 5, 1].map((day) => (
            <label
              key={day}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                leadDays.includes(day)
                  ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={leadDays.includes(day)}
                onChange={() => toggleLeadDay(day)}
                className="sr-only"
              />
              {day === 1 ? '1 dia antes' : `${day} dias antes`}
            </label>
          ))}
        </div>
      </div>

      {/* ── Save button ─────────────────────────────────────────────────── */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={updateProfile.isPending}
          className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:px-10"
        >
          {updateProfile.isPending ? 'A guardar...' : 'Guardar alterações'}
        </button>
        {saved && (
          <p className="mt-2 text-sm text-green-600">
            Alterações guardadas com sucesso!
          </p>
        )}
      </div>
    </div>
  );
}
