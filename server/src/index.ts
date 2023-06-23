import fastify from "fastify";

const server = fastify();

server.listen({ port: 4000 }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
