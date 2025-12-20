import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Globe, MessageSquare, ShieldCheck, Star, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: "view" | "enquiry" | "feedback" | "license";
}

async function fetchRecentActivity(): Promise<ActivityItem[]> {
  const response = await fetch("/api/activity/recent");
  if (!response.ok) throw new Error("Failed to fetch activity");
  return response.json();
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  const { data: activities } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: fetchRecentActivity,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (activities && activities.length > 0) {
      setItems(activities.slice(0, 5));
    }
  }, [activities]);

  const getIcon = (type: string) => {
    switch (type) {
      case "view": return <Eye className="h-3 w-3 text-blue-400" />;
      case "enquiry": return <MessageSquare className="h-3 w-3 text-emerald-400" />;
      case "feedback": return <Star className="h-3 w-3 text-amber-400" />;
      case "license": return <ShieldCheck className="h-3 w-3 text-purple-400" />;
      default: return <Globe className="h-3 w-3" />;
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full bg-card/30 backdrop-blur border border-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Live Activity Feed</h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div className="text-sm text-muted-foreground text-center py-4">
          Waiting for activity...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-card/30 backdrop-blur border border-white/5 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Live Activity Feed</h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0"
            >
              <div className="mt-1 bg-white/5 p-1.5 rounded-full border border-white/10">
                {getIcon(item.type)}
              </div>
              <div>
                <p className="text-foreground/90 leading-tight text-xs md:text-sm">{item.text}</p>
                <span className="text-[10px] text-muted-foreground font-mono">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
