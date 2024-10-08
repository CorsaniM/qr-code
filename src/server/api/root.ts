import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { gruposRouter } from "./routers/grupos-router";
import { participantesRouter } from "./routers/participantes-router";
import { tareasRouter } from "./routers/tareas-router";
import { grupo_ParticipanteRouter } from "./routers/grupo-participante-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  gruposParticipantes: grupo_ParticipanteRouter,
  participants: participantesRouter,
  grupos: gruposRouter,
  tareas: tareasRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
