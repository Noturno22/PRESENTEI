import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatKz } from '../utils/formatKz';
import { daysUntil, getAge, isBirthdayToday, formatDate, getNextBirthday } from '../utils/dates';

describe('formatKz', () => {
  it('formats 25000 as "25.000 Kz"', () => {
    expect(formatKz(25000)).toBe('25.000 Kz');
  });

  it('formats 18000 as "18.000 Kz"', () => {
    expect(formatKz(18000)).toBe('18.000 Kz');
  });

  it('formats 0 as "0 Kz"', () => {
    expect(formatKz(0)).toBe('0 Kz');
  });

  it('formats 1500 as "1.500 Kz"', () => {
    expect(formatKz(1500)).toBe('1.500 Kz');
  });

  it('formats 100 as "100 Kz"', () => {
    expect(formatKz(100)).toBe('100 Kz');
  });
});

describe('daysUntil', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns positive number for future date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01'));
    const future = new Date('2026-06-10');
    expect(daysUntil(future)).toBe(9);
  });

  it('returns negative number for past date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-10'));
    const past = new Date('2026-06-01');
    expect(daysUntil(past)).toBe(-9);
  });

  it('returns 0 for today', () => {
    vi.useFakeTimers();
    const today = new Date('2026-06-15');
    vi.setSystemTime(today);
    expect(daysUntil(today)).toBe(0);
  });

  it('accepts string date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01'));
    expect(daysUntil('2026-06-10')).toBe(9);
  });
});

describe('getAge', () => {
  it('calculates age correctly for a past birthday this year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15'));
    // Born 1990-05-15, turned 36 on May 15, 2026
    expect(getAge('1990-05-15')).toBe(36);
  });

  it('calculates age correctly before birthday this year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01'));
    // Born 1990-05-15, still 35 until May 15
    expect(getAge('1990-05-15')).toBe(35);
  });

  it('calculates age correctly for a child', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15'));
    // Born 2024-01-10, turned 2 on Jan 10, 2026
    expect(getAge('2024-01-10')).toBe(2);
  });

  it('handles Date objects', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15'));
    expect(getAge(new Date('1990-05-15'))).toBe(36);
  });
});

describe('isBirthdayToday', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true when today matches birth month and day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15'));
    expect(isBirthdayToday('1990-05-15')).toBe(true);
  });

  it('returns false when today does not match', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15'));
    expect(isBirthdayToday('1990-05-15')).toBe(false);
  });

  it('returns true for today as a Date object', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15'));
    expect(isBirthdayToday(new Date('1990-05-15'))).toBe(true);
  });
});

describe('formatDate', () => {
  it('formats date in Angolan style', () => {
    expect(formatDate('2026-05-15')).toBe('15 de Maio');
  });

  it('formats another date correctly', () => {
    expect(formatDate('2026-12-25')).toBe('25 de Dezembro');
  });

  it('formats date from Date object', () => {
    expect(formatDate(new Date('2026-01-01'))).toBe('1 de Janeiro');
  });
});

describe('getNextBirthday', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns this year if birthday has not passed yet', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01'));
    // Born May 15 - already passed in 2026, so next is 2027
    const next = getNextBirthday('1990-05-15');
    expect(next.getFullYear()).toBe(2027);
    expect(next.getMonth()).toBe(4); // May is 0-indexed as 4
    expect(next.getDate()).toBe(15);
  });

  it('returns this year if birthday is today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15'));
    const next = getNextBirthday('1990-05-15');
    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(4);
    expect(next.getDate()).toBe(15);
  });

  it('returns this year if birthday is in the future', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01'));
    // Born December 25 - still coming up in 2026
    const next = getNextBirthday('1990-12-25');
    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(11);
    expect(next.getDate()).toBe(25);
  });

  it('handles Date objects', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01'));
    const next = getNextBirthday(new Date('1990-05-15'));
    expect(next.getFullYear()).toBe(2027);
  });
});
