import { eq } from "drizzle-orm";
import { QrCode } from "lucide-react";
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulación de retardo

      try {
        const [respuesta] = await ctx.db
          .insert(grupos)
          .values(input)
          .returning();
        return respuesta;
      } catch {
        throw new Error("Error al crear el grupo: ");
      }
    }),
  list: publicProcedure.query(async () => {
    const Grupos = await db.query.grupos.findMany({
      with: { participantes: true, tareas: true },
    });

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
        with: { participantes: true, tareas: true },
      });
      //grupo => many participantes
      return channel;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        fecha_ultimo_trabajo: z.date().optional(),
        qrCode: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedGroup = await ctx.db
        .update(grupos)
        .set({
          name: input.name,
          fecha_ultimo_trabajo: input.fecha_ultimo_trabajo,
          qrCode: input.qrCode,
        })
        .where(eq(grupos.id, input.id))
        .returning(); // Para devolver los datos actualizados

      if (!updatedGroup) {
        throw new Error("Error al actualizar el grupo");
      }

      return updatedGroup;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const deletedGroup = await db
        .delete(grupos)
        .where(eq(grupos.id, input.id))
        .returning();

      if (!deletedGroup) {
        throw new Error("Error al eliminar el grupo");
      }

      return { success: true };
    }),
});
