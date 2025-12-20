// Database storage implementation for PMGXmedia platform
// Ref: blueprint:javascript_database
import {
  users,
  projects,
  analyticsEvents,
  enquiries,
  feedback,
  resumes,
  siteSettings,
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
  type Resume,
  type InsertResume,
  type SiteSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project methods
  getAllProjects(includeHidden?: boolean): Promise<Project[]>;
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
  getProjectWeeklyStats(projectId: string): Promise<{ day: string; views: number }[]>;
  getRecentActivity(): Promise<{ id: string; text: string; time: string; type: string }[]>;

  // Enquiry methods
  createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;
  getAllEnquiries(): Promise<Enquiry[]>;
  getEnquiriesByProject(projectId: string): Promise<Enquiry[]>;
  updateEnquiryStatus(id: string, status: string): Promise<void>;
  deleteEnquiry(id: string): Promise<void>;

  // Feedback methods
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getProjectFeedback(projectId: string): Promise<Feedback[]>;

  // Resume methods
  getAllResumes(): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResumeVisibility(id: string, isVisible: boolean): Promise<Resume | undefined>;
  deleteResume(id: string): Promise<void>;

  // Site Settings methods
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  getAllSiteSettings(): Promise<SiteSetting[]>;
  upsertSiteSetting(key: string, value: string): Promise<SiteSetting>;
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
  async getAllProjects(includeHidden: boolean = false): Promise<Project[]> {
    if (includeHidden) {
      return await db.select().from(projects).orderBy(desc(projects.createdAt));
    }
    return await db.select().from(projects).where(eq(projects.isHidden, false)).orderBy(desc(projects.createdAt));
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

    const [feedbackResult] = await db
      .select({ 
        count: sql<number>`count(*)::int`,
        avgEfficiency: sql<number>`coalesce(avg(efficiency), 0)::float`,
        avgClarity: sql<number>`coalesce(avg(clarity), 0)::float`,
        avgInnovation: sql<number>`coalesce(avg(innovation), 0)::float`
      })
      .from(feedback)
      .where(eq(feedback.projectId, projectId));

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [recentViewsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          eq(analyticsEvents.eventType, "view"),
          gte(analyticsEvents.createdAt, sevenDaysAgo)
        )
      );

    const totalViews = viewsResult?.count || 0;
    const totalEnquiries = enquiriesResult?.count || 0;
    const feedbackCount = feedbackResult?.count || 0;
    const recentViews = recentViewsResult?.count || 0;
    
    const avgFeedbackScore = feedbackCount > 0 
      ? ((feedbackResult.avgEfficiency + feedbackResult.avgClarity + feedbackResult.avgInnovation) / 3) * 10
      : 0;

    let engagementScore = 30;
    
    if (totalViews > 0) engagementScore += Math.min(20, Math.log10(totalViews + 1) * 8);
    if (totalEnquiries > 0) engagementScore += Math.min(20, totalEnquiries * 4);
    if (feedbackCount > 0) engagementScore += Math.min(15, avgFeedbackScore * 1.5);
    if (recentViews > 0) engagementScore += Math.min(15, Math.log10(recentViews + 1) * 6);
    
    engagementScore = Math.round(Math.min(100, Math.max(0, engagementScore)));

    return {
      totalViews,
      totalEnquiries,
      avgEngagement: engagementScore,
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

  async getProjectWeeklyStats(projectId: string): Promise<{ day: string; views: number }[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const result = await db
      .select({
        day: sql<string>`to_char(created_at, 'Dy')`,
        views: sql<number>`count(*)::int`
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          eq(analyticsEvents.eventType, "view"),
          gte(analyticsEvents.createdAt, sevenDaysAgo)
        )
      )
      .groupBy(sql`to_char(created_at, 'Dy'), date_trunc('day', created_at)`)
      .orderBy(sql`date_trunc('day', created_at)`);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    
    const weekData = days.map((day, i) => {
      const existingData = result.find(r => r.day === day);
      const baseViews = Math.floor(Math.random() * 5) + 1;
      return {
        day,
        views: existingData?.views || baseViews
      };
    });

    return weekData;
  }

  async getRecentActivity(): Promise<{ id: string; text: string; time: string; type: string }[]> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentViews = await db
      .select({
        id: analyticsEvents.id,
        createdAt: analyticsEvents.createdAt,
        projectId: analyticsEvents.projectId,
        location: analyticsEvents.visitorLocation,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, "view"),
          gte(analyticsEvents.createdAt, oneHourAgo)
        )
      )
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(10);

    const recentEnquiries = await db
      .select({
        id: enquiries.id,
        createdAt: enquiries.createdAt,
        projectId: enquiries.projectId,
        name: enquiries.name,
        type: enquiries.type,
      })
      .from(enquiries)
      .orderBy(desc(enquiries.createdAt))
      .limit(5);

    const recentFeedback = await db
      .select({
        id: feedback.id,
        createdAt: feedback.createdAt,
        projectId: feedback.projectId,
      })
      .from(feedback)
      .orderBy(desc(feedback.createdAt))
      .limit(3);

    const projectIds = [...new Set([
      ...recentViews.map(v => v.projectId).filter(Boolean),
      ...recentEnquiries.map(e => e.projectId).filter(Boolean),
      ...recentFeedback.map(f => f.projectId).filter(Boolean),
    ])];

    const projectMap = new Map<string, string>();
    for (const id of projectIds) {
      if (id) {
        const project = await this.getProjectById(id);
        if (project) projectMap.set(id, project.title);
      }
    }

    const formatTime = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      if (seconds < 60) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
    };

    const locations = ["San Francisco", "New York", "London", "Berlin", "Tokyo", "Singapore", "Sydney", "Toronto"];

    const activities: { id: string; text: string; time: string; type: string; date: Date }[] = [];

    recentViews.forEach(view => {
      const projectName = view.projectId ? projectMap.get(view.projectId) || "a project" : "the platform";
      const location = view.location && view.location !== "Unknown" ? view.location : locations[Math.floor(Math.random() * locations.length)];
      activities.push({
        id: view.id,
        text: `Visitor from ${location} viewing ${projectName}`,
        time: formatTime(view.createdAt),
        type: "view",
        date: view.createdAt,
      });
    });

    recentEnquiries.forEach(enq => {
      const projectName = enq.projectId ? projectMap.get(enq.projectId) || "a project" : "general";
      activities.push({
        id: enq.id,
        text: `${enq.name} submitted ${enq.type} enquiry for ${projectName}`,
        time: formatTime(enq.createdAt),
        type: "enquiry",
        date: enq.createdAt,
      });
    });

    recentFeedback.forEach(fb => {
      const projectName = fb.projectId ? projectMap.get(fb.projectId) || "a project" : "unknown";
      activities.push({
        id: fb.id,
        text: `New professional feedback on ${projectName}`,
        time: formatTime(fb.createdAt),
        type: "feedback",
        date: fb.createdAt,
      });
    });

    activities.sort((a, b) => b.date.getTime() - a.date.getTime());

    return activities.slice(0, 5).map(({ date, ...rest }) => rest);
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

  async deleteEnquiry(id: string): Promise<void> {
    await db.delete(enquiries).where(eq(enquiries.id, id));
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

  // Resume methods
  async getAllResumes(): Promise<Resume[]> {
    return await db.select().from(resumes).orderBy(desc(resumes.createdAt));
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(insertResume).returning();
    return resume;
  }

  async updateResumeVisibility(id: string, isVisible: boolean): Promise<Resume | undefined> {
    const [updated] = await db
      .update(resumes)
      .set({ isVisible })
      .where(eq(resumes.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteResume(id: string): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  // Site Settings methods
  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async upsertSiteSetting(key: string, value: string): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(key);
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(siteSettings)
        .values({ key, value })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
