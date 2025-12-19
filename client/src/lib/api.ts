import type { Project, Enquiry, Feedback, InsertEnquiry, InsertFeedback, InsertProject } from "@shared/schema";

const API_BASE = "/api";

export interface EnrichedProject extends Project {
  views: number;
  enquiries: number;
  engagementScore: number;
  avgSession: string;
  handle: string;
}

export async function fetchProjects(): Promise<EnrichedProject[]> {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function fetchAllProjects(): Promise<EnrichedProject[]> {
  const res = await fetch(`${API_BASE}/projects?includeHidden=true`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(project: InsertProject): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

export async function updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete project");
}

export async function fetchProjectByHandle(handleId: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${handleId}`);
  if (!res.ok) throw new Error("Project not found");
  return res.json();
}

export async function createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry> {
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enquiry),
  });
  if (!res.ok) throw new Error("Failed to create enquiry");
  return res.json();
}

export async function createFeedback(feedback: InsertFeedback): Promise<Feedback> {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback),
  });
  if (!res.ok) throw new Error("Failed to create feedback");
  return res.json();
}

export async function trackAnalyticsEvent(event: {
  projectId?: string | null;
  eventType: string;
  sessionDuration?: number | null;
  visitorLocation?: string | null;
  metadata?: any;
}) {
  const res = await fetch(`${API_BASE}/analytics/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error("Failed to track event");
  return res.json();
}

export async function fetchGlobalAnalytics() {
  const res = await fetch(`${API_BASE}/analytics/global`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function fetchAllEnquiries(): Promise<Enquiry[]> {
  const res = await fetch(`${API_BASE}/enquiries`);
  if (!res.ok) throw new Error("Failed to fetch enquiries");
  return res.json();
}
