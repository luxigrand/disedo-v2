import { pgTable, text, timestamp, uuid, boolean, integer, jsonb, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid().notNull().primaryKey(),
  server_id: uuid().notNull(),
  name: varchar({ length: 255 }).notNull(),
  position: integer().notNull(),
  created_at: timestamp(),
});

export const channels = pgTable("channels", {
  id: uuid().notNull().primaryKey(),
  server_id: uuid().notNull(),
  category_id: uuid(),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 20 }).notNull(),
  position: integer().notNull(),
  created_at: timestamp(),
  updated_at: timestamp(),
});

export const messages = pgTable("messages", {
  id: uuid().notNull().primaryKey(),
  channel_id: uuid().notNull(),
  user_id: uuid().notNull(),
  content: text().notNull(),
  created_at: timestamp(),
  updated_at: timestamp(),
});

export const server_members = pgTable("server_members", {
  id: uuid().notNull().primaryKey(),
  server_id: uuid().notNull(),
  user_id: uuid().notNull(),
  role: varchar({ length: 50 }),
  joined_at: timestamp(),
});

export const servers = pgTable("servers", {
  id: uuid().notNull().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  icon_url: text(),
  owner_id: uuid().notNull(),
  created_at: timestamp(),
  updated_at: timestamp(),
  password: varchar({ length: 255 }),
});

export const user_profiles = pgTable("user_profiles", {
  user_id: uuid().notNull().primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  avatar_url: text(),
  status: varchar({ length: 20 }),
  created_at: timestamp(),
  updated_at: timestamp(),
});

// Foreign key relationships:
// server_members.server_id -> servers.id
// categories.server_id -> servers.id
// channels.server_id -> servers.id
// channels.category_id -> categories.id
// messages.channel_id -> channels.id
