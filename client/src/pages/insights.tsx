import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createEnquiry } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Clock, 
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Code2,
  Zap,
  Shield,
  Database,
  MessageCircle,
  Send
} from "lucide-react";

const insights = [
  {
    id: 1,
    title: "Building Scalable React Applications in 2025",
    excerpt: "Best practices for structuring large React codebases, managing state effectively, and optimizing performance for enterprise applications.",
    content: `Building scalable React applications requires careful consideration of architecture, state management, and performance optimization.

**Key Principles:**
- Component composition over inheritance
- Proper separation of concerns between UI and business logic
- Strategic use of React Query for server state
- Code splitting and lazy loading for performance

**State Management:**
Modern React applications benefit from a hybrid approach: local state for UI concerns, server state libraries like TanStack Query for async data, and global state only when truly needed.

**Performance Considerations:**
- Memoization with useMemo and useCallback (but don't overuse)
- Virtual scrolling for large lists
- Optimistic updates for better UX
- Bundle analysis and tree shaking`,
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
    content: `Good database design is the foundation of every successful application. Here's what I've learned building systems that scale.

**Normalization vs Denormalization:**
Start normalized, denormalize strategically. Premature optimization here causes more problems than it solves.

**Indexing Strategy:**
- Index columns used in WHERE clauses
- Composite indexes for multi-column queries
- Monitor query performance and adjust

**Data Integrity:**
- Use foreign keys and constraints
- Implement proper cascading rules
- Consider soft deletes for audit trails

**Scaling Patterns:**
- Read replicas for read-heavy workloads
- Sharding for write-heavy scenarios
- Caching layers to reduce database load`,
    category: "Backend",
    readTime: "12 min read",
    date: "Nov 2024",
    icon: Database,
  },
  {
    id: 3,
    title: "Security Best Practices for Modern Web Apps",
    excerpt: "Essential security measures every developer should implement, from authentication to data encryption and beyond.",
    content: `Security isn't optional—it's a fundamental requirement for any application handling user data.

**Authentication:**
- Use established auth providers when possible
- Implement proper session management
- Always use HTTPS in production

**Authorization:**
- Role-based access control (RBAC)
- Resource-level permissions
- Principle of least privilege

**Data Protection:**
- Encrypt sensitive data at rest
- Use parameterized queries to prevent SQL injection
- Sanitize all user inputs
- Implement proper CORS policies

**Security Headers:**
- Content Security Policy (CSP)
- X-Frame-Options
- Strict-Transport-Security`,
    category: "Security",
    readTime: "10 min read",
    date: "Oct 2024",
    icon: Shield,
  },
  {
    id: 4,
    title: "Performance Optimization Strategies",
    excerpt: "Techniques for identifying and eliminating performance bottlenecks in web applications, from frontend to database.",
    content: `Performance is a feature. Users expect fast, responsive applications.

**Measurement First:**
- Profile before optimizing
- Use Lighthouse, WebPageTest, and real user metrics
- Set performance budgets

**Frontend Optimization:**
- Minimize JavaScript bundle size
- Optimize images (WebP, lazy loading)
- Implement proper caching strategies
- Use CDNs for static assets

**Backend Optimization:**
- Database query optimization
- Connection pooling
- Response caching
- Async processing for heavy operations

**The 80/20 Rule:**
Focus on the bottlenecks that matter most. Don't optimize prematurely.`,
    category: "Performance",
    readTime: "7 min read",
    date: "Sep 2024",
    icon: Zap,
  },
  {
    id: 5,
    title: "From Idea to MVP: A Practical Guide",
    excerpt: "A step-by-step approach to building minimum viable products that validate business ideas without over-engineering.",
    content: `The goal of an MVP is learning, not perfection. Here's how to build one effectively.

**Define the Core:**
- What's the ONE thing your product must do?
- Cut everything that isn't essential
- Focus on solving one problem well

**Build Fast, Learn Faster:**
- Use existing tools and frameworks
- Avoid premature optimization
- Ship early, iterate often

**Validate Assumptions:**
- Talk to real users
- Measure engagement, not vanity metrics
- Be willing to pivot

**Technical Choices:**
- Choose boring technology
- Prioritize developer velocity
- Build for iteration, not scale (yet)`,
    category: "Strategy",
    readTime: "15 min read",
    date: "Aug 2024",
    icon: Lightbulb,
  },
  {
    id: 6,
    title: "Measuring What Matters in Software",
    excerpt: "How to define and track meaningful metrics that demonstrate the real impact of your software projects.",
    content: `Metrics help us understand impact and make better decisions. But not all metrics are created equal.

**Types of Metrics:**
- Business metrics (revenue, conversion, retention)
- Product metrics (engagement, feature adoption)
- Technical metrics (performance, reliability, velocity)

**Choosing the Right Metrics:**
- Align with business goals
- Be actionable (you can influence them)
- Be measurable (you can track them accurately)

**Avoiding Vanity Metrics:**
- Page views without context
- Total users (vs active users)
- Features shipped (vs value delivered)

**Building a Metrics Culture:**
- Make data accessible
- Review metrics regularly
- Celebrate improvements, learn from declines`,
    category: "Analytics",
    readTime: "6 min read",
    date: "Jul 2024",
    icon: TrendingUp,
  },
];

