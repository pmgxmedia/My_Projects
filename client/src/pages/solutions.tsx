import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Code2, 
  Smartphone, 
  Globe, 
  Database, 
  Cloud, 
  Shield, 
  Zap, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const solutions = [
  {
    icon: Globe,
    title: "Web Applications",
    description: "Full-stack web applications built with modern frameworks like React, Next.js, and Node.js. From SaaS platforms to enterprise dashboards.",
    features: ["Responsive Design", "API Integration", "Real-time Features", "SEO Optimized"],
    color: "text-blue-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Cross-platform mobile applications using React Native and Flutter. Native performance with shared codebase efficiency.",
    features: ["iOS & Android", "Offline Support", "Push Notifications", "App Store Ready"],
    color: "text-emerald-500",
  },
  {
    icon: Database,
    title: "Data Solutions",
    description: "Database design, analytics dashboards, and data pipeline engineering. Transform raw data into actionable insights.",
    features: ["PostgreSQL", "Data Visualization", "ETL Pipelines", "Real-time Analytics"],
    color: "text-purple-500",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Scalable cloud architecture on AWS, GCP, or Azure. Deployment automation and DevOps best practices.",
    features: ["Auto-scaling", "CI/CD Pipelines", "Monitoring", "Cost Optimization"],
    color: "text-orange-500",
  },
  {
    icon: Shield,
    title: "Security & Auth",
    description: "Secure authentication systems, OAuth integration, and security auditing. Protect your users and data.",
    features: ["OAuth 2.0", "JWT Tokens", "2FA/MFA", "Security Audits"],
    color: "text-red-500",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Speed up existing applications. Code refactoring, caching strategies, and infrastructure tuning.",
    features: ["Load Testing", "Caching", "CDN Setup", "Code Profiling"],
    color: "text-yellow-500",
  },
];

const process = [
  { step: 1, title: "Discovery", description: "Understanding your business goals, technical requirements, and constraints." },
  { step: 2, title: "Planning", description: "Architecture design, timeline estimation, and milestone definition." },
  { step: 3, title: "Development", description: "Iterative development with regular demos and feedback cycles." },
  { step: 4, title: "Delivery", description: "Deployment, documentation, and knowledge transfer." },
];

export default function Solutions() {
  return (
    <Layout>
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              What I Build
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="text-solutions-title">
              Solutions That Drive Results
            </h1>
            <p className="text-lg text-muted-foreground">
              From concept to deployment, I deliver software solutions that solve real business problems 
              with measurable impact and maintainable code.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 border-white/10 hover:border-primary/30 transition-colors" data-testid={`card-solution-${index}`}>
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${solution.color}`}>
                      <solution.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{solution.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {solution.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl font-bold mb-4">How I Work</h2>
            <p className="text-muted-foreground">
              A proven process that ensures transparent communication, predictable timelines, and quality deliverables.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                    <span className="font-display text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Build Something Great?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Let's discuss your project requirements and explore how we can work together.
          </p>
          <Button size="lg" className="font-medium" data-testid="button-solutions-cta">
            Start a Conversation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </Layout>
  );
}
