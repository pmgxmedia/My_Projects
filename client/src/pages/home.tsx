import { useState } from "react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { ActivityFeed } from "@/components/activity-feed";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Globe, Send, CheckCircle, BookOpen, FileCode, Shield, Zap, Database, GitBranch } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchProjects, createEnquiry, fetchSiteSettings, fetchPlatformStats } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [conversationDialogOpen, setConversationDialogOpen] = useState(false);
  const [documentationDialogOpen, setDocumentationDialogOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: siteSettings = {} } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
  });

  const { data: platformStats } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: fetchPlatformStats,
    refetchInterval: 30000,
  });

  const requestMutation = useMutation({
    mutationFn: createEnquiry,
    onSuccess: () => {
      setRequestSubmitted(true);
      setTimeout(() => {
        setConversationDialogOpen(false);
        setRequestSubmitted(false);
      }, 2000);
    },
  });

  const handleConversationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const company = formData.get("company") as string;
    const budget = formData.get("budget") as string;
    const message = formData.get("message") as string;
    const fullMessage = `${company ? `Company: ${company}\n` : ''}${budget ? `Budget: ${budget}\n\n` : ''}${message}`;
    
    requestMutation.mutate({
      projectId: null,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      type: "custom" as const,
      message: fullMessage,
    });
  };

  const documentationSections = [
    {
      id: "overview",
      title: "Overview",
      content: [
        { title: "Platform Purpose", description: "PMGXmedia is a professional portfolio platform showcasing software projects as verified digital assets with real-time analytics." },
        { title: "Core Features", description: "Project lifecycle management, code file uploads, live demo embedding, resume management, and interactive hire/contact functionality." },
        { title: "Technology Stack", description: "React, TypeScript, Node.js, Express, PostgreSQL, Drizzle ORM, Tailwind CSS, and Framer Motion." },
      ]
    },
    {
      id: "api",
      title: "API Reference",
      content: [
        { title: "GET /api/projects", description: "Retrieve all visible projects with analytics data including views, enquiries, and engagement scores." },
        { title: "GET /api/projects/:handleId", description: "Get a specific project by its unique handle identifier with full details." },
        { title: "POST /api/enquiries", description: "Submit a new enquiry with name, email, type, and message fields." },
        { title: "POST /api/feedback", description: "Submit project feedback with efficiency, clarity, and innovation ratings." },
        { title: "GET /api/analytics/global", description: "Retrieve platform-wide analytics including total views and active visitors." },
      ]
    },
    {
      id: "architecture",
      title: "Architecture",
      content: [
        { title: "Frontend", description: "React SPA with wouter routing, TanStack Query for data fetching, and shadcn/ui components." },
        { title: "Backend", description: "Express.js server with RESTful API endpoints, session management, and file upload handling." },
        { title: "Database", description: "PostgreSQL with Drizzle ORM for type-safe queries and migrations." },
        { title: "Storage", description: "Object storage integration for project files, preview images, and resume documents." },
      ]
    },
    {
      id: "deployment",
      title: "Deployment",
      content: [
        { title: "Environment", description: "Deployed on Replit with automatic HTTPS, custom domain support, and health monitoring." },
        { title: "Database", description: "PostgreSQL database with automatic backups and rollback capabilities." },
        { title: "CI/CD", description: "Automatic deployments on push with build verification and preview environments." },
      ]
    },
  ];

  return (
    <Layout>
      <Hero 
        heroTitle={siteSettings.heroTitle} 
        heroSubtitle={siteSettings.heroSubtitle}
        announcementText={siteSettings.announcementText}
      />
      
      {/* Featured Projects Grid */}
      <section id="projects-section" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Featured Systems
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Select a project to view its full architectural breakdown, live metrics, and deployment history.
              </p>
            </div>
            
            {/* Live Activity Feed Sidebar on Desktop */}
            <div className="hidden lg:block w-96 absolute right-4 top-0 z-20 translate-y-12">
               {/* Positioned via absolute for layout interest, or can be grid */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <p className="text-muted-foreground col-span-3 text-center py-12">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-muted-foreground col-span-3 text-center py-12">No projects available yet.</p>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Process / How It Works */}
      <section className="py-24 bg-card/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold">1. Identify Problem</h3>
              <p className="text-muted-foreground leading-relaxed">
                I analyze business bottlenecks and user friction points to define clear technical requirements before writing a single line of code.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold">2. Architect Solution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Building scalable, secure systems using modern stacks. Every component is designed for performance and maintainability.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold">3. Deliver Impact</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deploying production-ready assets that are measurable. I track engagement and performance to ensure ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Feed Mobile/Tablet Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">
              Not a Portfolio. <br/>
              <span className="text-muted-foreground">A Performance Platform.</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                <div className="text-4xl font-bold font-display text-primary">
                  {platformStats?.totalViews?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Total Project Views<br/>Across All Assets</div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                <div className="text-4xl font-bold font-display text-secondary">
                  {platformStats?.totalProjects || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Live Projects<br/>Production Ready</div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                <div className="text-4xl font-bold font-display text-emerald-500">
                  {platformStats?.totalEnquiries || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Client Enquiries<br/>Active Conversations</div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                <div className="text-4xl font-bold font-display text-purple-400">
                  {platformStats?.avgEngagement || "0"}/100
                </div>
                <div className="text-sm text-muted-foreground">Avg Engagement<br/>Platform Score</div>
              </div>
            </div>
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-background to-card/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Build With Confidence</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Explore proven systems or commission a custom solution designed for your specific business needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button 
               className="h-14 px-8 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
               onClick={() => setConversationDialogOpen(true)}
               data-testid="button-start-conversation"
             >
               Start a Conversation
             </button>
             <button 
               className="h-14 px-8 rounded border border-white/10 hover:bg-white/5 transition-colors font-medium"
               onClick={() => setDocumentationDialogOpen(true)}
               data-testid="button-view-documentation"
             >
               View Documentation
             </button>
          </div>
        </div>
      </section>

      {/* Start a Conversation Dialog */}
      <Dialog open={conversationDialogOpen} onOpenChange={(open) => { setConversationDialogOpen(open); if (!open) setRequestSubmitted(false); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Send className="h-6 w-6 text-primary" />
              Start a Conversation
            </DialogTitle>
            <DialogDescription>
              Tell me about your project idea and I'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          {requestSubmitted ? (
            <div className="py-12 text-center">
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">Thank you for reaching out. I'll respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleConversationSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="conv-name">Your Name *</Label>
                  <Input id="conv-name" name="name" placeholder="John Doe" required data-testid="input-conv-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conv-email">Email *</Label>
                  <Input id="conv-email" name="email" type="email" placeholder="john@company.com" required data-testid="input-conv-email" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="conv-company">Company</Label>
                  <Input id="conv-company" name="company" placeholder="Acme Inc." data-testid="input-conv-company" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conv-budget">Budget Range</Label>
                  <Select name="budget">
                    <SelectTrigger data-testid="select-conv-budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5k">Under $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-plus">$100,000+</SelectItem>
                      <SelectItem value="not-sure">Not sure yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conv-message">What would you like to discuss? *</Label>
                <Textarea 
                  id="conv-message" 
                  name="message" 
                  placeholder="Describe your project, goals, timeline, and any specific requirements..."
                  rows={4}
                  required
                  data-testid="input-conv-message"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setConversationDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={requestMutation.isPending} data-testid="button-submit-conversation">
                  {requestMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Documentation Dialog */}
      <Dialog open={documentationDialogOpen} onOpenChange={setDocumentationDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-primary" />
              Platform Documentation
            </DialogTitle>
            <DialogDescription>
              Technical documentation and API reference for PMGXmedia platform.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <FileCode className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                API
              </TabsTrigger>
              <TabsTrigger value="architecture" className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                Architecture
              </TabsTrigger>
              <TabsTrigger value="deployment" className="flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                Deployment
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto mt-4">
              {documentationSections.map((section) => (
                <TabsContent key={section.id} value={section.id} className="space-y-4 m-0">
                  {section.content.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg bg-card border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{section.title}</Badge>
                        <h4 className="font-semibold">{item.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </TabsContent>
              ))}
            </div>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDocumentationDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
