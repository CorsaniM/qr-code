// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `qr-code_${name}`);

// export const documentUploadsRelations = relations(
//   documentUploads,
//   ({ one, many }) => ({
//     company: one(companies, {
//       fields: [documentUploads.companyId],
//       references: [companies.id],
//     }),
//     payments: many(payments),
//   }),
// );
export const grupos = createTable(
  "grupo",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
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

export const participantes = createTable("participantes", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }),
  lastname: text("lastname", { length: 256 }),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  grupoId: int("grupoId").references(() => grupos.id),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const participantesRelations = relations(participantes, ({ one }) => ({
  grupos: one(grupos, {
    fields: [participantes.grupoId],
    references: [grupos.id],
  }),
}));

export const gruposRelations = relations(grupos, ({ one, many }) => ({
  participantes: many(participantes),
}));
