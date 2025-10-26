import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import "./lib/sentry.js";
import { authPlugin } from "./plugins/auth.js";
import health from "./routes/health.js";
import figma from "./routes/figma.js";

const app = Fastify({ logger: true });

await app.register(sensible);
await app.register(cors, { origin: true });
await app.register(authPlugin);

app.register(health, { prefix: "/health" });
app.register(figma, { prefix: "/figma" });

app.listen({ host: "0.0.0.0", port: 4000 }, (err: Error | null) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

