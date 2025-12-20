import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, index, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table (Authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Projects Table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  handleId: text("handle_id").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  industry: text("industry").notNull(),
  status: text("status").notNull(), // 'live', 'demo', 'concept'
  description: text("description").notNull(),
  technologies: text("technologies").array().notNull(),
  impact: text("impact").array().notNull(),
  previewImage: text("preview_image").notNull(),
  isHidden: boolean("is_hidden").notNull().default(false),
  projectFilesPath: text("project_files_path"),
  demoUrl: text("demo_url"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  handleIdIdx: index("handle_id_idx").on(table.handleId),
}));

export const insertProjectSchema = createInsertSchema(projects, {
  status: z.enum(["live", "demo", "concept"]),
  technologies: z.array(z.string()).min(1),
  impact: z.array(z.string()).min(1),
  isHidden: z.boolean().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectProjectSchema = createSelectSchema(projects);
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Analytics Events Table
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // 'view', 'session_start', 'session_end'
  sessionDuration: integer("session_duration"), // in seconds
  visitorLocation: text("visitor_location"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  projectIdIdx: index("analytics_project_id_idx").on(table.projectId),
  eventTypeIdx: index("analytics_event_type_idx").on(table.eventType),
}));

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

// Enquiries Table
export const enquiries = pgTable("enquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  type: text("type").notNull(), // 'similar', 'license', 'custom'
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'reviewed', 'responded'
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  projectIdIdx: index("enquiries_project_id_idx").on(table.projectId),
  statusIdx: index("enquiries_status_idx").on(table.status),
}));

export const insertEnquirySchema = createInsertSchema(enquiries, {
  type: z.enum(["similar", "license", "custom"]),
  email: z.string().email(),
  message: z.string().min(10),
}).omit({ id: true, createdAt: true, status: true });

export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type Enquiry = typeof enquiries.$inferSelect;

// Feedback Table
export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }),
  efficiency: integer("efficiency").notNull(),
  clarity: integer("clarity").notNull(),
  innovation: integer("innovation").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  projectIdIdx: index("feedback_project_id_idx").on(table.projectId),
}));

export const insertFeedbackSchema = createInsertSchema(feedback, {
  efficiency: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  innovation: z.number().min(0).max(100),
}).omit({ id: true, createdAt: true });

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;

// Resumes Table
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  objectPath: text("object_path").notNull(),
  fileSize: integer("file_size").notNull(),
  contentType: text("content_type").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({ id: true, createdAt: true });
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

// Site Settings Table
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({ id: true, updatedAt: true });
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
