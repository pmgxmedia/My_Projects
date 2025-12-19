export const projects: Project[] = [
  {
    id: "ts-webapp-2025-8F4K",
    handle: "/p/ts-webapp-2025-8F4K",
    title: "FinTech Dashboard Suite",
    tagline: "Real-time financial data visualization and analytics platform.",
    industry: "FinTech",
    status: "live",
    views: 12543,
    enquiries: 48,
    engagementScore: 92,
    avgSession: "4m 12s",
    description: "A comprehensive dashboard for monitoring financial assets, executing trades, and analyzing market trends in real-time. Built with performance and security at the core.",
    technologies: ["React", "TypeScript", "D3.js", "WebSockets", "Node.js"],
    impact: [
      "Reduced data latency by 40%",
      "Increased user engagement by 25%",
      "Processed $5M+ in mock transactions"
    ],
    previewImage: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=2000"
  },
  {
    id: "ai-crm-2024-9X2L",
    handle: "/p/ai-crm-2024-9X2L",
    title: "AI-Powered CRM Core",
    tagline: "Predictive customer relationship management system.",
    industry: "SaaS",
    status: "demo",
    views: 8902,
    enquiries: 32,
    engagementScore: 88,
    avgSession: "3m 45s",
    description: "An intelligent CRM that leverages machine learning to predict customer churn and suggest next-best actions for sales teams.",
    technologies: ["Next.js", "Python", "TensorFlow", "PostgreSQL"],
    impact: [
      "Predicted churn with 85% accuracy",
      "Automated 30% of sales follow-ups",
      "Unified customer data from 5 sources"
    ],
    previewImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
  },
  {
    id: "health-track-2025-3M7P",
    handle: "/p/health-track-2025-3M7P",
    title: "MedTrack Analytics",
    tagline: "HIPAA-compliant patient data aggregation platform.",
    industry: "HealthTech",
    status: "concept",
    views: 4500,
    enquiries: 15,
    engagementScore: 75,
    avgSession: "2m 30s",
    description: "A secure platform for healthcare providers to aggregate and analyze patient data across multiple facilities while maintaining strict compliance.",
    technologies: ["Vue.js", "Go", "gRPC", "Kubernetes"],
    impact: [
      "Designed for 99.99% uptime",
      "Encrypted data at rest and in transit",
      "Scalable to 1M+ patient records"
    ],
    previewImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000"
  },
  {
    id: "logistics-flow-2024-2B8Q",
    handle: "/p/logistics-flow-2024-2B8Q",
    title: "Global Logistics Flow",
    tagline: "Supply chain optimization and tracking system.",
    industry: "Logistics",
    status: "live",
    views: 10200,
    enquiries: 40,
    engagementScore: 90,
    avgSession: "5m 10s",
    description: "End-to-end supply chain management solution providing visibility from manufacturing to last-mile delivery.",
    technologies: ["Angular", "Java", "Spring Boot", "Kafka"],
    impact: [
      "Optimized route planning by 15%",
      "Reduced fuel costs by 10%",
      "Real-time tracking for 500+ vehicles"
    ],
    previewImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000"
  }
];

export const activities: Activity[] = [
  { id: 1, text: "Someone from London viewed FinTech Dashboard", time: "2m ago", type: "view" },
  { id: 2, text: "New enquiry on AI-Powered CRM", time: "15m ago", type: "enquiry" },
  { id: 3, text: "Visitor from New York explored MedTrack", time: "32m ago", type: "view" },
  { id: 4, text: "Project licensed: Global Logistics Flow", time: "1h ago", type: "license" },
  { id: 5, text: "Someone from Tokyo viewed FinTech Dashboard", time: "2h ago", type: "view" }
];

export interface Project {
  id: string;
  handle: string;
  title: string;
  tagline: string;
  industry: string;
  status: "live" | "demo" | "concept";
  views: number;
  enquiries: number;
  engagementScore: number;
  avgSession: string;
  description: string;
  technologies: string[];
  impact: string[];
  previewImage: string;
}

export interface Activity {
  id: number;
  text: string;
  time: string;
  type: "view" | "enquiry" | "license";
}

export interface Stat {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
    chartColor: string;
}
