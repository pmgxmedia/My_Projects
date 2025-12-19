import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Users, Clock, MousePointerClick, Globe } from "lucide-react";
import { motion } from "framer-motion";

const data = [
  { name: "Mon", visitors: 400, engagement: 240 },
  { name: "Tue", visitors: 300, engagement: 139 },
  { name: "Wed", visitors: 200, engagement: 980 },
  { name: "Thu", visitors: 278, engagement: 390 },
  { name: "Fri", visitors: 189, engagement: 480 },
  { name: "Sat", visitors: 239, engagement: 380 },
  { name: "Sun", visitors: 349, engagement: 430 },
];

export function StatsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <StatCard 
        title="Total Views" 
        value="12,543" 
        change="+12.5%" 
        icon={<Users className="h-4 w-4 text-primary" />} 
        chartColor="hsl(210, 100%, 60%)"
      />
      <StatCard 
        title="Avg. Session" 
        value="4m 12s" 
        change="+2.1%" 
        icon={<Clock className="h-4 w-4 text-secondary" />} 
        chartColor="hsl(45, 90%, 55%)"
      />
      <StatCard 
        title="Engagement" 
        value="92/100" 
        change="+5.4%" 
        icon={<MousePointerClick className="h-4 w-4 text-emerald-500" />} 
        chartColor="hsl(160, 85%, 45%)"
      />
      <StatCard 
        title="Active Regions" 
        value="14" 
        change="Global" 
        icon={<Globe className="h-4 w-4 text-purple-500" />} 
        chartColor="hsl(280, 65%, 60%)"
      />
    </div>
  );
}

function StatCard({ title, value, change, icon, chartColor }: any) {
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
            <span className="text-emerald-500 font-medium">{change}</span> from last month
          </p>
          <div className="h-[60px] w-full -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke={chartColor}
                  fillOpacity={1}
                  fill={`url(#gradient-${title})`}
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
