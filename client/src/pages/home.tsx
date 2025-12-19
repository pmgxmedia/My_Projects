import { Layout } from "@/components/layout";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { ActivityFeed } from "@/components/activity-feed";
import { activities } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/lib/api";

export default function Home() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <Layout>
      <Hero />
      
      {/* Featured Projects Grid */}
      <section className="py-24 relative">
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
                <div className="text-4xl font-bold font-display text-primary">45k+</div>
                <div className="text-sm text-muted-foreground">Total Lines of Code<br/>Verified & Production Ready</div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                <div className="text-4xl font-bold font-display text-secondary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime Across<br/>All Deployed Systems</div>
              </div>
            </div>
          </div>
          <div>
            <ActivityFeed activities={activities} />
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
             {/* Reusing hero buttons styles */}
             <button className="h-14 px-8 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
               Start a Conversation
             </button>
             <button className="h-14 px-8 rounded border border-white/10 hover:bg-white/5 transition-colors font-medium">
               View Documentation
             </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
