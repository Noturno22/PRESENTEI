'use client';

import { useState, useMemo } from 'react';
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '@presentei/api-client';
import { contactSchema } from '@presentei/shared/schemas';
import { formatDate } from '@presentei/shared/utils';
import { UserIcon } from '@/components/UserIcon';

const RELATIONS = [
  { value: 'familia', label: 'Família' },
  { value: 'amigo', label: 'Amigo' },
  { value: 'parceiro', label: 'Parceiro' },
  { value: 'colega', label: 'Colega' },
  { value: 'outro', label: 'Outro' },
] as const;

function daysFromNow(n: number): string {
  const d = new Date(2025, 5, 25);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

const DEMO_CONTACTS = [
  { id: 'c1', owner_id: '', full_name: 'Maria Santos', relation: 'amigo' as const, birth_date: daysFromNow(2), photo_url: null, notes: 'Melhor amiga', created_at: '', updated_at: '' },
  { id: 'c2', owner_id: '', full_name: 'João Agostinho', relation: 'familia' as const, birth_date: daysFromNow(5), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c3', owner_id: '', full_name: 'Ana Paula', relation: 'parceiro' as const, birth_date: daysFromNow(12), photo_url: null, notes: 'Aniversário de namoro', created_at: '', updated_at: '' },
  { id: 'c4', owner_id: '', full_name: 'Carlos Mendes', relation: 'colega' as const, birth_date: daysFromNow(20), photo_url: null, notes: null, created_at: '', updated_at: '' },
];

const RELATION_LABELS: Record<string, string> = {
  familia: 'Família',
  amigo: 'Amigo',
  parceiro: 'Parceiro',
  colega: 'Colega',
  outro: 'Outro',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface FormData {
  full_name: string;
  relation: string;
  birth_date: string;
  notes: string;
}

const EMPTY_FORM: FormData = { full_name: '', relation: 'amigo', birth_date: '', notes: '' };

export default function ContactosPage() {
  const { data: apiContacts, isLoading } = useContacts();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const contacts = apiContacts && apiContacts.length > 0 ? apiContacts : DEMO_CONTACTS;

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const isEditing = editingId !== null;

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(contact: typeof contacts[number]) {
    setEditingId(contact.id);
    setForm({
      full_name: contact.full_name,
      relation: contact.relation,
      birth_date: contact.birth_date.split('T')[0],
      notes: contact.notes ?? '',
    });
    setError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setError(null);

    const parsed = contactSchema.safeParse({
      fullName: form.full_name,
      relation: form.relation,
      birthDate: form.birth_date ? new Date(form.birth_date).toISOString() : '',
      notes: form.notes || undefined,
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setError(firstIssue.message);
      return;
    }

    try {
      if (isEditing && editingId) {
        await updateContact.mutateAsync({ id: editingId, data: parsed.data });
      } else {
        await createContact.mutateAsync(parsed.data);
      }
      closeModal();
    } catch {
      setError('Ocorreu um erro ao guardar o contacto.');
    }
  }

  async function handleDelete(id: string) {
    if (deleting === id) return;
    setDeleting(id);
    try {
      await deleteContact.mutateAsync(id);
    } catch {
      setError('Ocorreu um erro ao eliminar o contacto.');
    } finally {
      setDeleting(null);
    }
  }

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const dateA = new Date(a.birth_date).getTime();
      const dateB = new Date(b.birth_date).getTime();
      return dateA - dateB;
    });
  }, [contacts]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-purple-dark">Contactos</h1>
        <button
          onClick={openCreate}
          className="rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Adicionar contacto
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Loading skeleton ────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-3 w-24 rounded bg-gray-200" />
              </div>
              <div className="h-8 w-16 rounded bg-gray-200" />
              <div className="h-8 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : sortedContacts.length === 0 ? (
        /* ── Empty state ──────────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <UserIcon className="mb-4 text-gray-300" size={64} />
          <p className="text-lg font-medium text-brand-purple-dark">
            Nenhum contacto registado
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Adicione contactos para acompanhar aniversários e presentes.
          </p>
        </div>
      ) : (
        /* ── Contact list ──────────────────────────────────────────────── */
        <div className="space-y-3">
          {sortedContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-orange text-sm font-bold text-white">
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
                  {RELATION_LABELS[contact.relation] ?? contact.relation}
                  {contact.birth_date && ` — ${formatDate(contact.birth_date)}`}
                </p>
                {contact.notes && (
                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {contact.notes}
                  </p>
                )}
              </div>
              <button
                onClick={() => openEdit(contact)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-brand-purple-dark transition-colors hover:bg-gray-100"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(contact.id)}
                disabled={deleting === contact.id}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {deleting === contact.id ? '...' : 'Eliminar'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-brand-purple-dark">
              {isEditing ? 'Editar contacto' : 'Adicionar contacto'}
            </h2>

            <div className="space-y-4">
              {/* Full name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                  placeholder="Nome do contacto"
                />
              </div>

              {/* Relation */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Relação
                </label>
                <select
                  value={form.relation}
                  onChange={(e) => handleChange('relation', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                >
                  {RELATIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Birth date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  value={form.birth_date}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Notas
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                  placeholder="Notas opcionais..."
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="rounded-full px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={createContact.isPending || updateContact.isPending}
                  className="rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createContact.isPending || updateContact.isPending
                    ? 'A guardar...'
                    : isEditing
                      ? 'Guardar alterações'
                      : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
