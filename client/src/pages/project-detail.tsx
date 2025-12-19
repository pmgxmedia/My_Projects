import { Layout } from "@/components/layout";
import { useRoute } from "wouter";
import { StatsPanel } from "@/components/stats-panel";
import { EnquiryForm } from "@/components/enquiry-form";
import { FeedbackSection } from "@/components/feedback-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Shield, Server, Layers, Play, Maximize2, Download, FileCode, X } from "lucide-react";
import { Link } from "wouter";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectByHandle, trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ProjectDetail() {
  const [match, params] = useRoute("/p/:id");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("demo");
  
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

  // Set initial tab based on available content
  useEffect(() => {
    if (project) {
      if (project.demoUrl) {
        setActiveTab("demo");
      } else if (project.projectFilesPath) {
        setActiveTab("files");
      } else {
        setActiveTab("story");
      }
    }
  }, [project]);

  if (!match) return <NotFound />;
  if (isLoading) return <Layout><div className="py-24 text-center text-muted-foreground">Loading project...</div></Layout>;
  if (!project) return <NotFound />;

  const hasDemoContent = project.demoUrl || project.projectFilesPath;

  return (
    <Layout>
      {/* Project Header */}
      <div className="bg-card border-b border-white/5 pt-12 pb-8">
        <div className="container mx-auto px-4">
          <Link href="/">
            <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors" data-testid="link-back">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
            </a>
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="font-mono text-xs border-white/10 bg-white/5">
                  {project.handleId}
                </Badge>
                <Badge className={`uppercase text-[10px] tracking-wider font-bold ${project.status === 'live' ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' : project.status === 'demo' ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'}`}>
                  {project.status}
                </Badge>
                {project.demoUrl && (
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30 uppercase text-[10px] tracking-wider font-bold">
                    <Play className="h-3 w-3 mr-1" /> Live Demo
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4" data-testid="text-project-title">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                {project.tagline}
              </p>
            </div>
            
            <div className="flex gap-4">
              {project.demoUrl && (
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => window.open(project.demoUrl, '_blank')}
                  data-testid="button-live-demo"
                >
                  Open Demo <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
              {project.projectFilesPath && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = project.projectFilesPath!;
                    a.download = 'project-files';
                    a.click();
                  }}
                  data-testid="button-download-files"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Files
                </Button>
              )}
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
            
            {/* Live Demo / Project Preview Section */}
            {hasDemoContent ? (
              <Card className="border-white/10 bg-card shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 font-mono">
                      {project.demoUrl ? new URL(project.demoUrl).hostname : 'Project Preview'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.demoUrl && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0"
                          onClick={() => setIsFullscreen(true)}
                          data-testid="button-fullscreen"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0"
                          onClick={() => window.open(project.demoUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <CardContent className="p-0">
                  {project.demoUrl ? (
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <iframe 
                        src={project.demoUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        title={`${project.title} Demo`}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                        loading="lazy"
                        data-testid="iframe-demo"
                      />
                    </div>
                  ) : project.projectFilesPath ? (
                    <div className="p-8 text-center">
                      <FileCode className="h-16 w-16 mx-auto text-primary/50 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Project Files Available</h3>
                      <p className="text-muted-foreground mb-4">
                        Download the project files to view and run the application locally.
                      </p>
                      <Button 
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = project.projectFilesPath!;
                          a.download = 'project-files';
                          a.click();
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" /> Download Project Files
                      </Button>
                    </div>
                  ) : (
                    <img src={project.previewImage} alt={project.title} className="w-full h-auto" />
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-card shadow-2xl">
                <img src={project.previewImage} alt={project.title} className="w-full h-auto" />
              </div>
            )}

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-card border border-white/5 w-full justify-start h-12 p-1 flex-wrap">
                {project.demoUrl && (
                  <TabsTrigger value="demo" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    <Play className="h-4 w-4 mr-2" /> Live Demo
                  </TabsTrigger>
                )}
                <TabsTrigger value="story" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Executive Story</TabsTrigger>
                <TabsTrigger value="tech" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Technical Stack</TabsTrigger>
                <TabsTrigger value="impact" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Business Impact</TabsTrigger>
              </TabsList>

              {project.demoUrl && (
                <TabsContent value="demo" className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                  <Card className="border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium">Interactive Demo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsFullscreen(true)}
                        >
                          <Maximize2 className="h-4 w-4 mr-2" /> Fullscreen
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(project.demoUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" /> New Tab
                        </Button>
                      </div>
                    </div>
                    <div className="relative w-full" style={{ paddingTop: '75%' }}>
                      <iframe 
                        src={project.demoUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        title={`${project.title} Interactive Demo`}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                        loading="lazy"
                      />
                    </div>
                  </Card>
                </TabsContent>
              )}
              
              <TabsContent value="story" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-display font-semibold text-foreground">The Challenge</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {project.description}
                  </p>
                  
                  <h3 className="text-2xl font-display font-semibold text-foreground mt-8">The Solution</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    We architected a bespoke solution using modern development practices and industry-leading technologies. 
                    The implementation focuses on scalability, maintainability, and exceptional user experience to deliver 
                    measurable business value.
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
                  <dd className="font-medium">{new Date(project.createdAt).getFullYear()}</dd>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <dt className="text-muted-foreground">Engagement Score</dt>
                  <dd className="font-medium text-emerald-500">{project.engagementScore || 85}/100</dd>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <dt className="text-muted-foreground">Demo Available</dt>
                  <dd className="font-medium">{project.demoUrl ? <span className="text-emerald-500">Yes</span> : <span className="text-muted-foreground">No</span>}</dd>
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

      {/* Fullscreen Demo Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm px-4 py-3 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-white">
              <Play className="h-5 w-5 text-emerald-500" />
              {project.title} - Live Demo
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(project.demoUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" /> Open in New Tab
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsFullscreen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {project.demoUrl && (
            <iframe 
              src={project.demoUrl}
              className="w-full h-full border-0 pt-14"
              title={`${project.title} Fullscreen Demo`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
