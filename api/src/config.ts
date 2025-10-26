import { z } from "zod";

const Env = z.object({
  DATABASE_URL: z.string().url().optional(),
  CLERK_JWT_ISSUER: z.string(),
  CLERK_JWT_AUDIENCE: z.string(),
  CLERK_PEM_PUBLIC_KEY: z.string(),
  SENTRY_DSN: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

export const env = Env.parse(process.env);

