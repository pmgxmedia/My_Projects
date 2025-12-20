import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BarChart3, Users, MessageSquare, LogOut, Plus, Trash2, Eye, EyeOff, Play, Pencil, ExternalLink, Upload, Download, FileText, FolderCode, X, ImageIcon } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllProjects, fetchAllEnquiries, fetchGlobalAnalytics, createProject, updateProject, deleteProject, fetchResumes, createResume, updateResumeVisibility, deleteResume, fetchSiteSettings, updateSiteSetting } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import type { InsertProject } from "@shared/schema";

function generateHandleId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `proj-${Date.now().toString(36)}-${suffix}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [runningProject, setRunningProject] = useState<any>(null);
  const [uploadedProjectFile, setUploadedProjectFile] = useState<{ path: string; name: string } | null>(null);
  const [uploadedPreviewImage, setUploadedPreviewImage] = useState<{ path: string; name: string } | null>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: fetchAllProjects,
  });

  const { data: enquiries = [] } = useQuery({
    queryKey: ["enquiries"],
    queryFn: fetchAllEnquiries,
  });

  const { data: analytics } = useQuery({
    queryKey: ["analytics", "global"],
    queryFn: fetchGlobalAnalytics,
  });

  const { data: resumes = [], isLoading: resumesLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: fetchResumes,
  });

  const { data: siteSettings = {} } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
  });

  const { uploadFile, isUploading } = useUpload({
    onSuccess: async (response) => {
      toast({ title: "Upload Complete", description: "File uploaded successfully." });
    },
    onError: (error) => {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setCreateDialogOpen(false);
      setUploadedProjectFile(null);
      setUploadedPreviewImage(null);
      toast({ title: "Project Created", description: "New project has been added to the platform." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create project.", variant: "destructive" });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InsertProject> }) => updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditDialogOpen(false);
      setEditingProject(null);
      setUploadedProjectFile(null);
      setUploadedPreviewImage(null);
      toast({ title: "Project Updated", description: "Project has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update project.", variant: "destructive" });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Project Deleted", description: "Project has been removed from the platform." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
    },
  });

  const toggleProjectVisibilityMutation = useMutation({
    mutationFn: ({ id, isHidden }: { id: string; isHidden: boolean }) => updateProject(id, { isHidden }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ 
        title: variables.isHidden ? "Project Hidden" : "Project Visible", 
        description: variables.isHidden ? "Project is now hidden from public view." : "Project is now visible to the public." 
      });
    },
  });

  const createResumeMutation = useMutation({
    mutationFn: createResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({ title: "Resume Added", description: "Resume has been uploaded successfully." });
    },
  });

  const toggleResumeVisibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) => updateResumeVisibility(id, isVisible),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({ 
        title: variables.isVisible ? "Resume Visible" : "Resume Hidden", 
        description: variables.isVisible ? "Resume is now visible." : "Resume is now hidden." 
      });
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({ title: "Resume Deleted", description: "Resume has been removed." });
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => updateSiteSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Setting Updated", description: "Site setting has been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update setting.", variant: "destructive" });
    },
  });

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const response = await uploadFile(file);
    if (response) {
      updateSettingMutation.mutate({ key: "profileImage", value: response.objectPath });
    }
    e.target.value = "";
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const response = await uploadFile(file);
    if (response) {
      createResumeMutation.mutate({
        filename: file.name,
        objectPath: response.objectPath,
        fileSize: file.size,
        contentType: file.type || "application/octet-stream",
        isVisible: true,
      });
    }
    e.target.value = "";
  };

  const handleProjectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const response = await uploadFile(file);
    if (response) {
      setUploadedProjectFile({ path: response.objectPath, name: file.name });
      toast({ title: "File Uploaded", description: `${file.name} ready to attach to project.` });
    }
    e.target.value = "";
  };

  const handlePreviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const response = await uploadFile(file);
    if (response) {
      setUploadedPreviewImage({ path: response.objectPath, name: file.name });
      toast({ title: "Image Uploaded", description: `${file.name} ready to use as preview.` });
    }
    e.target.value = "";
  };

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newProject: InsertProject = {
      handleId: generateHandleId(),
      title: formData.get("title") as string,
      tagline: formData.get("tagline") as string,
      industry: formData.get("industry") as string,
      status: formData.get("status") as "live" | "demo" | "concept",
      description: formData.get("description") as string,
      technologies: (formData.get("technologies") as string).split(",").map(t => t.trim()).filter(Boolean),
      impact: (formData.get("impact") as string).split("\n").map(t => t.trim()).filter(Boolean),
      previewImage: uploadedPreviewImage?.path || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
      isHidden: false,
      projectFilesPath: uploadedProjectFile?.path || null,
      demoUrl: formData.get("demoUrl") as string || null,
    };
    
    createProjectMutation.mutate(newProject);
  };

  const handleUpdateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const updates: Partial<InsertProject> = {
      title: formData.get("title") as string,
      tagline: formData.get("tagline") as string,
      industry: formData.get("industry") as string,
      status: formData.get("status") as "live" | "demo" | "concept",
      description: formData.get("description") as string,
      technologies: (formData.get("technologies") as string).split(",").map(t => t.trim()).filter(Boolean),
      impact: (formData.get("impact") as string).split("\n").map(t => t.trim()).filter(Boolean),
      demoUrl: formData.get("demoUrl") as string || null,
    };

    if (uploadedPreviewImage) {
      updates.previewImage = uploadedPreviewImage.path;
    }

    if (uploadedProjectFile) {
      updates.projectFilesPath = uploadedProjectFile.path;
    }
    
    updateProjectMutation.mutate({ id: editingProject.id, updates });
  };

  const openEditDialog = (project: any) => {
    setEditingProject(project);
    setUploadedProjectFile(null);
    setUploadedPreviewImage(null);
    setEditDialogOpen(true);
  };

  const openRunDialog = (project: any) => {
    setRunningProject(project);
    setRunDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border-b border-white/10 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/10 rounded border border-primary/30 flex items-center justify-center text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
            <span className="font-display font-bold text-lg">PMGXmedia Admin</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" data-testid="button-exit-admin">
              <LogOut className="mr-2 h-4 w-4" /> Exit
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-projects">{projects.length}</div>
              <p className="text-xs text-muted-foreground">{projects.filter(p => !p.isHidden).length} visible</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Enquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-enquiries">{enquiries.length}</div>
              <p className="text-xs text-muted-foreground">Client requests</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Visitors</CardTitle>
              <Users className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-active-visitors">{analytics?.activeVisitors || 0}</div>
              <p className="text-xs text-muted-foreground">Last 10 minutes</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-views">{analytics?.totalProjectViews || 0}</div>
              <p className="text-xs text-muted-foreground">All projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Site Branding Section */}
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Site Branding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <Label>Profile / Logo Image</Label>
                <p className="text-sm text-muted-foreground">This image appears in the header and about sections.</p>
              </div>
              <div className="flex items-center gap-4">
                {siteSettings.profileImage ? (
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary/30">
                    <img 
                      src={siteSettings.profileImage} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-primary/50" />
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                    data-testid="input-profile-image-upload"
                  />
                  <Button variant="outline" disabled={isUploading} data-testid="button-upload-profile-image">
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : siteSettings.profileImage ? "Change Image" : "Upload Image"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Management Section */}
        <Card className="bg-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Management
            </CardTitle>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
                data-testid="input-resume-upload"
              />
              <Button className="bg-primary hover:bg-primary/90" disabled={isUploading} data-testid="button-upload-resume">
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Resume"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Filename</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumesLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Loading resumes...
                    </TableCell>
                  </TableRow>
                ) : resumes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No resumes uploaded yet. Click "Upload Resume" to add one.
                    </TableCell>
                  </TableRow>
                ) : (
                  resumes.map((resume) => (
                    <TableRow key={resume.id} className="border-white/5 hover:bg-white/5" data-testid={`row-resume-${resume.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {resume.filename}
                        </div>
                      </TableCell>
                      <TableCell>{formatFileSize(resume.fileSize)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={resume.isVisible ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}>
                          {resume.isVisible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title="View Resume"
                            onClick={() => window.open(resume.objectPath, '_blank')}
                            data-testid={`button-view-resume-${resume.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title="Download Resume"
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = resume.objectPath;
                              a.download = resume.filename;
                              a.click();
                            }}
                            data-testid={`button-download-resume-${resume.id}`}
                          >
                            <Download className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title={resume.isVisible ? "Hide Resume" : "Show Resume"}
                            onClick={() => toggleResumeVisibilityMutation.mutate({ id: resume.id, isVisible: !resume.isVisible })}
                            data-testid={`button-toggle-resume-${resume.id}`}
                          >
                            {resume.isVisible ? <EyeOff className="h-4 w-4 text-amber-500" /> : <Eye className="h-4 w-4 text-emerald-500" />}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-destructive/10" title="Delete Resume" data-testid={`button-delete-resume-${resume.id}`}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{resume.filename}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => deleteResumeMutation.mutate(resume.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Project Management Section */}
        <Card className="bg-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Project Management</CardTitle>
            <Dialog open={createDialogOpen} onOpenChange={(open) => { setCreateDialogOpen(open); if (!open) { setUploadedProjectFile(null); setUploadedPreviewImage(null); } }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-project">
                  <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>Add a new project with optional code files and demo URL.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input id="title" name="title" placeholder="FinTech Dashboard Suite" required data-testid="input-project-title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input id="industry" name="industry" placeholder="FinTech, SaaS, HealthTech..." required data-testid="input-project-industry" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" name="tagline" placeholder="Brief one-liner about the project" required data-testid="input-project-tagline" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="concept">
                      <SelectTrigger data-testid="select-project-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="demo">Demo</SelectItem>
                        <SelectItem value="concept">Concept</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Detailed description of the project..." rows={4} required data-testid="input-project-description" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                    <Input id="technologies" name="technologies" placeholder="React, TypeScript, Node.js, PostgreSQL" required data-testid="input-project-technologies" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="impact">Impact Metrics (one per line)</Label>
                    <Textarea id="impact" name="impact" placeholder="Increased efficiency by 40%&#10;Reduced costs by 25%&#10;Processed 1M+ transactions" rows={3} required data-testid="input-project-impact" />
                  </div>
                  {/* Preview Image Upload */}
                  <div className="space-y-2 p-4 border border-dashed border-white/20 rounded-lg bg-white/5">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Preview Image
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Upload an image file from your device to use as the project preview.
                    </p>
                    {uploadedPreviewImage ? (
                      <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded">
                        <ImageIcon className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm flex-1">{uploadedPreviewImage.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => setUploadedPreviewImage(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePreviewImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={isUploading}
                          data-testid="input-preview-image"
                        />
                        <Button type="button" variant="outline" className="w-full" disabled={isUploading}>
                          <Upload className="mr-2 h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload Preview Image"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Project Files Upload */}
                  <div className="space-y-2 p-4 border border-dashed border-white/20 rounded-lg bg-white/5">
                    <Label className="flex items-center gap-2">
                      <FolderCode className="h-4 w-4" />
                      Project Code Files (Optional)
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Upload a ZIP file containing your project code to attach it to this project.
                    </p>
                    {uploadedProjectFile ? (
                      <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm flex-1">{uploadedProjectFile.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => setUploadedProjectFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          ref={projectFileInputRef}
                          type="file"
                          accept=".zip,.tar,.gz,.html,.js,.css"
                          onChange={handleProjectFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={isUploading}
                          data-testid="input-project-files"
                        />
                        <Button type="button" variant="outline" className="w-full" disabled={isUploading}>
                          <Upload className="mr-2 h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload Project Files"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Demo URL */}
                  <div className="space-y-2">
                    <Label htmlFor="demoUrl" className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Demo URL (Optional)
                    </Label>
                    <Input 
                      id="demoUrl" 
                      name="demoUrl" 
                      placeholder="https://your-demo-app.replit.app" 
                      data-testid="input-project-demo-url"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a URL to an external demo or deployed application to run it within the project viewer.
                    </p>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createProjectMutation.isPending} data-testid="button-submit-project">
                      {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Project Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Demo</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Loading projects...
                    </TableCell>
                  </TableRow>
                ) : projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No projects yet. Click "Add Project" to create your first one.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id} className="border-white/5 hover:bg-white/5" data-testid={`row-project-${project.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {project.title}
                          {project.isHidden && <EyeOff className="h-3 w-3 text-muted-foreground" />}
                          {project.projectFilesPath && <span title="Has code files"><FolderCode className="h-3 w-3 text-blue-400" /></span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`
                          ${project.status === 'live' ? 'border-emerald-500/30 text-emerald-500' : ''}
                          ${project.status === 'demo' ? 'border-amber-500/30 text-amber-500' : ''}
                          ${project.status === 'concept' ? 'border-blue-500/30 text-blue-500' : ''}
                        `}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={project.isHidden ? 'border-red-500/30 text-red-400' : 'border-emerald-500/30 text-emerald-400'}>
                          {project.isHidden ? 'Hidden' : 'Visible'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {project.demoUrl ? (
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            <Play className="h-3 w-3 mr-1" /> Ready
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>{project.views?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/p/${project.handleId}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Project" data-testid={`button-view-${project.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title="Edit Project"
                            onClick={() => openEditDialog(project)}
                            data-testid={`button-edit-${project.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title={project.isHidden ? "Show Project" : "Hide Project"}
                            onClick={() => toggleProjectVisibilityMutation.mutate({ id: project.id, isHidden: !project.isHidden })}
                            data-testid={`button-toggle-visibility-${project.id}`}
                          >
                            {project.isHidden ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-amber-500" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-8 w-8 p-0 ${project.demoUrl ? '' : 'opacity-50'}`}
                            title={project.demoUrl ? "Run Demo" : "No demo configured"}
                            onClick={() => project.demoUrl && openRunDialog(project)}
                            disabled={!project.demoUrl}
                            data-testid={`button-run-${project.id}`}
                          >
                            <Play className="h-4 w-4 text-emerald-500" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-destructive/10" title="Delete Project" data-testid={`button-delete-${project.id}`}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{project.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => deleteProjectMutation.mutate(project.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Project Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) { setEditingProject(null); setUploadedProjectFile(null); } }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>Update project details including demo URL and code files.</DialogDescription>
            </DialogHeader>
            {editingProject && (
              <form onSubmit={handleUpdateProject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Project Title</Label>
                    <Input id="edit-title" name="title" defaultValue={editingProject.title} required data-testid="input-edit-title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-industry">Industry</Label>
                    <Input id="edit-industry" name="industry" defaultValue={editingProject.industry} required data-testid="input-edit-industry" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tagline">Tagline</Label>
                  <Input id="edit-tagline" name="tagline" defaultValue={editingProject.tagline} required data-testid="input-edit-tagline" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={editingProject.status}>
                    <SelectTrigger data-testid="select-edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="concept">Concept</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" name="description" defaultValue={editingProject.description} rows={4} required data-testid="input-edit-description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-technologies">Technologies (comma-separated)</Label>
                  <Input id="edit-technologies" name="technologies" defaultValue={editingProject.technologies?.join(", ")} required data-testid="input-edit-technologies" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-impact">Impact Metrics (one per line)</Label>
                  <Textarea id="edit-impact" name="impact" defaultValue={editingProject.impact?.join("\n")} rows={3} required data-testid="input-edit-impact" />
                </div>
                {/* Preview Image Upload */}
                <div className="space-y-2 p-4 border border-dashed border-white/20 rounded-lg bg-white/5">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Preview Image
                  </Label>
                  {editingProject.previewImage && !uploadedPreviewImage && (
                    <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded mb-2">
                      <ImageIcon className="h-4 w-4 text-blue-400" />
                      <span className="text-sm flex-1 truncate">Current: {editingProject.previewImage.split('/').pop()}</span>
                    </div>
                  )}
                  {uploadedPreviewImage ? (
                    <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded">
                      <ImageIcon className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm flex-1">{uploadedPreviewImage.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => setUploadedPreviewImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePreviewImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <Button type="button" variant="outline" className="w-full" disabled={isUploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload New Preview Image"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Project Files Upload */}
                <div className="space-y-2 p-4 border border-dashed border-white/20 rounded-lg bg-white/5">
                  <Label className="flex items-center gap-2">
                    <FolderCode className="h-4 w-4" />
                    Project Code Files
                  </Label>
                  {editingProject.projectFilesPath && !uploadedProjectFile && (
                    <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded mb-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="text-sm flex-1">Existing file attached</span>
                    </div>
                  )}
                  {uploadedProjectFile ? (
                    <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded">
                      <FileText className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm flex-1">{uploadedProjectFile.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => setUploadedProjectFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".zip,.tar,.gz,.html,.js,.css"
                        onChange={handleProjectFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <Button type="button" variant="outline" className="w-full" disabled={isUploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload New Project Files"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Demo URL */}
                <div className="space-y-2">
                  <Label htmlFor="edit-demoUrl" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Demo URL
                  </Label>
                  <Input 
                    id="edit-demoUrl" 
                    name="demoUrl" 
                    defaultValue={editingProject.demoUrl || ""}
                    placeholder="https://your-demo-app.replit.app" 
                    data-testid="input-edit-demo-url"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={updateProjectMutation.isPending} data-testid="button-save-edit">
                    {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Run Demo Dialog */}
        <Dialog open={runDialogOpen} onOpenChange={setRunDialogOpen}>
          <DialogContent className="max-w-5xl h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-emerald-500" />
                Running: {runningProject?.title}
              </DialogTitle>
              <DialogDescription>
                Live demo of the project application.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 h-full min-h-[500px] bg-black/20 rounded-lg overflow-hidden">
              {runningProject?.demoUrl && (
                <iframe 
                  src={runningProject.demoUrl}
                  className="w-full h-full border-0"
                  title={`${runningProject.title} Demo`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => window.open(runningProject?.demoUrl, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
              <Button onClick={() => setRunDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
