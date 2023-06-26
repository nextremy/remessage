import fastifyAutoload from "@fastify/autoload";
import fastifyJwt from "@fastify/jwt";
import fastifySensible from "@fastify/sensible";
import fastify from "fastify";
import { join } from "path";
import authRoutes from "./routes/auth";

const app = fastify({
  logger: process.env.NODE_ENV === "development",
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});
app.register(fastifySensible);
app.register(authRoutes);
app.register(async (app) => {
  app.register(fastifyAutoload, {
    dir: join(__dirname, "routes"),
    ignoreFilter: (path) => path.endsWith("auth.js"),
  });
  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.code(401).send();
    }
  });
});

app.listen({ port: 4000 }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
