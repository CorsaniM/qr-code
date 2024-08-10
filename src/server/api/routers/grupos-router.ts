import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { grupos } from "~/server/db/schema";

export const gruposRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        fecha_ultimo_trabajo: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [respuesta] = await ctx.db.insert(grupos).values(input).returning();

      if (!respuesta) {
        throw new Error("Error al crear el comentario");
      }
    }),
  list: publicProcedure.query(async ({}) => {
    const Grupos = await db.query.grupos.findMany();
    return Grupos;
  }),
  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const channel = await ctx.db.query.grupos.findFirst({
        where: eq(grupos.id, input.id),
      });

      return channel;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        fecha_ultimo_trabajo: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const Grupos = await ctx.db.query.grupos.findFirst({
        where: eq(grupos.id, input.id),
      });

      return Grupos;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(grupos).where(eq(grupos.id, input.id));
    }),
});
