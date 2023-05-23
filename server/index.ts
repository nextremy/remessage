import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifySecureSession from "@fastify/secure-session";
import fastifySensible from "@fastify/sensible";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify_, {
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import authenticationRoutes from "./routes/authentication";
import userRoutes from "./routes/user";

const fastify = fastify_({
  logger: process.env.NODE_ENV === "development",
}).withTypeProvider<TypeBoxTypeProvider>();

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
    id: number;
  }
}

fastify.register(fastifyCookie);
fastify.register(fastifySecureSession, { key: process.env.SESSION_KEY! });
fastify.register(fastifyHelmet);
fastify.register(fastifySensible);

fastify.register(authenticationRoutes);
fastify.register(userRoutes);

fastify.listen({ port: 4000 }, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
