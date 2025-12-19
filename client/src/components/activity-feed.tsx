import { Activity } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Globe, MessageSquare, ShieldCheck } from "lucide-react";

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities: initialActivities }: ActivityFeedProps) {
  const [items, setItems] = useState(initialActivities);

  // Simulate incoming live activity
  useEffect(() => {
    const interval = setInterval(() => {
      const newItem: Activity = {
        id: Date.now(),
        text: "New visitor from San Francisco viewing AI CRM",
        time: "Just now",
        type: "view"
      };
      setItems(prev => [newItem, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "view": return <Globe className="h-3 w-3 text-blue-400" />;
      case "enquiry": return <MessageSquare className="h-3 w-3 text-emerald-400" />;
      case "license": return <ShieldCheck className="h-3 w-3 text-amber-400" />;
      default: return <Globe className="h-3 w-3" />;
    }
  };

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
