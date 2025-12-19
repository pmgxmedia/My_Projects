// Database storage implementation for PMGXmedia platform
// Ref: blueprint:javascript_database
import {
  users,
  projects,
  analyticsEvents,
  enquiries,
  feedback,
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type Enquiry,
  type InsertEnquiry,
  type Feedback,
  type InsertFeedback,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProjectByHandleId(handleId: string): Promise<Project | undefined>;
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;

  // Analytics methods
  recordAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getProjectAnalytics(projectId: string): Promise<{
    totalViews: number;
    totalEnquiries: number;
    avgEngagement: number;
  }>;
  getGlobalAnalytics(): Promise<{
    totalProjectViews: number;
    activeVisitors: number;
    totalEnquiries: number;
  }>;

  // Enquiry methods
  createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;
  getAllEnquiries(): Promise<Enquiry[]>;
  getEnquiriesByProject(projectId: string): Promise<Enquiry[]>;
  updateEnquiryStatus(id: string, status: string): Promise<void>;

  // Feedback methods
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getProjectFeedback(projectId: string): Promise<Feedback[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProjectByHandleId(handleId: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.handleId, handleId));
    return project || undefined;
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Analytics methods
  async recordAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [recorded] = await db.insert(analyticsEvents).values(event).returning();
    return recorded;
  }

  async getProjectAnalytics(projectId: string): Promise<{
    totalViews: number;
    totalEnquiries: number;
    avgEngagement: number;
  }> {
    const [viewsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          eq(analyticsEvents.eventType, "view")
        )
      );

    const [enquiriesResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(enquiries)
      .where(eq(enquiries.projectId, projectId));

    return {
      totalViews: viewsResult?.count || 0,
      totalEnquiries: enquiriesResult?.count || 0,
      avgEngagement: 85, // Placeholder calculation
    };
  }

  async getGlobalAnalytics(): Promise<{
    totalProjectViews: number;
    activeVisitors: number;
    totalEnquiries: number;
  }> {
    const [viewsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, "view"));

    // Active visitors: unique sessions in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const [activeResult] = await db
      .select({ count: sql<number>`count(distinct metadata->>'sessionId')::int` })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, "view"),
          gte(analyticsEvents.createdAt, tenMinutesAgo)
        )
      );

    const [enquiriesResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(enquiries);

    return {
      totalProjectViews: viewsResult?.count || 0,
      activeVisitors: activeResult?.count || 0,
      totalEnquiries: enquiriesResult?.count || 0,
    };
  }

  // Enquiry methods
  async createEnquiry(insertEnquiry: InsertEnquiry): Promise<Enquiry> {
    const [enquiry] = await db.insert(enquiries).values(insertEnquiry).returning();
    return enquiry;
  }

  async getAllEnquiries(): Promise<Enquiry[]> {
    return await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
  }

  async getEnquiriesByProject(projectId: string): Promise<Enquiry[]> {
    return await db
      .select()
      .from(enquiries)
      .where(eq(enquiries.projectId, projectId))
      .orderBy(desc(enquiries.createdAt));
  }

  async updateEnquiryStatus(id: string, status: string): Promise<void> {
    await db.update(enquiries).set({ status }).where(eq(enquiries.id, id));
  }

  // Feedback methods
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedbackRecord] = await db.insert(feedback).values(insertFeedback).returning();
    return feedbackRecord;
  }

  async getProjectFeedback(projectId: string): Promise<Feedback[]> {
    return await db
      .select()
      .from(feedback)
      .where(eq(feedback.projectId, projectId))
      .orderBy(desc(feedback.createdAt));
  }
}

export const storage = new DatabaseStorage();
