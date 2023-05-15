import fastify from "fastify";

const server = fastify();

server.listen({ port: 4000 }, (error, address) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
