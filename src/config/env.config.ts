import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  BASE_URL: z.string().url().default('https://www.saucedemo.com'),
  API_BASE_URL: z.string().url().default('https://dummyjson.com'),
  STANDARD_USER: z.string().default('standard_user'),
  STANDARD_PASSWORD: z.string().default('secret_sauce'),
  LOCKED_USER: z.string().default('locked_out_user'),
  DEFAULT_TIMEOUT: z.coerce.number().default(15000),
  CI: z.coerce.boolean().default(false),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment configuration:', parsedEnv.error.format());
  throw new Error('Environment configuration validation failed.');
}

export const ENV = parsedEnv.data;
export type Environment = z.infer<typeof envSchema>;
