import { describe, it, expect } from 'vitest';
import * as contacts from '../queries/contacts';
import * as products from '../queries/products';
import * as orders from '../queries/orders';
import * as calendar from '../queries/calendar';
import * as profiles from '../queries/profiles';
import * as categories from '../queries/categories';
import * as digitalCards from '../queries/digitalCards';

describe('contacts queries', () => {
  const supabase = {} as any;

  it('exports all expected functions', () => {
    expect(typeof contacts.getContacts).toBe('function');
    expect(typeof contacts.getContactById).toBe('function');
    expect(typeof contacts.createContact).toBe('function');
    expect(typeof contacts.updateContact).toBe('function');
    expect(typeof contacts.deleteContact).toBe('function');
  });

  it('getContacts accepts a supabase client', () => {
    expect(contacts.getContacts.length).toBe(1);
  });

  it('getContactById accepts supabase + id', () => {
    expect(contacts.getContactById.length).toBe(2);
  });

  it('createContact accepts supabase + data', () => {
    expect(contacts.createContact.length).toBe(2);
  });

  it('updateContact accepts supabase + id + data', () => {
    expect(contacts.updateContact.length).toBe(3);
  });

  it('deleteContact accepts supabase + id', () => {
    expect(contacts.deleteContact.length).toBe(2);
  });
});

describe('products queries', () => {
  const supabase = {} as any;

  it('exports all expected functions', () => {
    expect(typeof products.getProducts).toBe('function');
    expect(typeof products.getProductsByCategory).toBe('function');
    expect(typeof products.getKits).toBe('function');
    expect(typeof products.getProductById).toBe('function');
  });

  it('getProducts accepts supabase', () => {
    expect(products.getProducts.length).toBe(1);
  });

  it('getProductsByCategory accepts supabase + categoryId', () => {
    expect(products.getProductsByCategory.length).toBe(2);
  });

  it('getKits accepts supabase', () => {
    expect(products.getKits.length).toBe(1);
  });

  it('getProductById accepts supabase + id', () => {
    expect(products.getProductById.length).toBe(2);
  });
});

describe('orders queries', () => {
  it('exports all expected functions', () => {
    expect(typeof orders.getOrders).toBe('function');
    expect(typeof orders.getOrderById).toBe('function');
    expect(typeof orders.createOrder).toBe('function');
  });

  it('getOrders accepts supabase', () => {
    expect(orders.getOrders.length).toBe(1);
  });

  it('getOrderById accepts supabase + id', () => {
    expect(orders.getOrderById.length).toBe(2);
  });

  it('createOrder accepts supabase + data', () => {
    expect(orders.createOrder.length).toBe(2);
  });
});

describe('calendar queries', () => {
  it('exports all expected functions', () => {
    expect(typeof calendar.getUpcomingBirthdays).toBe('function');
    expect(typeof calendar.getContactsByMonth).toBe('function');
  });

  it('getUpcomingBirthdays accepts supabase + daysAhead', () => {
    expect(calendar.getUpcomingBirthdays.length).toBe(2);
  });

  it('getContactsByMonth accepts supabase + month', () => {
    expect(calendar.getContactsByMonth.length).toBe(2);
  });
});

describe('profiles queries', () => {
  it('exports all expected functions', () => {
    expect(typeof profiles.getProfile).toBe('function');
    expect(typeof profiles.updateProfile).toBe('function');
  });

  it('getProfile accepts supabase', () => {
    expect(profiles.getProfile.length).toBe(1);
  });

  it('updateProfile accepts supabase + data', () => {
    expect(profiles.updateProfile.length).toBe(2);
  });
});

describe('categories queries', () => {
  it('exports getCategories function', () => {
    expect(typeof categories.getCategories).toBe('function');
  });

  it('getCategories accepts supabase', () => {
    expect(categories.getCategories.length).toBe(1);
  });
});

describe('digitalCards queries', () => {
  it('exports all expected functions', () => {
    expect(typeof digitalCards.getDigitalCards).toBe('function');
    expect(typeof digitalCards.createDigitalCard).toBe('function');
  });

  it('getDigitalCards accepts supabase', () => {
    expect(digitalCards.getDigitalCards.length).toBe(1);
  });

  it('createDigitalCard accepts supabase + data', () => {
    expect(digitalCards.createDigitalCard.length).toBe(2);
  });
});
