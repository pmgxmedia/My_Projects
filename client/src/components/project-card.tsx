import { Project } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUpRight, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    live: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    demo: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    concept: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link href={`/p/${project.handleId}`}>
        <a className="block h-full">
          <Card className="h-full bg-card border-white/5 overflow-hidden group hover:border-primary/50 transition-colors flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 opacity-60" />
              <img 
                src={project.previewImage} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-20">
                <Badge variant="outline" className="bg-background/80 backdrop-blur text-xs font-mono border-white/10 text-foreground/80">
                  {project.industry}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <Badge variant="outline" className={`uppercase text-[10px] tracking-wider font-bold ${statusColors[project.status]}`}>
                  {project.status}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-muted-foreground/60">{project.id}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {project.views.toLocaleString()}
                </div>
              </div>
              <h3 className="font-display font-bold text-xl group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.tagline}
              </p>
            </CardHeader>
            
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2 mt-4">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/10">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-0 border-t border-white/5 p-4 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <BarChart3 className="h-3 w-3 text-primary" />
                Score: {project.engagementScore}
              </div>
              <Button size="sm" variant="ghost" className="h-8 text-primary hover:text-primary hover:bg-primary/10 p-0 hover:bg-transparent">
                View Asset <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </a>
      </Link>
    </motion.div>
  );
}
