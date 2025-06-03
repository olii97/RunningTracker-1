import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Lock, Flame } from "lucide-react";
import type { Achievement } from "@shared/schema";

const iconMap = {
  trophy: Trophy,
  medal: Medal,
  fire: Flame,
  lock: Lock,
};

const colorMap = {
  yellow: "from-yellow-400 to-yellow-500",
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-emerald-500",
  purple: "from-primary to-primary/80",
  gray: "from-gray-300 to-gray-400",
};

interface UserXP {
  currentXP: number;
  level: number;
  nextLevelXP: number;
}

export function MedalsXP() {
  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: xpData, isLoading: xpLoading } = useQuery<UserXP>({
    queryKey: ["/api/user-xp"],
  });

  if (achievementsLoading || xpLoading) {
    return (
      <Card className="glass-morphism hover-lift animate-scale-in">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-gray-100 rounded-xl">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const xpProgress = xpData ? (xpData.currentXP / xpData.nextLevelXP) * 100 : 0;

  return (
    <Card className="glass-morphism hover-lift animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Medals & XP</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* XP Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Level {xpData?.level}
            </span>
            <span className="text-sm text-muted-foreground">
              {xpData?.currentXP} / {xpData?.nextLevelXP} XP
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Achievements</h3>

          {achievements?.map((achievement) => {
            const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Trophy;
            const colorClass = colorMap[achievement.color as keyof typeof colorMap] || colorMap.yellow;

            return (
              <div
                key={achievement.id}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-white/50 to-white/30 rounded-xl border border-white/20"
              >
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                <span className="text-xs text-primary font-bold">+{achievement.xp} XP</span>
              </div>
            );
          })}

          {/* Locked Achievement Example */}
          <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl opacity-60">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Marathon Master</p>
              <p className="text-xs text-muted-foreground">Complete a marathon distance</p>
            </div>
            <span className="text-xs text-gray-400 font-bold">Locked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
