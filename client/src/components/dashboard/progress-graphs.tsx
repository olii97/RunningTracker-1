import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from "recharts";

interface WorkoutStats {
  totalDistance: number;
  totalDuration: number;
  averagePace: number;
  totalCalories: number;
  weeklyDistance: number[];
}

export function ProgressGraphs() {
  const { data: stats, isLoading } = useQuery<WorkoutStats>({
    queryKey: ["/api/workout-stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-morphism hover-lift animate-fade-in">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const weeklyData = stats?.weeklyDistance.map((distance, index) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
    distance,
  })) || [];

  const paceData = [
    { week: "W1", pace: 6.2 },
    { week: "W2", pace: 5.8 },
    { week: "W3", pace: 5.6 },
    { week: "W4", pace: stats?.averagePace || 5.4 },
  ];

  const caloriesProgress = stats ? Math.min((stats.totalCalories / 4000) * 100, 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Weekly Distance */}
      <Card className="glass-morphism hover-lift animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Distance</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <Line
                  type="monotone"
                  dataKey="distance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">
              {stats?.weeklyDistance.reduce((sum, d) => sum + d, 0).toFixed(1)}km
            </p>
            <p className="text-xs text-muted-foreground">This week</p>
          </div>
        </CardContent>
      </Card>

      {/* Average Pace */}
      <Card className="glass-morphism hover-lift animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average Pace</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paceData}>
                <Bar dataKey="pace" fill="hsl(var(--chart-2))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">
              {stats?.averagePace.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">min/km</p>
          </div>
        </CardContent>
      </Card>

      {/* Calories Progress */}
      <Card className="glass-morphism hover-lift animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Calories Burned</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32 flex items-center justify-center mb-3">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--border))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * caloriesProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {Math.round(caloriesProgress)}%
                </span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">
              {stats?.totalCalories.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">of 4,000 goal</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
