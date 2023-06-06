import fastifyAutoload from "@fastify/autoload";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifySecureSession from "@fastify/secure-session";
import fastifySensible from "@fastify/sensible";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyWebsocket from "@fastify/websocket";
import fastify_, {
  FastifyBaseLogger,
  FastifyInstanceTypebox,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import path from "path";
import authenticationRoutes from "./routes/authentication";

const fastify = fastify_({
  logger: {
    enabled: process.env.NODE_ENV === "development",
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(fastifyCookie);
fastify.register(fastifySecureSession, { key: process.env.SESSION_KEY! });
fastify.register(fastifyHelmet);
fastify.register(fastifySensible);
fastify.register(fastifyWebsocket);

fastify.register(authenticationRoutes);
fastify.register(async (fastify: FastifyInstanceTypebox) => {
  fastify.addHook("preHandler", async (request) => {
    if (request.session.id === undefined) {
      throw fastify.httpErrors.unauthorized();
    }
  });

  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"),
    ignoreFilter: (path) => path.endsWith("authentication.js"),
  });
});

fastify.listen({ port: 4000 }).catch((error) => {
  fastify.log.error(error);
  process.exit(1);
});

declare module "fastify" {
  type FastifyInstanceTypebox = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyBaseLogger,
    TypeBoxTypeProvider
  >;
}

declare module "@fastify/secure-session" {
  interface SessionData {
    id: string;
  }
}
