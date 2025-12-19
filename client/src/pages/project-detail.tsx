import { Layout } from "@/components/layout";
import { useRoute } from "wouter";
import { StatsPanel } from "@/components/stats-panel";
import { EnquiryForm } from "@/components/enquiry-form";
import { FeedbackSection } from "@/components/feedback-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ExternalLink, Shield, Server, Layers } from "lucide-react";
import { Link } from "wouter";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectByHandle, trackAnalyticsEvent } from "@/lib/api";
import { useEffect } from "react";

export default function ProjectDetail() {
  const [match, params] = useRoute("/p/:id");
  
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", params?.id],
    queryFn: () => fetchProjectByHandle(params?.id || ""),
    enabled: !!params?.id,
  });

  // Track page view
  useEffect(() => {
    if (project) {
      trackAnalyticsEvent({
        projectId: project.id,
        eventType: "view",
        visitorLocation: "Unknown",
        metadata: { sessionId: Math.random().toString(36) },
      });
    }
  }, [project]);

  if (!match) return <NotFound />;
  if (isLoading) return <Layout><div className="py-24 text-center text-muted-foreground">Loading project...</div></Layout>;
  if (!project) return <NotFound />;

  return (
    <Layout>
      {/* Project Header */}
      <div className="bg-card border-b border-white/5 pt-12 pb-8">
        <div className="container mx-auto px-4">
          <Link href="/">
            <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
            </a>
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="font-mono text-xs border-white/10 bg-white/5">
                  {project.id}
                </Badge>
                <Badge className={`uppercase text-[10px] tracking-wider font-bold ${project.status === 'live' ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' : 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'}`}>
                  {project.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                {project.tagline}
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Live Demo <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats Bar - Sticky */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 py-6">
        <div className="container mx-auto px-4">
          <StatsPanel />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Project Preview */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-card shadow-2xl">
              <img src={project.previewImage} alt={project.title} className="w-full h-auto" />
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="bg-card border border-white/5 w-full justify-start h-12 p-1">
                <TabsTrigger value="story" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Executive Story</TabsTrigger>
                <TabsTrigger value="tech" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Technical Stack</TabsTrigger>
                <TabsTrigger value="impact" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Business Impact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="story" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-display font-semibold text-foreground">The Challenge</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {project.description} In the current market, existing solutions lacked the real-time capabilities required for high-frequency decision making. The goal was to build a system that prioritizes latency without sacrificing data integrity.
                  </p>
                  
                  <h3 className="text-2xl font-display font-semibold text-foreground mt-8">The Solution</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    We architected a bespoke solution using a microservices pattern. By decoupling the ingestion layer from the presentation layer, we achieved sub-millisecond updates while maintaining a clean, responsive UI for the end-user.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="tech" className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.technologies.map((tech: string) => (
                    <div key={tech} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5 hover:border-primary/30 transition-colors">
                      <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Server className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-lg">{tech}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                     <div className="h-10 w-10 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Shield className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-lg">Enterprise Security</span>
                  </div>
                   <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                     <div className="h-10 w-10 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Layers className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-lg">Scalable Architecture</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="impact" className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-4">
                  {project.impact.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-6 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <div className="mt-1 h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <EnquiryForm projectId={project.id} />
            <FeedbackSection projectId={project.id} />
            
            <div className="bg-card border border-white/5 rounded-lg p-6">
              <h3 className="font-display font-bold text-lg mb-4">Project Metadata</h3>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <dt className="text-muted-foreground">Client Industry</dt>
                  <dd className="font-medium">{project.industry}</dd>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <dt className="text-muted-foreground">Delivery Year</dt>
                  <dd className="font-medium">2025</dd>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <dt className="text-muted-foreground">Engagement Score</dt>
                  <dd className="font-medium text-emerald-500">{project.engagementScore}/100</dd>
                </div>
                <div className="flex justify-between pt-2">
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd className="font-medium text-primary">Open for Licensing</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
