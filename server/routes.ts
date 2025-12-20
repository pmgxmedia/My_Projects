import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertEnquirySchema, insertFeedbackSchema, insertAnalyticsEventSchema, insertResumeSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register object storage routes
  registerObjectStorageRoutes(app);

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const includeHidden = req.query.includeHidden === 'true';
      const projects = await storage.getAllProjects(includeHidden);
      
      // Enrich projects with analytics
      const enrichedProjects = await Promise.all(
        projects.map(async (project) => {
          const analytics = await storage.getProjectAnalytics(project.id);
          return {
            ...project,
            views: analytics.totalViews,
            enquiries: analytics.totalEnquiries,
            engagementScore: analytics.avgEngagement,
            avgSession: "4m 12s",
            handle: `/p/${project.handleId}`,
          };
        })
      );

      res.json(enrichedProjects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:handleId", async (req, res) => {
    try {
      const project = await storage.getProjectByHandleId(req.params.handleId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const analytics = await storage.getProjectAnalytics(project.id);
      res.json({
        ...project,
        views: analytics.totalViews,
        enquiries: analytics.totalEnquiries,
        engagementScore: analytics.avgEngagement,
        avgSession: "4m 12s",
        handle: `/p/${project.handleId}`,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validated = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validated);
      res.status(201).json(project);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const updates = req.body;
      const project = await storage.updateProject(req.params.id, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics routes
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const validated = insertAnalyticsEventSchema.parse(req.body);
      const event = await storage.recordAnalyticsEvent(validated);
      res.status(201).json(event);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analytics/global", async (req, res) => {
    try {
      const analytics = await storage.getGlobalAnalytics();
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/activity/recent", async (req, res) => {
    try {
      const activity = await storage.getRecentActivity();
      res.json(activity);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analytics/project/:projectId", async (req, res) => {
    try {
      const analytics = await storage.getProjectAnalytics(req.params.projectId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:projectId/stats", async (req, res) => {
    try {
      const analytics = await storage.getProjectAnalytics(req.params.projectId);
      const weeklyData = await storage.getProjectWeeklyStats(req.params.projectId);
      res.json({
        totalViews: analytics.totalViews,
        totalEnquiries: analytics.totalEnquiries,
        engagementScore: analytics.avgEngagement,
        weeklyData,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Enquiry routes
  app.post("/api/enquiries", async (req, res) => {
    try {
      const validated = insertEnquirySchema.parse(req.body);
      const enquiry = await storage.createEnquiry(validated);
      res.status(201).json(enquiry);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/enquiries", async (req, res) => {
    try {
      const enquiries = await storage.getAllEnquiries();
      res.json(enquiries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/enquiries/project/:projectId", async (req, res) => {
    try {
      const enquiries = await storage.getEnquiriesByProject(req.params.projectId);
      res.json(enquiries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/enquiries/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateEnquiryStatus(req.params.id, status);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/enquiries/:id", async (req, res) => {
    try {
      await storage.deleteEnquiry(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Feedback routes
  app.post("/api/feedback", async (req, res) => {
    try {
      const validated = insertFeedbackSchema.parse(req.body);
      const feedbackRecord = await storage.createFeedback(validated);
      res.status(201).json(feedbackRecord);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/feedback/project/:projectId", async (req, res) => {
    try {
      const feedbackRecords = await storage.getProjectFeedback(req.params.projectId);
      res.json(feedbackRecords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Resume routes
  app.get("/api/resumes", async (req, res) => {
    try {
      const resumes = await storage.getAllResumes();
      res.json(resumes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/resumes", async (req, res) => {
    try {
      const validated = insertResumeSchema.parse(req.body);
      const resume = await storage.createResume(validated);
      res.status(201).json(resume);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/resumes/:id/visibility", async (req, res) => {
    try {
      const { isVisible } = req.body;
      const resume = await storage.updateResumeVisibility(req.params.id, isVisible);
      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      await storage.deleteResume(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Site Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      const settingsMap: Record<string, string> = {};
      settings.forEach(s => { settingsMap[s.key] = s.value; });
      res.json(settingsMap);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSiteSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key || !value) {
        return res.status(400).json({ message: "Key and value are required" });
      }
      const setting = await storage.upsertSiteSetting(key, value);
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
