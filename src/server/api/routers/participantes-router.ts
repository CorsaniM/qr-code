import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { participantes } from "~/server/db/schema";

export const participantesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        lastname: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [respuesta] = await ctx.db
        .insert(participantes)
        .values(input)
        .returning();

      if (!respuesta) {
        throw new Error("Error al crear el comentario");
      }
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const channel = await ctx.db.query.participantes.findFirst({
        where: eq(participantes.id, input.id),
      });

      return channel;
    }),

  list: publicProcedure.query(async ({}) => {
    const participantes = await db.query.participantes.findMany();
    return participantes;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        lastname: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const Participantes = await ctx.db.query.participantes.findFirst({
        where: eq(participantes.id, input.id),
      });

      return Participantes;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(participantes).where(eq(participantes.id, input.id));
    }),
});
