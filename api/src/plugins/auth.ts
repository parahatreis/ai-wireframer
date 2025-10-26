import { FastifyPluginAsync } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config.js";

export const authPlugin: FastifyPluginAsync = async (app) => {
  app.decorate("requireAuth", (req: any) => {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) throw app.httpErrors.unauthorized();
    try {
      const payload = jwt.verify(token, env.CLERK_PEM_PUBLIC_KEY, {
        algorithms: ["RS256"],
        audience: env.CLERK_JWT_AUDIENCE,
      });
      req.auth = payload;
    } catch {
      throw app.httpErrors.unauthorized();
    }
  });
};

declare module "fastify" {
  interface FastifyInstance {
    requireAuth: (req: any) => void;
  }
}

