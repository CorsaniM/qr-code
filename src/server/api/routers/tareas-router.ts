import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { tareas } from "~/server/db/schema";

export const tareasRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        grupoId: z.number(),
        description: z.string(),
        fecha:z.date(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [respuesta] = await ctx.db
        .insert(tareas)
        .values(input)
        .returning();

      if (!respuesta) {
        throw new Error("Error al crear tarea");
      }

      return respuesta; // Devolver el tarea creado
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const tarea = await ctx.db.query.tareas.findFirst({
        where: eq(tareas.id, input.id),
      });

      if (!tarea) {
        throw new Error("tarea no encontrado");
      }

      return tarea;
    }),
  getByGrupoId: publicProcedure
    .input(
      z.object({
        grupoId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const tarea = await ctx.db.query.tareas.findMany({
        where: eq(tareas?.grupoid, input.grupoId),
      });

      return tarea;
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    const tareas = await ctx.db.query.tareas.findMany();
    return tareas;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        grupoId: z.number(),
        description: z.string(),
        fecha:z.date(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [updatedtarea] = await ctx.db
        .update(tareas)
        .set({
            title: input.title,
            grupoid: input.grupoId,
            description: input.description,
            fecha: input.fecha,
            createdAt: input.createdAt,
        })
        .where(eq(tareas.id, input.id))
        .returning();

      if (!updatedtarea) {
        throw new Error("Error al actualizar el tarea");
      }

      return updatedtarea;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const deletedtarea = await ctx.db
        .delete(tareas)
        .where(eq(tareas.id, input.id))
        .returning();

      if (!deletedtarea) {
        throw new Error("Error al eliminar el tarea");
      }

      return { success: true, message: "tarea eliminado correctamente" };
    }),
});
