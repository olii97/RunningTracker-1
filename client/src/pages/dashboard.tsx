import { Navigation } from "@/components/dashboard/navigation";
import { TodoList } from "@/components/dashboard/todo-list";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ProgressGraphs } from "@/components/dashboard/progress-graphs";
import { TrainingSchema } from "@/components/dashboard/training-schema";
import { CoachChat } from "@/components/dashboard/coach-chat";
import { MedalsXP } from "@/components/dashboard/medals-xp";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-secondary">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <TodoList />
              <ActivityFeed />
            </div>

            {/* Middle Column */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <ProgressGraphs />
              <TrainingSchema />
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <CoachChat />
              <MedalsXP />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
