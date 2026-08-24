import {
  pgTable,
  serial,
  text,
  integer,
  date,
  timestamp,
  jsonb,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

// Projects can be a "supply" (New Project / Supply and Installation), "maintenance" or "amc".
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  clientName: text("client_name").notNull().default(""),
  location: text("location").notNull().default(""),
  contractDate: date("contract_date").notNull(),
  status: text("status").notNull().default("active"),
  shopDrawingStatus: text("shop_drawing_status").notNull().default("pending"),
  progress: integer("progress").notNull().default(0),
  tasks: jsonb("tasks").$type<{ key: string; label: string }[]>().notNull().default([]),
  completedTasks: jsonb("completed_tasks").$type<string[]>().notNull().default([]),
  notes: text("notes").notNull().default(""),
  // Optional link to the installed project an AMC maintains.
  parentProjectId: integer("parent_project_id").references(
    (): AnyPgColumn => projects.id,
    {
      onDelete: "set null",
    }
  ),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// An AMC project has 4 visits per year. Each visit is tracked here.
export const amcVisits = pgTable("amc_visits", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  visitNumber: integer("visit_number").notNull(),
  visitDate: date("visit_date").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes").notNull().default(""),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type AmcVisit = typeof amcVisits.$inferSelect;
export type NewAmcVisit = typeof amcVisits.$inferInsert;
