import { z } from 'zod';

export const userLoginResponseSchema = z.strictObject({
  id: z.number().int().positive(),
  username: z.string().min(1),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  image: z.string().url(),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const authErrorResponseSchema = z.strictObject({
  message: z.string(),
});

export type UserLoginResponse = z.infer<typeof userLoginResponseSchema>;
export type AuthErrorResponse = z.infer<typeof authErrorResponseSchema>;
