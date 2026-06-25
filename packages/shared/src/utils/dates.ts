const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
] as const;

function toDate(date: Date | string): Date {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
}

function sameDayMonth(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth();
}

export function daysUntil(date: Date | string, now: Date = new Date()): number {
  const target = toDate(date);
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = targetStart.getTime() - nowStart.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getAge(birthDate: Date | string, now: Date = new Date()): number {
  const birth = toDate(birthDate);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function isBirthdayToday(birthDate: Date | string, now: Date = new Date()): boolean {
  const birth = toDate(birthDate);
  return sameDayMonth(birth, now);
}

export function formatDate(date: Date | string): string {
  const d = toDate(date);
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`;
}

export function getNextBirthday(birthDate: Date | string, now: Date = new Date()): Date {
  const birth = toDate(birthDate);
  const currentYear = now.getFullYear();
  const nextBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }
  return nextBirthday;
}
