import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from './auth.validators.js';

describe('registerSchema', () => {
    it('accepts valid registration input', () => {
        const result = registerSchema.safeParse({
            username: "ari3s7",
            email: "ari3s@gmail.com",
            password: "password123"
        });

        expect(result.success).toBe(true);
    });

    it('rejects username shorter than 3 characters', () => {
        const result = registerSchema.safeParse({
            username: 'ab',
            email: 'ari3s@gmail.com',
            password: 'password123',
        });
        expect(result.success).toBe(false);
    });

    it('accepts username at exactly minimum length', () => {
        const result = registerSchema.safeParse({
            username: 'abc',
            email: 'ari3s@gmail.com',
            password: 'password123',
        });
        expect(result.success).toBe(true);
    });

    it('rejects more than maximum length username', () => {
        const result = registerSchema.safeParse({
            username: 'a'.repeat(21),
            email: "ari3s@gmail.com",
            password: "password123"
        });

        expect(result.success).toBe(false);
    });

    it('rejects if not email', () => {
       const result = registerSchema.safeParse({
        username: 'ari3s',
        email: 'ari3sss',
        password: 'password123'
       });
       expect(result.success).toBe(false);
    });

    it('rejects for password less than 8 chars', () => {
        const result = registerSchema.safeParse({
            username: 'ari3s',
            email: 'ari3s@gmail.com',
            password: 'passwor'
        });

        expect(result.success).toBe(false);
    });

    it('rejects for password more than 32 chars', () => {
        const result = registerSchema.safeParse({
            username: 'ari3s',
            email: 'ari3s@gmail.com',
            password: 'a'.repeat(34),
        });
        expect(result.success).toBe(false);
    });
    it('accepts password at exactly minimum length (8)', () => {
        const result = registerSchema.safeParse({
            username: 'ari3s',
            email: 'ari3s@gmail.com',
            password: 'a'.repeat(8),
        });
        expect(result.success).toBe(true);
    });

    it('accepts password at exactly maximum length (32)', () => {
        const result = registerSchema.safeParse({
            username: 'ari3s',
            email: 'ari3s@gmail.com',
            password: 'a'.repeat(32),
        });
        expect(result.success).toBe(true);
    });

});

describe('loginSchema', () => {
    it('expects a email', () => {
        const result = loginSchema.safeParse({
            email: 'ari3s@gmail.com',
            password: 'password123'
        });
        expect(result.success).toBe(true);
    });
    it('invalid email format', () => {
        const result = loginSchema.safeParse({
            email: 'ari3sss',
            password: "password123"
        });
        expect(result.success).toBe(false);
    });
    it('rejects when password is missing', () => {
        const result = loginSchema.safeParse({
            email: 'ari3s@gmail.com',
        });
        expect(result.success).toBe(false);
    });

     it('rejects when email is missing', () => {
        const result = loginSchema.safeParse({
            password: 'password123'
        });
        expect(result.success).toBe(false);
    });
})