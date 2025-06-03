import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, ChevronLeft, ChevronRight, Calendar, Grid3X3 } from "lucide-react";
import { AddWorkoutModal } from "@/components/modals/add-workout-modal";
import type { TrainingPlan } from "@shared/schema";

const workoutColors = {
  running: "from-primary to-primary/80",
  cycling: "from-green-400 to-green-500",
  strength: "from-blue-400 to-blue-500",
  rest: "from-gray-300 to-gray-400",
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type ViewMode = "weekly" | "monthly";

export function TrainingSchema() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: trainingPlan, isLoading } = useQuery<TrainingPlan[]>({
    queryKey: ["/api/training-plan"],
  });

  // Helper functions for date calculations
  const getWeekStart = (date: Date, weekOffset: number = 0) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + (weekOffset * 7));
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getWeekDays = (weekStart: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (days.length < 42) { // 6 weeks
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return { days, firstDay, lastDay };
  };

  const currentWeekStart = getWeekStart(new Date(), currentWeekOffset);
  const weekDays = getWeekDays(currentWeekStart);
  const { days: monthDays, firstDay, lastDay } = getMonthDays(currentDate);

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

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekOffset(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <>
      <Card className="glass-morphism hover-lift animate-slide-up">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg font-semibold text-foreground">Training Schema</CardTitle>
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/30 rounded-lg p-1">
                <Button
                  variant={viewMode === "weekly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("weekly")}
                  className={`h-8 px-3 ${viewMode === "weekly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Week
                </Button>
                <Button
                  variant={viewMode === "monthly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("monthly")}
                  className={`h-8 px-3 ${viewMode === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 className="w-3 h-3 mr-1" />
                  Month
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="text-primary hover:text-primary/80"
              >
                <CalendarPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => viewMode === "weekly" ? navigateWeek("prev") : navigateMonth("prev")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              {viewMode === "weekly" ? (
                <h3 className="font-medium text-foreground">
                  {currentWeekOffset === 0 ? "This Week" : 
                   currentWeekOffset === 1 ? "Next Week" :
                   currentWeekOffset === -1 ? "Last Week" :
                   `${Math.abs(currentWeekOffset)} weeks ${currentWeekOffset > 0 ? "ahead" : "ago"}`}
                </h3>
              ) : (
                <h3 className="font-medium text-foreground">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
              )}
              <p className="text-xs text-muted-foreground">
                {viewMode === "weekly" 
                  ? `${weekDays[0].toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`
                  : `${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}`
                }
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => viewMode === "weekly" ? navigateWeek("next") : navigateMonth("next")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {viewMode === "weekly" ? (
            /* Weekly Calendar */
            <div className="grid grid-cols-7 gap-2 mb-6">
              {weekDays.map((date, index) => {
                const dayOfWeek = date.getDay();
                const dayPlan = planByDay.get(dayOfWeek);
                const isTodayDate = isToday(date);
                
                return (
                  <div key={date.toDateString()} className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{dayNames[dayOfWeek]}</p>
                    <p className="text-xs text-muted-foreground mb-2">{date.getDate()}</p>
                    <div
                      className={`h-16 rounded-lg flex flex-col items-center justify-center text-white text-xs font-medium transition-all ${
                        dayPlan
                          ? `bg-gradient-to-b ${workoutColors[dayPlan.workoutType as keyof typeof workoutColors] || workoutColors.running}`
                          : "bg-gray-100 text-gray-400"
                      } ${isTodayDate ? "ring-2 ring-primary ring-offset-2 scale-105" : ""}`}
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
          ) : (
            /* Monthly Calendar */
            <div className="mb-6">
              {/* Month header with days */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {dayNames.map((day) => (
                  <div key={day} className="text-center p-2">
                    <p className="text-xs font-medium text-muted-foreground">{day}</p>
                  </div>
                ))}
              </div>
              
              {/* Month grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((date, index) => {
                  const dayOfWeek = date.getDay();
                  const dayPlan = planByDay.get(dayOfWeek);
                  const isTodayDate = isToday(date);
                  const isCurrentMonthDate = isCurrentMonth(date);
                  
                  return (
                    <div
                      key={date.toDateString()}
                      className={`h-12 rounded-lg flex flex-col items-center justify-center text-xs relative transition-all hover:scale-105 ${
                        !isCurrentMonthDate 
                          ? "text-gray-300" 
                          : isTodayDate 
                            ? "ring-2 ring-primary ring-offset-1" 
                            : ""
                      }`}
                    >
                      <span className={`text-xs ${!isCurrentMonthDate ? "text-gray-300" : "text-foreground"}`}>
                        {date.getDate()}
                      </span>
                      
                      {dayPlan && isCurrentMonthDate && (
                        <div
                          className={`w-2 h-2 rounded-full mt-1 bg-gradient-to-r ${
                            workoutColors[dayPlan.workoutType as keyof typeof workoutColors] || workoutColors.running
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Today's Workout - Only show in weekly view for current week */}
          {viewMode === "weekly" && currentWeekOffset === 0 && todaysWorkout && (
            <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-xl p-4 border border-primary/20 mb-6">
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

          {/* Quick Actions for Month View */}
          {viewMode === "monthly" && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button 
                variant="outline" 
                className="bg-white/50 border-primary/20 hover:bg-primary/10"
                onClick={() => {
                  setViewMode("weekly");
                  setCurrentWeekOffset(0);
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                View This Week
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/50 border-primary/20 hover:bg-primary/10"
                onClick={() => setIsModalOpen(true)}
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Add Workout
              </Button>
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
