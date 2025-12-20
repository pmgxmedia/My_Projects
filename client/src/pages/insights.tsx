import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Code2,
  Zap,
  Shield,
  Database
} from "lucide-react";

const insights = [
  {
    id: 1,
    title: "Building Scalable React Applications in 2025",
    excerpt: "Best practices for structuring large React codebases, managing state effectively, and optimizing performance for enterprise applications.",
    category: "Frontend",
    readTime: "8 min read",
    date: "Dec 2024",
    icon: Code2,
    featured: true,
  },
  {
    id: 2,
    title: "The Art of Database Design",
    excerpt: "How to design database schemas that scale gracefully, maintain data integrity, and support complex querying patterns.",
    category: "Backend",
    readTime: "12 min read",
    date: "Nov 2024",
    icon: Database,
  },
  {
    id: 3,
    title: "Security Best Practices for Modern Web Apps",
    excerpt: "Essential security measures every developer should implement, from authentication to data encryption and beyond.",
    category: "Security",
    readTime: "10 min read",
    date: "Oct 2024",
    icon: Shield,
  },
  {
    id: 4,
    title: "Performance Optimization Strategies",
    excerpt: "Techniques for identifying and eliminating performance bottlenecks in web applications, from frontend to database.",
    category: "Performance",
    readTime: "7 min read",
    date: "Sep 2024",
    icon: Zap,
  },
  {
    id: 5,
    title: "From Idea to MVP: A Practical Guide",
    excerpt: "A step-by-step approach to building minimum viable products that validate business ideas without over-engineering.",
    category: "Strategy",
    readTime: "15 min read",
    date: "Aug 2024",
    icon: Lightbulb,
  },
  {
    id: 6,
    title: "Measuring What Matters in Software",
    excerpt: "How to define and track meaningful metrics that demonstrate the real impact of your software projects.",
    category: "Analytics",
    readTime: "6 min read",
    date: "Jul 2024",
    icon: TrendingUp,
  },
];

const categories = ["All", "Frontend", "Backend", "Security", "Performance", "Strategy", "Analytics"];

export default function Insights() {
  const featuredInsight = insights.find(i => i.featured);
  const regularInsights = insights.filter(i => !i.featured);

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
              <BookOpen className="mr-1 h-3 w-3" />
              Technical Insights
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="text-insights-title">
              Thoughts on Building Better Software
            </h1>
            <p className="text-lg text-muted-foreground">
              Lessons learned, best practices, and insights from years of building software products. 
              Practical knowledge you can apply to your own projects.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                data-testid={`button-category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>

          {featuredInsight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 overflow-hidden" data-testid="card-featured-insight">
                <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
                  <div className="flex flex-col justify-center">
                    <Badge className="w-fit mb-4 bg-primary/20 text-primary border-0">
                      Featured
                    </Badge>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                      {featuredInsight.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {featuredInsight.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredInsight.readTime}
                      </span>
                      <span>{featuredInsight.date}</span>
                      <Badge variant="outline">{featuredInsight.category}</Badge>
                    </div>
                    <Button className="w-fit">
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="h-48 w-48 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <featuredInsight.icon className="h-24 w-24 text-primary/50" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 border-white/10 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer group" data-testid={`card-insight-${insight.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <insight.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {insight.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {insight.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {insight.readTime}
                      </span>
                      <span>{insight.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <Lightbulb className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold mb-4">Want to Learn More?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            These insights are based on real project experiences. If you'd like to discuss any of these topics 
            or see how they could apply to your project, let's connect.
          </p>
          <Button size="lg" data-testid="button-insights-cta">
            Start a Conversation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </Layout>
  );
}
