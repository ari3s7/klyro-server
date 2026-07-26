import { describe, it, expect } from 'vitest';
import { registerSchema } from './auth.validators.js';

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
});

