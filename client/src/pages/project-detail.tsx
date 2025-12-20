import { Layout } from "@/components/layout";
import { useRoute } from "wouter";
import { StatsPanel } from "@/components/stats-panel";
import { EnquiryForm } from "@/components/enquiry-form";
import { FeedbackSection } from "@/components/feedback-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Shield, Server, Layers, Play, Maximize2, Download, FileCode, X, Video, Eye, Users, TrendingUp, Star, CheckCircle, Clock, Zap, Target, Award } from "lucide-react";
import { Link } from "wouter";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectByHandle, trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`;
  }
  return null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }
  return null;
}

function getEmbedUrl(url: string): string {
  const youtubeUrl = getYouTubeEmbedUrl(url);
  if (youtubeUrl) return youtubeUrl;
  const vimeoUrl = getVimeoEmbedUrl(url);
  if (vimeoUrl) return vimeoUrl;
  return url;
}

export default function ProjectDetail() {
  const [match, params] = useRoute("/p/:id");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("demo");
  const [showStats, setShowStats] = useState(false);
  
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
      if (project.videoUrl) {
        setActiveTab("video");
      } else if (project.demoUrl) {
        setActiveTab("demo");
      } else {
        setActiveTab("story");
      }
    }
  }, [project]);

  if (!match) return <NotFound />;
  if (isLoading) return <Layout><div className="py-24 text-center text-muted-foreground">Loading project...</div></Layout>;
  if (!project) return <NotFound />;

  const hasDemoContent = project.demoUrl || project.projectFilesPath || project.videoUrl;
  const hasVideo = !!project.videoUrl;

  return (
    <Layout>
      {/* Project Header */}
      <div className="bg-card border-b border-white/5 pt-12 pb-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors" data-testid="link-back">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
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
                {project.videoUrl && (
                  <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 uppercase text-[10px] tracking-wider font-bold">
                    <Video className="h-3 w-3 mr-1" /> Video
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
            
            <div className="flex gap-4 flex-wrap">
              {project.videoUrl && (
                <Button 
                  size="lg" 
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => window.open(project.videoUrl!, '_blank')}
                  data-testid="button-watch-video"
                >
                  <Video className="mr-2 h-4 w-4" /> Watch Video
                </Button>
              )}
              {project.demoUrl && (
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => window.open(project.demoUrl!, '_blank')}
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

      {/* Live Stats Toggle Button */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4">
          <Collapsible open={showStats} onOpenChange={setShowStats}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full py-3 flex items-center justify-center gap-2 hover:bg-white/5"
                data-testid="button-toggle-stats"
              >
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Live Analytics</span>
                {showStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pb-4 animate-in slide-in-from-top-2">
              <StatsPanel projectId={project.id} />
            </CollapsibleContent>
          </Collapsible>
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
                      {project.videoUrl ? 'Project Video' : project.demoUrl ? new URL(project.demoUrl!).hostname : 'Project Preview'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.videoUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => window.open(project.videoUrl!, '_blank')}
                        title="Open video in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    {project.demoUrl && !project.videoUrl && (
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
                          onClick={() => window.open(project.demoUrl!, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <CardContent className="p-0">
                  {project.videoUrl ? (
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <iframe 
                        src={getEmbedUrl(project.videoUrl)}
                        className="absolute inset-0 w-full h-full border-0"
                        title={`${project.title} Video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        data-testid="iframe-video"
                      />
                    </div>
                  ) : project.demoUrl ? (
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
                <TabsTrigger value="video" className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400">
                  <Video className="h-4 w-4 mr-2" /> Video
                </TabsTrigger>
                {project.demoUrl && (
                  <TabsTrigger value="demo" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    <Play className="h-4 w-4 mr-2" /> Live Demo
                  </TabsTrigger>
                )}
                <TabsTrigger value="story" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Executive Story</TabsTrigger>
                <TabsTrigger value="tech" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Technical Stack</TabsTrigger>
                <TabsTrigger value="impact" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Business Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {project.videoUrl ? (
                      <>
                        <Card className="border-purple-500/20 overflow-hidden shadow-2xl shadow-purple-500/10">
                          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-500/10 to-transparent border-b border-purple-500/20">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-purple-400" />
                              <span className="text-sm font-medium text-purple-300">Project Walkthrough</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                                onClick={() => window.open(project.videoUrl!, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" /> Open in New Tab
                              </Button>
                            </div>
                          </div>
                          <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
                            <iframe 
                              src={getEmbedUrl(project.videoUrl)}
                              className="absolute inset-0 w-full h-full border-0"
                              title={`${project.title} Video`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                          <div className="px-4 py-3 bg-gradient-to-r from-purple-500/5 to-transparent border-t border-purple-500/10">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Use video player controls for playback</span>
                              <div className="flex items-center gap-4 text-purple-300">
                                <span className="flex items-center gap-1">
                                  <Play className="h-3 w-3" /> Play/Pause
                                </span>
                                <span className="flex items-center gap-1">
                                  <Maximize2 className="h-3 w-3" /> Fullscreen
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                        
                        <div className="mt-6 grid md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-card border border-white/10 flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                              <Eye className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Full Demonstration</h4>
                              <p className="text-xs text-muted-foreground mt-1">See the complete project in action</p>
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-card border border-white/10 flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                              <Target className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Key Features</h4>
                              <p className="text-xs text-muted-foreground mt-1">Walkthrough of core functionality</p>
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-card border border-white/10 flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                              <Zap className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Technical Insights</h4>
                              <p className="text-xs text-muted-foreground mt-1">Behind-the-scenes implementation</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Card className="border-purple-500/20 overflow-hidden">
                        <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-gradient-to-br from-purple-500/5 to-transparent">
                          <div className="h-20 w-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                            <Video className="h-10 w-10 text-purple-400" />
                          </div>
                          <h3 className="text-xl font-display font-semibold text-purple-300 mb-2">Video Coming Soon</h3>
                          <p className="text-muted-foreground max-w-md mb-6">
                            A detailed video walkthrough of this project is being prepared. Check back soon for a full demonstration of features and implementation details.
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-purple-400" /> Full Demo
                            </span>
                            <span className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-purple-400" /> Feature Walkthrough
                            </span>
                            <span className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-purple-400" /> Technical Deep Dive
                            </span>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>

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
                          onClick={() => window.open(project.demoUrl!, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" /> New Tab
                        </Button>
                      </div>
                    </div>
                    <div className="relative w-full" style={{ paddingTop: '75%' }}>
                      <iframe 
                        src={project.demoUrl!}
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
                  <dd className="font-medium text-emerald-500">85/100</dd>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <dt className="text-muted-foreground">Demo Available</dt>
                  <dd className="font-medium">{project.demoUrl ? <span className="text-emerald-500">Yes</span> : <span className="text-muted-foreground">No</span>}</dd>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <dt className="text-muted-foreground">Video Walkthrough</dt>
                  <dd className="font-medium">{project.videoUrl ? <span className="text-purple-400">Available</span> : <span className="text-muted-foreground">No</span>}</dd>
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
                onClick={() => project.demoUrl && window.open(project.demoUrl, '_blank')}
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
