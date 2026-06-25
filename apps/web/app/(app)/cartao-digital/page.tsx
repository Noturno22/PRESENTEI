'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCreateDigitalCard } from '@presentei/api-client';

const TEMPLATES = [
  { key: 'default', label: 'Padrão' },
];

export default function CartaoDigitalPage() {
  const createCard = useCreateDigitalCard();

  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [templateKey, setTemplateKey] = useState('default');
  const [error, setError] = useState<string | null>(null);
  const [createdCard, setCreatedCard] = useState<{ id: string } | null>(null);

  async function handleSubmit() {
    setError(null);

    if (!message.trim()) {
      setError('A mensagem é obrigatória.');
      return;
    }

    try {
      const card = await createCard.mutateAsync({
        templateKey,
        message: message.trim(),
        recipientName: recipientName.trim() || undefined,
      });
      setCreatedCard(card);
    } catch {
      setError('Ocorreu um erro ao criar o cartão digital.');
    }
  }

  function handleReset() {
    setRecipientName('');
    setMessage('');
    setTemplateKey('default');
    setError(null);
    setCreatedCard(null);
  }

  if (createdCard) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
          <div className="mb-4 text-5xl">🎉</div>
          <h1 className="mb-2 text-2xl font-bold text-brand-purple-dark">
            Cartão criado com sucesso!
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            O seu cartão digital está pronto.
          </p>

          {/* ── Card preview ────────────────────────────────────────────── */}
          <div className="mx-auto mb-6 max-w-sm rounded-2xl bg-gradient-to-br from-brand-pink to-brand-orange p-6 text-white shadow-lg">
            {recipientName && (
              <p className="mb-3 text-lg font-semibold">
                Para {recipientName}
              </p>
            )}
            <p className="text-sm leading-relaxed opacity-90">{message}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleReset}
              className="rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Criar outro cartão
            </button>
            <Link
              href="/pedidos"
              className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-medium text-brand-purple-dark transition-colors hover:bg-gray-50"
            >
              Ver pedidos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-purple-dark">
        Cartão Digital
      </h1>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {/* Recipient name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Nome do destinatário
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
              placeholder="Nome da pessoa"
            />
            <p className="mt-1 text-xs text-gray-400">Opcional</p>
          </div>

          {/* Template */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Template
            </label>
            <select
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
            >
              {TEMPLATES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Mensagem
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark outline-none transition-colors focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
              placeholder="Escreva a sua mensagem..."
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={createCard.isPending}
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createCard.isPending ? 'A criar...' : 'Criar cartão digital'}
          </button>
        </div>
      </div>
    </div>
  );
}
