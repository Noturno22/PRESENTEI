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

export function daysUntil(date: Date | string): number {
  const target = toDate(date);
  const now = new Date();
  // Reset time to start of day for accurate day calculation
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = targetStart.getTime() - nowStart.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getAge(birthDate: Date | string): number {
  const birth = toDate(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function isBirthdayToday(birthDate: Date | string): boolean {
  const birth = toDate(birthDate);
  const now = new Date();
  return sameDayMonth(birth, now);
}

export function formatDate(date: Date | string): string {
  const d = toDate(date);
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`;
}

export function getNextBirthday(birthDate: Date | string): Date {
  const birth = toDate(birthDate);
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
  // Compare dates at midnight to avoid timezone offset issues
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }
  return nextBirthday;
}
