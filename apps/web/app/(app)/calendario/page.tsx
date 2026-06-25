'use client';

import { useMemo } from 'react';
import { useContacts } from '@presentei/api-client';
import { daysUntil, formatDate, getAge, getNextBirthday } from '@presentei/shared/utils';

function daysFromNow(n: number): string {
  const d = new Date(2025, 5, 25);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

// ── Demo data ────────────────────────────────────────────────────────────────

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const DEMO_CONTACTS = [
  { id: 'c1', owner_id: '', full_name: 'Maria Santos', relation: 'amigo' as const, birth_date: daysFromNow(2), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c2', owner_id: '', full_name: 'João Agostinho', relation: 'familia' as const, birth_date: daysFromNow(5), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c3', owner_id: '', full_name: 'Ana Paula', relation: 'parceiro' as const, birth_date: daysFromNow(12), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c4', owner_id: '', full_name: 'Carlos Mendes', relation: 'colega' as const, birth_date: daysFromNow(20), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c5', owner_id: '', full_name: 'Lucia Fernandes', relation: 'amigo' as const, birth_date: daysFromNow(45), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c6', owner_id: '', full_name: 'Pedro Miguel', relation: 'familia' as const, birth_date: daysFromNow(90), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c7', owner_id: '', full_name: 'Sofia Costa', relation: 'parceiro' as const, birth_date: daysFromNow(30), photo_url: null, notes: null, created_at: '', updated_at: '' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getMonthFromBirthDate(dateStr: string): number {
  return new Date(dateStr).getMonth();
}

function getDayFromBirthDate(dateStr: string): number {
  return new Date(dateStr).getDate();
}

// ── Page ─────────────────────────────────────────────────────────────────────

const SSR_NOW = new Date(2025, 5, 25);

export default function CalendarioPage() {
  const now = useMemo(() => SSR_NOW, []);

  const { data: apiContacts, isLoading } = useContacts();
  const contacts = apiContacts && apiContacts.length > 0 ? apiContacts : DEMO_CONTACTS;

  const groupedByMonth = useMemo(() => {
    const groups: { month: number; contacts: typeof contacts }[] = [];

    for (let m = 0; m < 12; m++) {
      const monthContacts = contacts.filter((c) => getMonthFromBirthDate(c.birth_date) === m);
      if (monthContacts.length > 0) {
        groups.push({ month: m, contacts: monthContacts });
      }
    }

    // Sort contacts within each month by day
    groups.forEach((g) => {
      g.contacts.sort((a, b) => getDayFromBirthDate(a.birth_date) - getDayFromBirthDate(b.birth_date));
    });

    return groups;
  }, [contacts]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-purple-dark">Calendário</h1>

      {isLoading ? (
        <div className="space-y-6">
          {[0, 1, 2].map((m) => (
            <div key={m} className="animate-pulse space-y-3">
              <div className="h-5 w-32 rounded bg-gray-200" />
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-36 rounded bg-gray-200" />
                    <div className="h-2 w-24 rounded bg-gray-200" />
                  </div>
                  <div className="h-6 w-16 rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : groupedByMonth.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 text-6xl">📅</div>
          <p className="text-lg font-medium text-brand-purple-dark">
            Nenhum contacto registado
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Adicione contactos para ver os aniversários aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedByMonth.map(({ month, contacts: monthContacts }) => (
            <section key={month}>
              <h2 className="mb-3 text-lg font-semibold text-brand-purple-dark">
                {MONTHS_PT[month]}
              </h2>
              <div className="space-y-2">
                {monthContacts.map((contact) => {
                  const nextBirthday = getNextBirthday(contact.birth_date, now);
                  const days = daysUntil(nextBirthday, now);
                  const age = getAge(contact.birth_date, now);
                  const willTurn = getAge(contact.birth_date, now) + (daysUntil(nextBirthday, now) <= 0 ? 0 : 1);

                  return (
                    <div
                      key={contact.id}
                      className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-orange text-xs font-bold text-white">
                        {contact.photo_url ? (
                          <img
                            src={contact.photo_url}
                            alt={contact.full_name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(contact.full_name)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-brand-purple-dark">
                          {contact.full_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(contact.birth_date)} — {willTurn} anos
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          days <= 7
                            ? 'bg-brand-pink/15 text-brand-pink'
                            : days <= 30
                              ? 'bg-brand-orange/15 text-brand-orange'
                              : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {days === 0 ? 'Hoje!' : `Falta ${days}d`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
