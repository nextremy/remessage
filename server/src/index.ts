import { fastifyAutoload } from "@fastify/autoload";
import { fastify } from "fastify";
import { join } from "path";

const server = fastify({ logger: process.env.NODE_ENV === "development" });

server.register(fastifyAutoload, { dir: join(__dirname, "routes") });

server.listen({ port: 4000 }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
