import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Menu, X, Terminal, ArrowRight, FileText, Download, Mail, Linkedin, Github, Briefcase, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchResumes, createEnquiry, fetchSiteSettings, type ResumeData } from "@/lib/api";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const navLinks = [
    { href: "/", label: "Projects" },
    { href: "/solutions", label: "Solutions" },
    { href: "/about", label: "About" },
    { href: "/insights", label: "Insights" },
  ];

  const { data: resumes = [] } = useQuery({
    queryKey: ["public-resumes"],
    queryFn: fetchResumes,
  });

  const { data: siteSettings = {} } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
  });

  const visibleResume = resumes.find((r: ResumeData) => r.isVisible);

  const requestMutation = useMutation({
    mutationFn: createEnquiry,
    onSuccess: () => {
      setRequestSubmitted(true);
      setTimeout(() => {
        setRequestDialogOpen(false);
        setRequestSubmitted(false);
      }, 2000);
    },
  });

  const handleRequestSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleResumeDownload = () => {
    if (visibleResume) {
      const a = document.createElement('a');
      a.href = visibleResume.objectPath;
      a.download = visibleResume.filename;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
              {siteSettings.profileImage ? (
                <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/30 group-hover:border-primary/60 transition-colors">
                  <img 
                    src={siteSettings.profileImage} 
                    alt="PMGXmedia" 
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 bg-primary/10 rounded border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-colors">
                  <Terminal className="h-4 w-4 text-primary" />
                </div>
              )}
              <span className="font-display font-bold text-lg tracking-tight">
                PMGXmedia
              </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="hidden md:flex border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
              onClick={() => setHireDialogOpen(true)}
              data-testid="button-hire-me"
            >
              Hire Me
            </Button>
            <Button 
              variant="default" 
              className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              onClick={() => setRequestDialogOpen(true)}
              data-testid="button-request-project"
            >
              Request Project <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-16 z-40 bg-background border-t border-white/10 p-6 flex flex-col gap-6"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-auto">
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => { setMobileMenuOpen(false); setHireDialogOpen(true); }}
              >
                Hire Me
              </Button>
              <Button 
                className="w-full justify-center"
                onClick={() => { setMobileMenuOpen(false); setRequestDialogOpen(true); }}
              >
                Request Project
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hire Me Dialog */}
      <Dialog open={hireDialogOpen} onOpenChange={setHireDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Briefcase className="h-6 w-6 text-primary" />
              Let's Work Together
            </DialogTitle>
            <DialogDescription>
              Available for freelance projects, full-time opportunities, and consulting engagements.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Resume Download */}
            {visibleResume ? (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">Professional Resume</p>
                      <p className="text-sm text-muted-foreground">{visibleResume.filename}</p>
                    </div>
                  </div>
                  <Button onClick={handleResumeDownload} data-testid="button-download-resume">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-muted/50 border border-white/10 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Resume not available at this time</p>
              </div>
            )}

            {/* Contact Methods */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Connect With Me</h4>
              <div className="grid gap-3">
                <a 
                  href="mailto:contact@pmgxmedia.com" 
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-white/10 hover:border-primary/30 transition-colors"
                  data-testid="link-email"
                >
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">contact@pmgxmedia.com</p>
                  </div>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-white/10 hover:border-primary/30 transition-colors"
                  data-testid="link-linkedin"
                >
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-muted-foreground">Professional Profile</p>
                  </div>
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-white/10 hover:border-primary/30 transition-colors"
                  data-testid="link-github"
                >
                  <Github className="h-5 w-5" />
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">Code Portfolio</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHireDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setHireDialogOpen(false); setRequestDialogOpen(true); }}>
              <Send className="mr-2 h-4 w-4" />
              Send a Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Project Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={(open) => { setRequestDialogOpen(open); if (!open) setRequestSubmitted(false); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Send className="h-6 w-6 text-primary" />
              Request a Project
            </DialogTitle>
            <DialogDescription>
              Tell me about your project idea and I'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          {requestSubmitted ? (
            <div className="py-12 text-center">
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Request Sent!</h3>
              <p className="text-muted-foreground">Thank you for reaching out. I'll respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="req-name">Your Name *</Label>
                  <Input id="req-name" name="name" placeholder="John Doe" required data-testid="input-request-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-email">Email *</Label>
                  <Input id="req-email" name="email" type="email" placeholder="john@company.com" required data-testid="input-request-email" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="req-company">Company</Label>
                  <Input id="req-company" name="company" placeholder="Acme Inc." data-testid="input-request-company" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-budget">Budget Range</Label>
                  <Input id="req-budget" name="budget" placeholder="$10k - $50k" data-testid="input-request-budget" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="req-message">Project Details *</Label>
                <Textarea 
                  id="req-message" 
                  name="message" 
                  placeholder="Describe your project, goals, timeline, and any specific requirements..."
                  rows={4}
                  required
                  data-testid="input-request-message"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setRequestDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={requestMutation.isPending} data-testid="button-submit-request">
                  {requestMutation.isPending ? "Sending..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-card py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {siteSettings.profileImage ? (
                <div className="h-6 w-6 rounded-full overflow-hidden">
                  <img src={siteSettings.profileImage} alt="PMGXmedia" className="h-full w-full object-cover" />
                </div>
              ) : (
                <Terminal className="h-5 w-5 text-primary" />
              )}
              <span className="font-display font-bold text-xl">PMGXmedia</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Engineering digital solutions that prove their value. A platform for verified, measurable, and sellable software assets.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="mailto:contact@pmgxmedia.com" className="hover:text-primary transition-colors">Email</a></li>
            </ul>
          </div>
        </div>
        <div 
          className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground select-none"
          onDoubleClick={() => setShowAdmin(true)}
        >
          <div className="flex items-center gap-3">
            <p>© 2025 PMGXmedia. All rights reserved.</p>
            <AnimatePresence>
              {showAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Link href="/admin" className="inline-flex items-center px-2 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors font-mono uppercase tracking-wider text-[10px]">
                      Admin Access
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
