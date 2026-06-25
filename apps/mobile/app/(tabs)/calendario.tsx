import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useMemo } from 'react';
import { useContacts } from '@presentei/api-client';
import { daysUntil, formatDate, getAge, getNextBirthday } from '@presentei/shared/utils';

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function makeDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
}

const DEMO_CONTACTS = [
  { id: 'c1', owner_id: '', full_name: 'Maria Santos', relation: 'amigo' as const, birth_date: makeDate(2), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c2', owner_id: '', full_name: 'João Agostinho', relation: 'familia' as const, birth_date: makeDate(5), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c3', owner_id: '', full_name: 'Ana Paula', relation: 'parceiro' as const, birth_date: makeDate(12), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c4', owner_id: '', full_name: 'Carlos Mendes', relation: 'colega' as const, birth_date: makeDate(20), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c5', owner_id: '', full_name: 'Lucia Fernandes', relation: 'amigo' as const, birth_date: makeDate(45), photo_url: null, notes: null, created_at: '', updated_at: '' },
  { id: 'c6', owner_id: '', full_name: 'Pedro Miguel', relation: 'familia' as const, birth_date: makeDate(90), photo_url: null, notes: null, created_at: '', updated_at: '' },
];

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getMonthFromBirthDate(dateStr: string): number {
  return new Date(dateStr).getMonth();
}

function getDayFromBirthDate(dateStr: string): number {
  return new Date(dateStr).getDate();
}

export default function CalendarioTab() {
  const { data: apiContacts } = useContacts();
  const contacts = apiContacts && apiContacts.length > 0 ? apiContacts : DEMO_CONTACTS;

  const groupedByMonth = useMemo(() => {
    const groups: { month: number; contacts: typeof contacts }[] = [];
    for (let m = 0; m < 12; m++) {
      const monthContacts = contacts.filter((c) => getMonthFromBirthDate(c.birth_date) === m);
      if (monthContacts.length > 0) {
        monthContacts.sort((a, b) => getDayFromBirthDate(a.birth_date) - getDayFromBirthDate(b.birth_date));
        groups.push({ month: m, contacts: monthContacts });
      }
    }
    return groups;
  }, [contacts]);

  return (
    <ScrollView className="flex-1 bg-brand-off-white" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-14 pb-6">
        <Text className="mb-6 text-2xl font-bold text-brand-purple-dark">Calendário</Text>

        {groupedByMonth.length === 0 ? (
          <View className="items-center py-16">
            <Text className="mb-4 text-6xl">📅</Text>
            <Text className="text-lg font-medium text-brand-purple-dark">
              Nenhum contacto registado
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              Adicione contactos para ver os aniversários aqui.
            </Text>
          </View>
        ) : (
          groupedByMonth.map(({ month, contacts: monthContacts }) => (
            <View key={month} className="mb-8">
              <Text className="mb-3 text-lg font-semibold text-brand-purple-dark">
                {MONTHS_PT[month]}
              </Text>
              {monthContacts.map((contact) => {
                const nextBirthday = getNextBirthday(contact.birth_date);
                const days = daysUntil(nextBirthday);
                const willTurn = getAge(contact.birth_date) + (daysUntil(nextBirthday) <= 0 ? 0 : 1);

                return (
                  <TouchableOpacity
                    key={contact.id}
                    className="mb-2 flex-row items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-orange">
                      {contact.photo_url ? null : (
                        <Text className="text-xs font-bold text-white">
                          {getInitials(contact.full_name)}
                        </Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-brand-purple-dark" numberOfLines={1}>
                        {contact.full_name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {formatDate(contact.birth_date)} — {willTurn} anos
                      </Text>
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
              })}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
