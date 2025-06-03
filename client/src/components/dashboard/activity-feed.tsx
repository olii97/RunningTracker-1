import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Check, Calendar, Users } from "lucide-react";
import type { ActivityFeedItem } from "@shared/schema";

const iconMap = {
  trophy: Trophy,
  check: Check,
  calendar: Calendar,
  users: Users,
};

const colorMap = {
  purple: "from-primary to-primary/80",
  green: "from-green-400 to-green-500",
  blue: "from-blue-400 to-blue-500",
  orange: "from-orange-400 to-orange-500",
};

export function ActivityFeed() {
  const { data: feed, isLoading } = useQuery<ActivityFeedItem[]>({
    queryKey: ["/api/activity-feed"],
  });

  if (isLoading) {
    return (
      <Card className="glass-morphism hover-lift animate-slide-up">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism hover-lift animate-slide-up">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Feed</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {feed?.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Trophy;
            const colorClass = colorMap[item.color as keyof typeof colorMap] || colorMap.purple;
            const timeAgo = getTimeAgo(new Date(item.timestamp));

            return (
              <div key={item.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }
}
