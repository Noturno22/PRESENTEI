import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  contactSchema,
  createOrderSchema,
  digitalCardSchema,
} from '../schemas/index';

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.parse({
      email: 'user@example.com',
      password: 'secret123',
      fullName: 'João Silva',
    });
    expect(result.email).toBe('user@example.com');
    expect(result.password).toBe('secret123');
    expect(result.fullName).toBe('João Silva');
  });

  it('rejects invalid email', () => {
    expect(() =>
      registerSchema.parse({
        email: 'not-an-email',
        password: 'secret123',
        fullName: 'João Silva',
      }),
    ).toThrow();
  });

  it('rejects short password', () => {
    expect(() =>
      registerSchema.parse({
        email: 'user@example.com',
        password: '123',
        fullName: 'João Silva',
      }),
    ).toThrow();
  });

  it('rejects empty fullName', () => {
    expect(() =>
      registerSchema.parse({
        email: 'user@example.com',
        password: 'secret123',
        fullName: '',
      }),
    ).toThrow();
  });

  it('rejects fullName with single character', () => {
    expect(() =>
      registerSchema.parse({
        email: 'user@example.com',
        password: 'secret123',
        fullName: 'A',
      }),
    ).toThrow();
  });
});

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.parse({
      email: 'user@example.com',
      password: 'anything',
    });
    expect(result.email).toBe('user@example.com');
    expect(result.password).toBe('anything');
  });

  it('rejects invalid email', () => {
    expect(() =>
      loginSchema.parse({
        email: 'bad',
        password: 'anything',
      }),
    ).toThrow();
  });

  it('rejects empty password', () => {
    expect(() =>
      loginSchema.parse({
        email: 'user@example.com',
        password: '',
      }),
    ).toThrow();
  });
});

describe('contactSchema', () => {
  const validContact = {
    fullName: 'Maria',
    relation: 'amigo' as const,
    birthDate: '1990-05-15',
  };

  it('accepts valid contact with only required fields', () => {
    const result = contactSchema.parse(validContact);
    expect(result.fullName).toBe('Maria');
    expect(result.relation).toBe('amigo');
    expect(result.birthDate).toBe('1990-05-15');
    expect(result.photoUrl).toBeUndefined();
    expect(result.notes).toBeUndefined();
  });

  it('accepts contact with optional fields', () => {
    const result = contactSchema.parse({
      ...validContact,
      photoUrl: 'https://example.com/photo.jpg',
      notes: 'My best friend',
    });
    expect(result.photoUrl).toBe('https://example.com/photo.jpg');
    expect(result.notes).toBe('My best friend');
  });

  it('rejects empty fullName', () => {
    expect(() =>
      contactSchema.parse({ ...validContact, fullName: '' }),
    ).toThrow();
  });

  it('rejects short fullName', () => {
    expect(() =>
      contactSchema.parse({ ...validContact, fullName: 'X' }),
    ).toThrow();
  });

  it('rejects invalid relation', () => {
    expect(() =>
      contactSchema.parse({ ...validContact, relation: 'estranho' }),
    ).toThrow();
  });

  it('accepts all valid relations', () => {
    const relations = ['familia', 'amigo', 'parceiro', 'colega', 'outro'] as const;
    for (const relation of relations) {
      expect(() =>
        contactSchema.parse({ ...validContact, relation }),
      ).not.toThrow();
    }
  });

  it('rejects invalid birthDate', () => {
    expect(() =>
      contactSchema.parse({ ...validContact, birthDate: 'not-a-date' }),
    ).toThrow();
  });
});

describe('createOrderSchema', () => {
  const validOrder = {
    contactId: '550e8400-e29b-41d4-a716-446655440000',
    items: [{ productId: 'abc-123', quantity: 2 }],
  };

  it('accepts valid order with only required fields', () => {
    const result = createOrderSchema.parse(validOrder);
    expect(result.contactId).toBe(validOrder.contactId);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].productId).toBe('abc-123');
    expect(result.items[0].quantity).toBe(2);
  });

  it('accepts order with all optional fields', () => {
    const result = createOrderSchema.parse({
      ...validOrder,
      digitalCardId: '550e8400-e29b-41d4-a716-446655440001',
      scheduledDeliveryDate: '2026-12-25',
      deliveryAddress: 'Rua Principal, 123',
    });
    expect(result.digitalCardId).toBe('550e8400-e29b-41d4-a716-446655440001');
    expect(result.scheduledDeliveryDate).toBe('2026-12-25');
    expect(result.deliveryAddress).toBe('Rua Principal, 123');
  });

  it('rejects invalid contactId (not uuid)', () => {
    expect(() =>
      createOrderSchema.parse({
        ...validOrder,
        contactId: 'not-a-uuid',
      }),
    ).toThrow();
  });

  it('rejects empty items array', () => {
    expect(() =>
      createOrderSchema.parse({
        ...validOrder,
        items: [],
      }),
    ).toThrow();
  });

  it('rejects item with quantity 0', () => {
    expect(() =>
      createOrderSchema.parse({
        ...validOrder,
        items: [{ productId: 'abc', quantity: 0 }],
      }),
    ).toThrow();
  });

  it('rejects item with negative quantity', () => {
    expect(() =>
      createOrderSchema.parse({
        ...validOrder,
        items: [{ productId: 'abc', quantity: -1 }],
      }),
    ).toThrow();
  });

  it('rejects invalid digitalCardId (not uuid)', () => {
    expect(() =>
      createOrderSchema.parse({
        ...validOrder,
        digitalCardId: 'not-a-uuid',
      }),
    ).toThrow();
  });
});

describe('digitalCardSchema', () => {
  it('accepts valid digital card', () => {
    const result = digitalCardSchema.parse({
      templateKey: 'birthday-classic',
      message: 'Feliz Aniversário!',
      recipientName: 'Amigo',
    });
    expect(result.templateKey).toBe('birthday-classic');
    expect(result.message).toBe('Feliz Aniversário!');
    expect(result.recipientName).toBe('Amigo');
  });

  it('accepts digital card without recipientName', () => {
    const result = digitalCardSchema.parse({
      templateKey: 'birthday-classic',
      message: 'Feliz Aniversário!',
    });
    expect(result.recipientName).toBeUndefined();
  });

  it('rejects empty message', () => {
    expect(() =>
      digitalCardSchema.parse({
        templateKey: 'birthday-classic',
        message: '',
      }),
    ).toThrow();
  });
});
