import type { AdapterAccount } from "next-auth/adapters";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["customer", "nutritionist", "admin", "owner"]);
export const subscriptionStatus = pgEnum("subscription_status", ["pending", "active", "paused", "completed", "cancelled"]);
export const mealType = pgEnum("meal_type", ["lunch", "dinner"]);
export const orderStatus = pgEnum("order_status", ["scheduled", "preparing", "ready", "delivering", "delivered", "skipped", "cancelled"]);
export const paymentStatus = pgEnum("payment_status", ["pending", "paid", "failed", "expired", "refunded"]);

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date", withTimezone: true }),
  image: text("image"),
  phone: varchar("phone", { length: 24 }),
  role: userRole("role").notNull().default("customer"),
  profileCompleted: boolean("profile_completed").notNull().default(false),
  dietaryNotes: text("dietary_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (token) => [primaryKey({ columns: [token.identifier, token.token] })],
);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 40 }).notNull(),
  recipientName: varchar("recipient_name", { length: 120 }).notNull(),
  recipientPhone: varchar("recipient_phone", { length: 24 }).notNull(),
  addressLine: text("address_line").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 10 }),
  deliveryNotes: text("delivery_notes"),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  mealCredits: integer("meal_credits").notNull(),
  price: integer("price").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id),
  planId: uuid("plan_id").notNull().references(() => plans.id),
  addressId: uuid("address_id").references(() => addresses.id),
  status: subscriptionStatus("status").notNull().default("pending"),
  priceSnapshot: integer("price_snapshot").notNull(),
  initialMealCredits: integer("initial_meal_credits").notNull(),
  remainingMealCredits: integer("remaining_meal_credits").notNull(),
  startsOn: date("starts_on", { mode: "string" }).notNull(),
  endsOn: date("ends_on", { mode: "string" }),
  autoRenew: boolean("auto_renew").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const menus = pgTable("menus", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 140 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  calories: integer("calories").notNull(),
  proteinGrams: integer("protein_grams").notNull(),
  carbohydrateGrams: integer("carbohydrate_grams").notNull(),
  fatGrams: integer("fat_grams").notNull(),
  allergens: jsonb("allergens").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const menuSchedules = pgTable(
  "menu_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    menuId: uuid("menu_id").notNull().references(() => menus.id),
    serviceDate: date("service_date", { mode: "string" }).notNull(),
    mealType: mealType("meal_type").notNull(),
    capacity: integer("capacity").notNull().default(100),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (schedule) => [uniqueIndex("menu_schedule_date_meal_idx").on(schedule.serviceDate, schedule.mealType)],
);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number", { length: 32 }).notNull().unique(),
  userId: text("user_id").notNull().references(() => users.id),
  subscriptionId: uuid("subscription_id").notNull().references(() => subscriptions.id),
  menuScheduleId: uuid("menu_schedule_id").notNull().references(() => menuSchedules.id),
  addressId: uuid("address_id").notNull().references(() => addresses.id),
  status: orderStatus("status").notNull().default("scheduled"),
  dietaryNotesSnapshot: text("dietary_notes_snapshot"),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  provider: varchar("provider", { length: 30 }).notNull(),
  providerReference: varchar("provider_reference", { length: 160 }).unique(),
  amount: integer("amount").notNull(),
  status: paymentStatus("status").notNull().default("pending"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  rawPayload: jsonb("raw_payload").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
