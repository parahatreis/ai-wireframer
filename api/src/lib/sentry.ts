import * as Sentry from "@sentry/node";
import { env } from "../config.js";

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 0.1,
  });
}

