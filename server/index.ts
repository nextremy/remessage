import fastifyAutoload from "@fastify/autoload";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifySecureSession from "@fastify/secure-session";
import fastifySensible from "@fastify/sensible";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyWebsocket from "@fastify/websocket";
import fastify_, {
  CustomFastifyInstance,
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import path from "path";
import authenticationRoutes from "./routes/authentication";

const isDevelopment = process.env.NODE_ENV === "development";

const fastify = fastify_({
  logger: {
    enabled: isDevelopment,
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

if (isDevelopment) {
  fastify.register(fastifySwagger);
  fastify.register(fastifySwaggerUi);
}
fastify.register(fastifyCookie);
fastify.register(fastifySecureSession, { key: process.env.SESSION_KEY! });
fastify.register(fastifyHelmet);
fastify.register(fastifySensible);
fastify.register(fastifyWebsocket);

fastify.register(authenticationRoutes);
fastify.register(async (fastify: CustomFastifyInstance) => {
  fastify.addHook("preHandler", async (request) => {
    fastify.assert(request.session.id);
  });

  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"),
    ignoreFilter: (path) => path.endsWith("authentication.js"),
  });
});

const port = 4000;
fastify
  .listen({ port })
  .then(() => {
    if (isDevelopment) {
      fastify.log.info(
        `Documentation at http://localhost:${port}/documentation`
      );
    }
  })
  .catch((error) => {
    fastify.log.error(error);
    process.exit(1);
  });

declare module "fastify" {
  type CustomFastifyInstance = FastifyInstance<
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
