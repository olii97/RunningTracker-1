import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { AddWorkoutModal } from "@/components/modals/add-workout-modal";
import type { TrainingPlan } from "@shared/schema";

const workoutColors = {
  running: "from-primary to-primary/80",
  cycling: "from-green-400 to-green-500",
  strength: "from-blue-400 to-blue-500",
  rest: "from-gray-300 to-gray-400",
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TrainingSchema() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: trainingPlan, isLoading } = useQuery<TrainingPlan[]>({
    queryKey: ["/api/training-plan"],
  });

  if (isLoading) {
    return (
      <Card className="glass-morphism hover-lift animate-slide-up">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create a map of day to workout
  const planByDay = new Map<number, TrainingPlan>();
  trainingPlan?.forEach((plan) => {
    planByDay.set(plan.dayOfWeek, plan);
  });

  // Get today's workout
  const today = new Date().getDay();
  const todaysWorkout = planByDay.get(today);

  return (
    <>
      <Card className="glass-morphism hover-lift animate-slide-up">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Training Schema</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-primary hover:text-primary/80"
            >
              <CalendarPlus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Weekly Calendar */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {dayNames.map((day, index) => {
              const dayPlan = planByDay.get(index);
              const isToday = index === today;
              
              return (
                <div key={day} className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">{day}</p>
                  <div
                    className={`h-16 rounded-lg flex flex-col items-center justify-center text-white text-xs font-medium ${
                      dayPlan
                        ? `bg-gradient-to-b ${workoutColors[dayPlan.workoutType as keyof typeof workoutColors] || workoutColors.running}`
                        : "bg-gray-100 text-gray-400"
                    } ${isToday ? "ring-2 ring-primary ring-offset-2" : ""}`}
                  >
                    {dayPlan ? (
                      <>
                        <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{dayPlan.distance ? `${dayPlan.distance}K` : dayPlan.workoutType}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Rest</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Workout */}
          {todaysWorkout && (
            <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Today's Workout</h3>
                  <p className="text-sm text-muted-foreground">
                    {todaysWorkout.workoutType} - {todaysWorkout.distance}km
                  </p>
                  {todaysWorkout.notes && (
                    <p className="text-xs text-primary mt-1">{todaysWorkout.notes}</p>
                  )}
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Run
                </Button>
              </div>
            </div>
          )}

          {/* Weekly Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <p className="text-2xl font-bold text-primary">{trainingPlan?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Workouts</p>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <p className="text-2xl font-bold text-green-500">
                {trainingPlan?.reduce((sum, plan) => sum + (plan.distance || 0), 0).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Total KM</p>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <p className="text-2xl font-bold text-orange-500">3:45</p>
              <p className="text-xs text-muted-foreground">Est. Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddWorkoutModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
