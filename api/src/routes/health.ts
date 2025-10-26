import { FastifyPluginAsync } from "fastify";

const route: FastifyPluginAsync = async (app) => {
  app.get("/", async () => ({ ok: true }));
};

export default route;

