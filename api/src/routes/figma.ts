import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const Body = z.object({
  wireframeJson: z.any(),
  target: z.enum(["figma", "react", "html"]).default("figma"),
});

const route: FastifyPluginAsync = async (app) => {
  app.post("/export", async (req, res) => {
    const { wireframeJson } = Body.parse(req.body);
    // TODO: normalize JSON for plugin
    return res.send({ ok: true, frames: 1, nodes: 12, payload: wireframeJson });
  });
};

export default route;

