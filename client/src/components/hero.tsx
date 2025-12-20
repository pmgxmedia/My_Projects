import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Megaphone, X } from "lucide-react";
import bgImage from "@assets/generated_images/dark_abstract_executive_tech_background_with_subtle_grid.png";
import { useState } from "react";
import { Link } from "wouter";

interface HeroProps {
  heroTitle?: string;
  heroSubtitle?: string;
  announcementText?: string;
}

const defaultTitle = "Your Work. Verified.";
const defaultTitleHighlight = "Measurable. Sellable.";
const defaultSubtitle = "I design, build, and deploy production-grade web and software systems. Every project here is a live digital asset with its own identity, performance metrics, and conversion flow.";

export function Hero({ heroTitle, heroSubtitle, announcementText }: HeroProps) {
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  
  const displayTitle = heroTitle || defaultTitle;
  const displaySubtitle = heroSubtitle || defaultSubtitle;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
      {/* Announcement Banner */}
      {announcementText && !announcementDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 border-b border-primary/20 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Megaphone className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm text-white/90">{announcementText}</p>
            </div>
            <button 
              onClick={() => setAnnouncementDismissed(true)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Executive Tech Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_70%)]"></div>
      </div>

      <div className="container relative z-10 px-4 py-20 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-8 uppercase tracking-wider"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          System Status: Operational
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white mb-6 leading-[1.1]"
          data-testid="text-hero-title"
        >
          {displayTitle} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">
            {heroTitle ? "" : defaultTitleHighlight}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          {displaySubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button 
            size="lg" 
            className="h-14 px-8 text-base bg-white text-black hover:bg-gray-200 border-none shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
            onClick={() => {
              const projectsSection = document.getElementById('projects-section');
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            data-testid="button-explore-projects"
          >
            Explore Live Projects
          </Button>
          <Link href="/solutions">
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 hover:bg-white/5 backdrop-blur-sm" data-testid="button-request-solution">
              Request a Solution <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/5 w-full flex flex-wrap justify-center gap-8 md:gap-16 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-secondary" />
            <span className="font-mono text-sm">Verified Deployments</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            <span className="font-mono text-sm">Real-time Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 border border-secondary rounded flex items-center justify-center text-[10px] font-bold text-secondary">ID</div>
            <span className="font-mono text-sm">Unique Project Handles</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