const categories = ["All", "Frontend", "Backend", "Security", "Performance", "Strategy", "Analytics"];

type Insight = typeof insights[0];

export default function Insights() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [insightDialogOpen, setInsightDialogOpen] = useState(false);
  const { toast } = useToast();

  const featuredInsight = insights.find(i => i.featured);
  const regularInsights = insights.filter(i => !i.featured);

  const openInsightDetail = (insight: Insight) => {
    setSelectedInsight(insight);
    setInsightDialogOpen(true);
  };

  const submitEnquiryMutation = useMutation({
    mutationFn: createEnquiry,
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. I'll get back to you within 24-48 hours.",
      });
      setDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const topic = formData.get("topic") as string;
    const message = formData.get("message") as string;

    submitEnquiryMutation.mutate({
      name,
      email,
      type: "custom",
      message: `[Insights Discussion: ${topic}] ${message}`,
    });
  };

  
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
                    <Button className="w-fit" onClick={() => openInsightDetail(featuredInsight)}>
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
                <Card 
                  className="h-full bg-card/50 border-white/10 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer group" 
                  data-testid={`card-insight-${insight.id}`}
                  onClick={() => openInsightDetail(insight)}
                >
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
          <Button size="lg" onClick={() => setDialogOpen(true)} data-testid="button-insights-cta">
            Start a Conversation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Contact Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Let's Discuss
            </DialogTitle>
            <DialogDescription>
              Have questions about these insights or want to discuss how they apply to your project?
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required data-testid="input-insights-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required data-testid="input-insights-email" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Topic of Interest</Label>
              <Input id="topic" name="topic" placeholder="e.g., React architecture, performance optimization..." required data-testid="input-insights-topic" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Question or Comment</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="What would you like to discuss?" 
                rows={4}
                required
                data-testid="input-insights-message"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitEnquiryMutation.isPending} data-testid="button-send-insights-message">
                {submitEnquiryMutation.isPending ? "Sending..." : (
                  <>
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Insight Detail Dialog */}
      <Dialog open={insightDialogOpen} onOpenChange={setInsightDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedInsight && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{selectedInsight.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedInsight.readTime}
                  </span>
                  <span className="text-sm text-muted-foreground">{selectedInsight.date}</span>
                </div>
                <DialogTitle className="text-2xl font-display">
                  {selectedInsight.title}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {selectedInsight.excerpt}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6 border-t border-white/10">
                <div className="prose prose-invert prose-sm max-w-none">
                  {selectedInsight.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <h3 key={idx} className="text-lg font-semibold text-primary mt-6 mb-3">
                          {paragraph.replace(/\*\*/g, '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('**')) {
                      const parts = paragraph.split('**');
                      return (
                        <div key={idx} className="mb-4">
                          <h4 className="text-base font-semibold text-white mb-2">{parts[1]}</h4>
                          <p className="text-muted-foreground whitespace-pre-line">{parts.slice(2).join('')}</p>
                        </div>
                      );
                    }
                    if (paragraph.startsWith('-')) {
                      return (
                        <ul key={idx} className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                          {paragraph.split('\n').map((item, itemIdx) => (
                            <li key={itemIdx}>{item.replace(/^-\s*/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={idx} className="text-muted-foreground mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="border-t border-white/10 pt-4">
                <Button variant="outline" onClick={() => setInsightDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => { setInsightDialogOpen(false); setDialogOpen(true); }}>
                  Discuss This Topic <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
