import fastifyAutoload from "@fastify/autoload";
import fastifyJwt from "@fastify/jwt";
import fastifySensible from "@fastify/sensible";
import fastify from "fastify";
import { join } from "path";
import authRoutes from "./routes/auth";

const app = fastify({
  logger: process.env.NODE_ENV === "development",
});

if (process.env.JWT_SECRET === undefined) {
  app.log.error("No JWT_SECRET environment variable was provided.");
  process.exit(1);
}
void app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
});
void app.register(fastifySensible);
void app.register(authRoutes);
void app.register(async (app) => {
  void app.register(fastifyAutoload, {
    dir: join(__dirname, "routes"),
    ignoreFilter: (path) => path.endsWith("auth.js"),
  });
  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      void reply.code(401);
      throw new Error();
    }
  });
});

app.listen({ port: 4000 }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
