import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db, schema } from "~/server/db";
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
        .values({
          name: input.name,
          lastname: input.lastname,
          disponible: input.disponible,
        })
        .returning();

        const participante = await db.insert(schema.grupo_participantes).values({
          grupo_id: input.grupoId ?? 0,
          participante_id: respuesta?.id ?? 0,
        })
      if (!respuesta) {
        throw new Error("Error al crear participante");
      }

      return respuesta; // Devolver el participante creado
    }),

    getByGroup: publicProcedure
    .input(
      z.object({
        grupoId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const grupo_participants = await ctx.db.query.grupo_participantes.findMany({
        where: eq(schema.grupo_participantes.grupo_id, input.grupoId),
      })
      const participants = await ctx.db.query.participantes.findMany({
        where: inArray(schema.participantes.id, grupo_participants.map(participant => participant.participante_id)),
      })
      return participants ?? []
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
