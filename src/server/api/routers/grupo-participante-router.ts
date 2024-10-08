import { eq } from "drizzle-orm";
import { QrCode } from "lucide-react";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { grupo_participantes } from "~/server/db/schema";


export const grupo_ParticipanteRouter = createTRPCRouter({
    
  addParticipant: publicProcedure
  .input(
    z.object({
      grupoId: z.number(),        // ID del grupo
      participantId: z.number(),  // ID del participante
    }),
  )
  .mutation(async ({ input, ctx }) => {
    try {
      const newRelation = await ctx.db
        .insert(grupo_participantes)
        .values({
          grupo_id: input.grupoId,
          participante_id: input.participantId,
        })
        .returning();

      return newRelation;
    } catch (error) {
      throw new Error(`Error al agregar participante al grupo: `);
    }
  }),
  removeParticipant: publicProcedure
  .input(
    z.object({
      grupoId: z.number(),        // ID del grupo
      participantId: z.number(),  // ID del participante
    }),
  )
  .mutation(async ({ input, ctx }) => {
    try {
      // Eliminar el participante de la relación grupo-participante
      const deletedRelation = await ctx.db
        .delete(grupo_participantes)
        .where(
          eq(grupo_participantes.grupo_id, input.grupoId && input.participantId),
        )
        .returning();

      if (!deletedRelation) {
        throw new Error("La relación entre el grupo y el participante no existe.");
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Error al eliminar el participante del grupo:`);
    }
  }),

})