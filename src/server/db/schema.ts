// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `qr-code_${name}`);

export const tareas = createTable(
  "tareas",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("name", { length: 256 }),
    grupoid: int("grupoid").references(() => grupos.id),
    participantesid: int("participantesid").references(() => participantes.id),
    description: text("description", { length: 256 }),
    fecha: int("fecha", { mode: "timestamp" }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
  }),
);

export const participantes = createTable("participantes", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }),
  lastname: text("lastname", { length: 256 }),
  disponible: int("disponible", {mode: "boolean"}),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  grupoId: int("grupoId").references(() => grupos.id),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});
export const grupos = createTable(
  "grupo",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    qrCode: text("qrCode", { length: 256 }),
    fecha_ultimo_trabajo: int("fecha_ultimo_trabajo", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);
export const participantesRelations = relations(participantes, ({ one }) => ({
  grupos: one(grupos, {
    fields: [participantes.grupoId],
    references: [grupos.id],
  }),
}));

export const gruposRelations = relations(grupos, ({ many }) => ({
  participantes: many(participantes),
  tareas: many(tareas),
}));

export const tareasRelations = relations(tareas, ({ one }) => ({
  grupos: one(grupos, {
    fields: [tareas.grupoid],
    references: [grupos.id],
  }),
  participantes: one(participantes, {
    fields: [tareas.participantesid],
    references: [participantes.id],
  }),
}));
