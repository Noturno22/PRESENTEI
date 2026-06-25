import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '@presentei/api-client';
import { daysUntil, formatDate, getAge } from '@presentei/shared/utils';
import type { ContactRelation, Contact } from '@presentei/shared/types';

const RELATIONS: { key: ContactRelation; label: string }[] = [
  { key: 'familia', label: 'Família' },
  { key: 'amigo', label: 'Amigo' },
  { key: 'parceiro', label: 'Parceiro' },
  { key: 'colega', label: 'Colega' },
  { key: 'outro', label: 'Outro' },
];

function makeDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
}

const DEMO_CONTACTS: Contact[] = [
  { id: 'd1', owner_id: '', full_name: 'Maria Santos', relation: 'amigo', birth_date: makeDate(2), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'd2', owner_id: '', full_name: 'João Agostinho', relation: 'familia', birth_date: makeDate(5), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'd3', owner_id: '', full_name: 'Ana Paula', relation: 'parceiro', birth_date: makeDate(12), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'd4', owner_id: '', full_name: 'Carlos Mendes', relation: 'colega', birth_date: makeDate(20), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'd5', owner_id: '', full_name: 'Lucia Fernandes', relation: 'amigo', birth_date: makeDate(45), photo_url: null, notes: null, created_at: '', updated_at: '' },
];

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function AvatarCircle({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <View
      className="items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-orange"
      style={{ width: size, height: size }}
    >
      <Text className="text-xs font-bold text-white">{getInitials(name)}</Text>
    </View>
  );
}

const RELATION_LABELS: Record<string, string> = {
  familia: 'Família',
  amigo: 'Amigo',
  parceiro: 'Parceiro',
  colega: 'Colega',
  outro: 'Outro',
};

