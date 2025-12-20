import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Code2, 
  Award, 
  Users, 
  Clock, 
  MapPin,
  Download,
  Mail,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Heart
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchResumes, fetchSiteSettings, type ResumeData } from "@/lib/api";

const skills = {
  languages: ["TypeScript", "JavaScript", "Python", "SQL", "Go"],
  frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  backend: ["Node.js", "Express", "PostgreSQL", "Redis", "GraphQL"],
  tools: ["Git", "Docker", "AWS", "Vercel", "Figma"],
};

const stats = [
  { icon: Code2, value: "50+", label: "Projects Delivered" },
  { icon: Users, value: "30+", label: "Happy Clients" },
  { icon: Clock, value: "5+", label: "Years Experience" },
  { icon: Award, value: "100%", label: "Client Satisfaction" },
];

const experience = [
  {
    role: "Senior Software Engineer",
    company: "Tech Company",
    period: "2022 - Present",
    description: "Leading development of enterprise SaaS applications, mentoring junior developers, and architecting scalable solutions.",
  },
  {
    role: "Full Stack Developer",
    company: "Digital Agency",
    period: "2020 - 2022",
    description: "Built custom web applications for diverse clients across fintech, healthcare, and e-commerce industries.",
  },
  {
    role: "Frontend Developer",
    company: "Startup",
    period: "2019 - 2020",
    description: "Developed responsive user interfaces and implemented complex state management solutions.",
  },
];

export default function About() {
  const { data: resumes = [] } = useQuery({
    queryKey: ["public-resumes"],
    queryFn: fetchResumes,
  });

  const { data: siteSettings = {} } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
  });

  const visibleResume = resumes.find((r: ResumeData) => r.isVisible);

  const handleResumeDownload = () => {
    if (visibleResume) {
      const a = document.createElement('a');
      a.href = visibleResume.objectPath;
      a.download = visibleResume.filename;
      a.click();
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                About Me
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="text-about-title">
                Building Digital Solutions That Matter
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                I'm a software engineer passionate about creating elegant, efficient, and impactful digital solutions. 
                With over 5 years of experience in full-stack development, I specialize in turning complex business 
                requirements into intuitive user experiences.
              </p>
              <p className="text-muted-foreground mb-8">
                My approach combines technical excellence with a deep understanding of user needs. I believe great 
                software should not only work flawlessly but also delight users and deliver measurable business value.
              </p>
              <div className="flex flex-wrap gap-4">
                {visibleResume && (
                  <Button onClick={handleResumeDownload} data-testid="button-download-resume-about">
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <a href="mailto:contact@pmgxmedia.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Get in Touch
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="h-32 w-32 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    {siteSettings.profileImage ? (
                      <img 
                        src={siteSettings.profileImage} 
                        alt="PMGXmedia" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Code2 className="h-16 w-16 text-primary" />
                    )}
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">PMGXmedia</h3>
                  <p className="text-muted-foreground">Software Engineer</p>
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Available Worldwide</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 border-white/10 text-center p-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-display text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold mb-12 text-center">Technical Skills</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, items], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-background border-white/10 h-full">
                  <CardContent className="p-6">
                    <h3 className="font-semibold capitalize mb-4 text-primary">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-white/5">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-12">
            <Briefcase className="h-6 w-6 text-primary" />
            <h2 className="font-display text-3xl font-bold">Experience</h2>
          </div>
          
          <div className="space-y-8 max-w-3xl">
            {experience.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 border-l-2 border-primary/30"
              >
                <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-primary" />
                <div className="mb-1">
                  <h3 className="font-semibold text-lg">{job.role}</h3>
                  <p className="text-primary">{job.company}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{job.period}</p>
                <p className="text-muted-foreground">{job.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold mb-4">Let's Create Something Amazing</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            I'm always excited to work on new projects and collaborate with passionate teams. 
            Whether you have a specific project in mind or just want to connect, I'd love to hear from you.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button size="lg" asChild>
              <a href="mailto:contact@pmgxmedia.com">
                <Mail className="mr-2 h-5 w-5" />
                Email Me
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
