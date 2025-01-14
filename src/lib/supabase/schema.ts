import { foreignKey } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const workspace = pgTable("workspace", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
  workspaceOwner: uuid("workspace_owner").notNull(),
  title: text().notNull(),
  iconId: text("icon_id").notNull(),
  data: text(),
  inTrash: text("in_trash"),
  logo: text(),
  bannerUrl: text("banner_url"),
});

export const files = pgTable(
  "files",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
    title: text().notNull(),
    iconId: text("icon_id").notNull(),
    data: text(),
    inTrash: text("in_trash"),
    bannerUrl: text("banner_url"),
    workspaceId: uuid("workspace_id"),
    folderId: uuid("folder_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.folderId],
      foreignColumns: [folder.id],
      name: "files_folder_id_folder_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspace.id],
      name: "files_workspace_id_workspace_id_fk",
    }).onDelete("cascade"),
  ]
);

export const folder = pgTable(
  "folder",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
    title: text().notNull(),
    iconId: text("icon_id").notNull(),
    data: text(),
    inTrash: text("in_trash"),
    bannerUrl: text("banner_url"),
    workspaceId: uuid("workspace_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspace.id],
      name: "folder_workspace_id_workspace_id_fk",
    }).onDelete("cascade"),
  ]
);
