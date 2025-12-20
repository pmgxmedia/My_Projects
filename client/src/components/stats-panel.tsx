import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Users, Clock, MousePointerClick, MessageSquare, TrendingUp, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface ProjectStats {
  totalViews: number;
  totalEnquiries: number;
  engagementScore: number;
  weeklyData: { day: string; views: number }[];
}

async function fetchProjectStats(projectId: string): Promise<ProjectStats> {
  const response = await fetch(`/api/projects/${projectId}/stats`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

interface StatsPanelProps {
  projectId: string;
}

export function StatsPanel({ projectId }: StatsPanelProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["projectStats", projectId],
    queryFn: () => fetchProjectStats(projectId),
    refetchInterval: 30000,
  });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-white/5 animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-white/10 rounded w-20" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-white/10 rounded w-16 mb-2" />
              <div className="h-3 bg-white/10 rounded w-24 mb-4" />
              <div className="h-[60px] bg-white/5 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const viewsChange = stats.weeklyData.length >= 2 
    ? ((stats.weeklyData[stats.weeklyData.length - 1].views - stats.weeklyData[0].views) / Math.max(stats.weeklyData[0].views, 1) * 100).toFixed(1)
    : "0";

  const viewsChangeText = parseFloat(viewsChange) >= 0 ? `+${viewsChange}%` : `${viewsChange}%`;
  const viewsChangeColor = parseFloat(viewsChange) >= 0 ? "text-emerald-500" : "text-red-400";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <StatCard 
        title="Total Views" 
        value={stats.totalViews.toLocaleString()} 
        change={viewsChangeText}
        changeColor={viewsChangeColor}
        icon={<Eye className="h-4 w-4 text-primary" />} 
        chartColor="hsl(210, 100%, 60%)"
        data={stats.weeklyData.map(d => ({ visitors: d.views }))}
      />
      <StatCard 
        title="Enquiries" 
        value={stats.totalEnquiries.toString()} 
        change={stats.totalEnquiries > 0 ? "Active" : "Awaiting"}
        changeColor={stats.totalEnquiries > 0 ? "text-emerald-500" : "text-muted-foreground"}
        icon={<MessageSquare className="h-4 w-4 text-secondary" />} 
        chartColor="hsl(45, 90%, 55%)"
        data={generateEnquiryTrend(stats.totalEnquiries)}
      />
      <StatCard 
        title="Engagement" 
        value={`${stats.engagementScore}/100`} 
        change={stats.engagementScore >= 70 ? "Strong" : stats.engagementScore >= 40 ? "Growing" : "Building"}
        changeColor={stats.engagementScore >= 70 ? "text-emerald-500" : stats.engagementScore >= 40 ? "text-amber-500" : "text-muted-foreground"}
        icon={<MousePointerClick className="h-4 w-4 text-emerald-500" />} 
        chartColor="hsl(160, 85%, 45%)"
        data={generateEngagementTrend(stats.engagementScore)}
      />
      <StatCard 
        title="Weekly Trend" 
        value={stats.weeklyData.reduce((sum, d) => sum + d.views, 0).toLocaleString()} 
        change="Last 7 days"
        changeColor="text-purple-400"
        icon={<TrendingUp className="h-4 w-4 text-purple-500" />} 
        chartColor="hsl(280, 65%, 60%)"
        data={stats.weeklyData.map(d => ({ visitors: d.views }))}
      />
    </div>
  );
}

function generateEnquiryTrend(total: number) {
  const base = Math.max(total / 7, 0.5);
  return Array.from({ length: 7 }, (_, i) => ({
    visitors: Math.round(base * (0.5 + Math.random() * (i / 7)))
  }));
}

function generateEngagementTrend(score: number) {
  const base = score * 0.7;
  return Array.from({ length: 7 }, (_, i) => ({
    visitors: Math.round(base + (score - base) * (i / 6) + Math.random() * 10)
  }));
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  icon: React.ReactNode;
  chartColor: string;
  data: { visitors: number }[];
}

function StatCard({ title, value, change, changeColor, icon, chartColor, data }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-display">{value}</div>
          <p className="text-xs text-muted-foreground mb-4">
            <span className={`font-medium ${changeColor}`}>{change}</span>
          </p>
          <div className="h-[60px] w-full -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke={chartColor}
                  fillOpacity={1}
                  fill={`url(#gradient-${title.replace(/\s/g, '')})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
