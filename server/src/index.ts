import fastifyAutoload from "@fastify/autoload";
import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import { join } from "path";

const app = fastify({ logger: process.env.NODE_ENV === "development" });

app.register(fastifyCookie);
app.register(fastifyAutoload, { dir: join(__dirname, "routes") });

app.listen({ port: 4000 }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
