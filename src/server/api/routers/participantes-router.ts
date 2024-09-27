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
        grupoId: z.number(),
        disponible: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [respuesta] = await ctx.db
        .insert(participantes)
        .values(input)
        .returning();

      if (!respuesta) {
        throw new Error("Error al crear participante");
      }

      return respuesta; // Devolver el participante creado
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const participante = await ctx.db.query.participantes.findFirst({
        where: eq(participantes.id, input.id),
      });

      if (!participante) {
        throw new Error("Participante no encontrado");
      }

      return participante;
    }),
  getByGrupoId: publicProcedure
    .input(
      z.object({
        grupoId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const participante = await ctx.db.query.participantes.findMany({
        where: eq(participantes?.grupoId, input.grupoId),
      });

      return participante;
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    const participantes = await ctx.db.query.participantes.findMany();
    return participantes;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        lastname: z.string(),
        grupoId: z.number(),
        disponible: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [updatedParticipante] = await ctx.db
        .update(participantes)
        .set({
          name: input.name,
          lastname: input.lastname,
          grupoId: input.grupoId,
          disponible: input.disponible,
        })
        .where(eq(participantes.id, input.id))
        .returning();

      if (!updatedParticipante) {
        throw new Error("Error al actualizar el participante");
      }

      return updatedParticipante;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const deletedParticipante = await ctx.db
        .delete(participantes)
        .where(eq(participantes.id, input.id))
        .returning();

      if (!deletedParticipante) {
        throw new Error("Error al eliminar el participante");
      }

      return { success: true, message: "Participante eliminado correctamente" };
    }),
});
