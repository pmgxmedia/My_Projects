import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Terminal, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const navLinks = [
    { href: "/", label: "Projects" },
    { href: "/solutions", label: "Solutions" },
    { href: "/about", label: "About" },
    { href: "/insights", label: "Insights" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-primary/10 rounded border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-colors">
                <Terminal className="h-4 w-4 text-primary" />
              </div>
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
            <Button variant="outline" className="hidden md:flex border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
              Hire Me
            </Button>
            <Button variant="default" className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
              Request Project <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
              <Button variant="outline" className="w-full justify-center">Hire Me</Button>
              <Button className="w-full justify-center">Request Project</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-card py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="font-display font-bold text-xl">PMGXmedia</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Engineering digital solutions that prove their value. A platform for verified, measurable, and sellable software assets.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Projects</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Solutions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Methodology</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Email</a></li>
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
