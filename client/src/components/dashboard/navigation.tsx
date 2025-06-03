import { Activity } from "lucide-react";

export function Navigation() {
  return (
    <nav className="glass-morphism-purple fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Activity className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-foreground">RunTracker Pro</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Workouts</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Progress</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Training</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full"></div>
        </div>
      </div>
    </nav>
  );
}