function ContactRow({
  contact,
  onPress,
  onLongPress,
}: {
  contact: Contact;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const days = daysUntil(contact.birth_date);
  const age = getAge(contact.birth_date);

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      className="mb-2 flex-row items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
    >
      <AvatarCircle name={contact.full_name} size={40} />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-brand-purple-dark" numberOfLines={1}>
          {contact.full_name}
        </Text>
        <View className="mt-0.5 flex-row items-center gap-2">
          <View className="rounded-full bg-brand-purple-dark/10 px-2 py-0.5">
            <Text className="text-[10px] font-medium text-brand-purple-dark">
              {RELATION_LABELS[contact.relation] ?? contact.relation}
            </Text>
          </View>
          <Text className="text-xs text-gray-500">
            {formatDate(contact.birth_date)} — {age} anos
          </Text>
        </View>
      </View>
      <View
        className={`rounded-full px-3 py-1 ${
          days <= 7 ? 'bg-brand-pink/15' : days <= 30 ? 'bg-brand-orange/15' : 'bg-gray-100'
        }`}
      >
        <Text
          className={`text-xs font-medium ${
            days <= 7 ? 'text-brand-pink' : days <= 30 ? 'text-brand-orange' : 'text-gray-500'
          }`}
        >
          {days === 0 ? 'Hoje!' : `Falta ${days}d`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function LoadingSkeleton() {
  return (
    <View className="px-4 pt-14 pb-6">
      <View className="mb-6 h-8 w-40 rounded-lg bg-gray-200" />
      {[1, 2, 3, 4].map((i) => (
        <View key={i} className="mb-2 flex-row items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
          <View className="h-10 w-10 rounded-full bg-gray-200" />
          <View className="flex-1 gap-2">
            <View className="h-4 w-32 rounded bg-gray-200" />
            <View className="h-3 w-24 rounded bg-gray-200" />
          </View>
          <View className="h-6 w-16 rounded-full bg-gray-200" />
        </View>
      ))}
    </View>
  );
}

type FormMode = 'create' | 'edit';

export default function ContactosTab() {
  const { data: apiContacts, isLoading } = useContacts();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const contacts = apiContacts && apiContacts.length > 0 ? apiContacts : DEMO_CONTACTS;

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [fullName, setFullName] = useState('');
  const [relation, setRelation] = useState<ContactRelation>('amigo');
  const [birthDate, setBirthDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  function openCreateForm() {
    setFormMode('create');
    setEditingContact(null);
    setFullName('');
    setRelation('amigo');
    setBirthDate('');
    setNotes('');
    setFormError(null);
    setShowForm(true);
  }

  function openEditForm(contact: Contact) {
    setFormMode('edit');
    setEditingContact(contact);
    setFullName(contact.full_name);
    setRelation(contact.relation);
    setBirthDate(contact.birth_date.split('T')[0]);
    setNotes(contact.notes ?? '');
    setFormError(null);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingContact(null);
  }

  async function handleSubmitForm() {
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('O nome é obrigatório.');
      return;
    }
    if (!birthDate.trim()) {
      setFormError('A data de nascimento é obrigatória.');
      return;
    }

    const parsedDate = new Date(birthDate);
    if (isNaN(parsedDate.getTime())) {
      setFormError('Data inválida. Use o formato AAAA-MM-DD.');
      return;
    }

    try {
      if (formMode === 'create') {
        await createContact.mutateAsync({
          fullName: fullName.trim(),
          relation,
          birthDate: parsedDate.toISOString(),
          notes: notes.trim() || undefined,
        });
      } else if (editingContact) {
        await updateContact.mutateAsync({
          id: editingContact.id,
          data: {
            fullName: fullName.trim(),
            relation,
            birthDate: parsedDate.toISOString(),
            notes: notes.trim() || undefined,
          },
        });
      }
      cancelForm();
    } catch {
      setFormError('Ocorreu um erro ao guardar. Tente novamente.');
    }
  }

  function handleDelete(contact: Contact) {
    Alert.alert(
      'Eliminar contacto',
      `Tem a certeza que deseja eliminar ${contact.full_name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContact.mutateAsync(contact.id);
            } catch {
              Alert.alert('Erro', 'Não foi possível eliminar o contacto.');
            }
          },
        },
      ],
    );
  }

  function handleLongPress(contact: Contact) {
    Alert.alert(
      contact.full_name,
      'O que deseja fazer?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Editar', onPress: () => openEditForm(contact) },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDelete(contact),
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
        <LoadingSkeleton />
      </ScrollView>
    );
  }

  if (showForm) {
    return (
      <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-14 pb-6">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-brand-purple-dark">
              {formMode === 'create' ? 'Novo Contacto' : 'Editar Contacto'}
            </Text>
            <TouchableOpacity onPress={cancelForm}>
              <Text className="text-sm font-medium text-brand-pink">Cancelar</Text>
            </TouchableOpacity>
          </View>

          {formError && (
            <View className="mb-4 rounded-lg bg-red-50 p-3">
              <Text className="text-center text-sm text-red-600">{formError}</Text>
            </View>
          )}

          <View className="rounded-2xl bg-white p-5 shadow-sm">
            <View className="mb-4">
              <Text className="mb-1.5 text-sm font-medium text-gray-600">Nome completo</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nome do contacto"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-1.5 text-sm font-medium text-gray-600">Relação</Text>
              <View className="flex-row flex-wrap gap-2">
                {RELATIONS.map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    onPress={() => setRelation(r.key)}
                    className={`rounded-full border px-4 py-2 ${
                      relation === r.key
                        ? 'border-brand-pink bg-brand-pink/10'
                        : 'border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        relation === r.key ? 'text-brand-pink' : 'text-gray-500'
                      }`}
                    >
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="mb-1.5 text-sm font-medium text-gray-600">Data de nascimento</Text>
              <TextInput
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="AAAA-MM-DD"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-1.5 text-sm font-medium text-gray-600">Notas (opcional)</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Alguma observação..."
                multiline
                numberOfLines={3}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-purple-dark"
                style={{ minHeight: 80 }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmitForm}
              disabled={createContact.isPending || updateContact.isPending}
              className="items-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange px-6 py-3"
            >
              <Text className="text-sm font-semibold text-white">
                {createContact.isPending || updateContact.isPending
                  ? 'A guardar...'
                  : formMode === 'create'
                  ? 'Adicionar Contacto'
                  : 'Guardar Alterações'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-14 pb-20">
        <Text className="mb-6 text-2xl font-bold text-brand-purple-dark">Contactos</Text>

        {contacts.length === 0 ? (
          <View className="items-center py-16">
            <Text className="mb-4 text-6xl">📇</Text>
            <Text className="text-lg font-medium text-brand-purple-dark">
              Nenhum contacto registado
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              Adicione contactos para acompanhar aniversários.
            </Text>
          </View>
        ) : (
          contacts.map((contact) => (
            <ContactRow
              key={contact.id}
              contact={contact}
              onPress={() => openEditForm(contact)}
              onLongPress={() => handleLongPress(contact)}
            />
          ))
        )}

        {/* FAB */}
        <TouchableOpacity
          onPress={openCreateForm}
          className="absolute bottom-6 right-4 h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-pink to-brand-orange shadow-lg"
        >
          <Text className="text-2xl font-bold text-white">+</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
