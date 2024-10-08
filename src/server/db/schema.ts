// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `qr-code_${name}`);

export const tareas = createTable(
  "tareas",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }),
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

export const grupo_participantes = createTable("grupo_participantes", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  grupo_id: int("grupo_id")
    .references(() => grupos.id) // Llave foránea a la tabla grupos
    .notNull(),
  participante_id: int("participante_id")
    .references(() => participantes.id) // Llave foránea a la tabla participantes
    .notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const participantes = createTable("participantes", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }),
  lastname: text("lastname", { length: 256 }),
  disponible: int("disponible", {mode: "boolean"}),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
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
export const participantesRelations = relations(participantes, ({ many }) => ({

  tareas: many(tareas),
  grupos: many(grupo_participantes),
}));

export const grupoParticipantesRelations = relations(grupo_participantes, ({ one }) => ({
  grupo: one(grupos, {
    fields: [grupo_participantes.grupo_id], // Relaciona con la tabla grupos
    references: [grupos.id],
  }),
  participante: one(participantes, {
    fields: [grupo_participantes.participante_id], // Relaciona con la tabla participantes
    references: [participantes.id],
  }),
}));

export const gruposRelations = relations(grupos, ({ many }) => ({
  participantes: many(grupo_participantes),
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
