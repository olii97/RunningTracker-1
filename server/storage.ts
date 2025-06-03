import { 
  users, workouts, todos, achievements, trainingPlans, chatMessages, activityFeed,
  type User, type InsertUser, type Workout, type InsertWorkout, 
  type Todo, type InsertTodo, type Achievement, type TrainingPlan, type InsertTrainingPlan,
  type ChatMessage, type InsertChatMessage, type ActivityFeedItem
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Workout methods
  getWorkouts(userId: number): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout & { userId: number }): Promise<Workout>;
  getWorkoutStats(userId: number): Promise<{
    totalDistance: number;
    totalDuration: number;
    averagePace: number;
    totalCalories: number;
    weeklyDistance: number[];
  }>;

  // Todo methods
  getTodos(userId: number): Promise<Todo[]>;
  createTodo(todo: InsertTodo & { userId: number }): Promise<Todo>;
  updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined>;
  deleteTodo(id: number): Promise<boolean>;

  // Achievement methods
  getAchievements(userId: number): Promise<Achievement[]>;
  getUserXP(userId: number): Promise<{ currentXP: number; level: number; nextLevelXP: number }>;

  // Training plan methods
  getTrainingPlan(userId: number): Promise<TrainingPlan[]>;
  createTrainingPlan(plan: InsertTrainingPlan & { userId: number }): Promise<TrainingPlan>;

  // Chat methods
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage & { userId: number }): Promise<ChatMessage>;

  // Activity feed methods
  getActivityFeed(userId: number): Promise<ActivityFeedItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workouts: Map<number, Workout>;
  private todos: Map<number, Todo>;
  private achievements: Map<number, Achievement>;
  private trainingPlans: Map<number, TrainingPlan>;
  private chatMessages: Map<number, ChatMessage>;
  private activityFeed: Map<number, ActivityFeedItem>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.workouts = new Map();
    this.todos = new Map();
    this.achievements = new Map();
    this.trainingPlans = new Map();
    this.chatMessages = new Map();
    this.activityFeed = new Map();
    this.currentId = 1;

    // Seed with demo data
    this.seedData();
  }

  private seedData() {
    // Create demo user
    const user: User = { id: 1, username: "demo", password: "demo" };
    this.users.set(1, user);

    // Seed todos
    const demoTodos: Todo[] = [
      { id: 1, userId: 1, title: "By bike", completed: false, icon: "bicycle", createdAt: new Date() },
      { id: 2, userId: 1, title: "Buy shoes", completed: false, icon: "shopping-bag", createdAt: new Date() },
      { id: 3, userId: 1, title: "Morning run", completed: true, icon: "running", createdAt: new Date() },
    ];
    demoTodos.forEach(todo => this.todos.set(todo.id, todo));

    // Seed workouts
    const now = new Date();
    const workoutsData: Workout[] = [
      {
        id: 1, userId: 1, type: "running", distance: 5.2, duration: 1623, pace: 5.2,
        calories: 312, notes: "Great morning run!", date: new Date(now.getTime() - 24 * 60 * 60 * 1000)
      },
      {
        id: 2, userId: 1, type: "running", distance: 8.5, duration: 2580, pace: 5.05,
        calories: 510, notes: "Interval training", date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
    ];
    workoutsData.forEach(workout => this.workouts.set(workout.id, workout));

    // Seed achievements
    const achievementsData: Achievement[] = [
      {
        id: 1, userId: 1, title: "5K Champion", description: "Completed 10 runs of 5K or more",
        xp: 200, icon: "trophy", color: "yellow", earnedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2, userId: 1, title: "Consistency King", description: "7 day running streak",
        xp: 150, icon: "fire", color: "blue", earnedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000)
      },
    ];
    achievementsData.forEach(achievement => this.achievements.set(achievement.id, achievement));

    // Seed training plan
    const trainingPlanData: TrainingPlan[] = [
      { id: 1, userId: 1, dayOfWeek: 1, workoutType: "running", distance: 5, intensity: "moderate", notes: "5K tempo run", active: true },
      { id: 2, userId: 1, dayOfWeek: 3, workoutType: "running", distance: 8, intensity: "hard", notes: "Interval training", active: true },
      { id: 3, userId: 1, dayOfWeek: 5, workoutType: "running", distance: 12, intensity: "easy", notes: "Long run", active: true },
    ];
    trainingPlanData.forEach(plan => this.trainingPlans.set(plan.id, plan));

    // Seed chat messages
    const chatData: ChatMessage[] = [
      { id: 1, userId: 1, message: "Great job on yesterday's 5K! Your pace is improving consistently. 🏃‍♂️", isFromCoach: true, timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
      { id: 2, userId: 1, message: "Thanks! Should I increase the distance for next week?", isFromCoach: false, timestamp: new Date(now.getTime() - 1.5 * 60 * 60 * 1000) },
      { id: 3, userId: 1, message: "Let's stick to the current plan for one more week, then we'll add 10% distance.", isFromCoach: true, timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000) },
    ];
    chatData.forEach(msg => this.chatMessages.set(msg.id, msg));

    // Seed activity feed
    const feedData: ActivityFeedItem[] = [
      { id: 1, userId: 1, type: "achievement_earned", title: "You earned a new badge!", description: "Consistency King", icon: "trophy", color: "purple", timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
      { id: 2, userId: 1, type: "workout_completed", title: "Completed 5K run", description: "25:43 time", icon: "check", color: "green", timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      { id: 3, userId: 1, type: "plan_updated", title: "Training plan updated", description: "Weekly goals adjusted", icon: "calendar", color: "blue", timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
    ];
    feedData.forEach(item => this.activityFeed.set(item.id, item));

    this.currentId = 100; // Start IDs from 100 to avoid conflicts
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWorkouts(userId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => workout.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(workoutData: InsertWorkout & { userId: number }): Promise<Workout> {
    const id = this.currentId++;
    const pace = workoutData.duration > 0 ? (workoutData.duration / 60) / workoutData.distance : 0;
    const calories = Math.round(workoutData.distance * 60); // Rough estimate
    
    const workout: Workout = {
      ...workoutData,
      id,
      pace,
      calories,
      date: new Date(),
    };
    
    this.workouts.set(id, workout);

    // Add to activity feed
    const feedItem: ActivityFeedItem = {
      id: this.currentId++,
      userId: workoutData.userId,
      type: "workout_completed",
      title: `Completed ${workoutData.distance}km ${workoutData.type}`,
      description: `${Math.floor(workoutData.duration / 60)}:${(workoutData.duration % 60).toString().padStart(2, '0')} time`,
      icon: "check",
      color: "green",
      timestamp: new Date(),
    };
    this.activityFeed.set(feedItem.id, feedItem);

    return workout;
  }

  async getWorkoutStats(userId: number): Promise<{
    totalDistance: number;
    totalDuration: number;
    averagePace: number;
    totalCalories: number;
    weeklyDistance: number[];
  }> {
    const userWorkouts = await this.getWorkouts(userId);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentWorkouts = userWorkouts.filter(w => w.date >= oneWeekAgo);
    
    const totalDistance = userWorkouts.reduce((sum, w) => sum + w.distance, 0);
    const totalDuration = userWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = userWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
    const averagePace = userWorkouts.length > 0 ? 
      userWorkouts.reduce((sum, w) => sum + (w.pace || 0), 0) / userWorkouts.length : 0;

    // Weekly distance for the last 7 days
    const weeklyDistance: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayDistance = userWorkouts
        .filter(w => w.date >= dayStart && w.date < dayEnd)
        .reduce((sum, w) => sum + w.distance, 0);
      
      weeklyDistance.push(dayDistance);
    }

    return {
      totalDistance,
      totalDuration,
      averagePace,
      totalCalories,
      weeklyDistance,
    };
  }

  async getTodos(userId: number): Promise<Todo[]> {
    return Array.from(this.todos.values())
      .filter(todo => todo.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createTodo(todoData: InsertTodo & { userId: number }): Promise<Todo> {
    const id = this.currentId++;
    const todo: Todo = {
      ...todoData,
      id,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.set(id, todo);
    return todo;
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    const todo = this.todos.get(id);
    if (!todo) return undefined;

    const updatedTodo = { ...todo, ...updates };
    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<boolean> {
    return this.todos.delete(id);
  }

  async getAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime());
  }

  async getUserXP(userId: number): Promise<{ currentXP: number; level: number; nextLevelXP: number }> {
    const achievements = await this.getAchievements(userId);
    const totalXP = achievements.reduce((sum, achievement) => sum + achievement.xp, 0);
    
    // Simple level calculation: 1000 XP per level
    const level = Math.floor(totalXP / 1000) + 1;
    const currentXP = totalXP % 1000;
    const nextLevelXP = 1000;

    return { currentXP, level, nextLevelXP };
  }

  async getTrainingPlan(userId: number): Promise<TrainingPlan[]> {
    return Array.from(this.trainingPlans.values())
      .filter(plan => plan.userId === userId && plan.active)
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  }

  async createTrainingPlan(planData: InsertTrainingPlan & { userId: number }): Promise<TrainingPlan> {
    const id = this.currentId++;
    const plan: TrainingPlan = {
      ...planData,
      id,
      active: true,
    };
    this.trainingPlans.set(id, plan);
    return plan;
  }

  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createChatMessage(messageData: InsertChatMessage & { userId: number }): Promise<ChatMessage> {
    const id = this.currentId++;
    const message: ChatMessage = {
      ...messageData,
      id,
      isFromCoach: false,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);

    // Simulate coach response
    setTimeout(() => {
      const coachResponse: ChatMessage = {
        id: this.currentId++,
        userId: messageData.userId,
        message: "Thanks for your message! I'll review your progress and get back to you soon.",
        isFromCoach: true,
        timestamp: new Date(),
      };
      this.chatMessages.set(coachResponse.id, coachResponse);
    }, 2000);

    return message;
  }

  async getActivityFeed(userId: number): Promise<ActivityFeedItem[]> {
    return Array.from(this.activityFeed.values())
      .filter(item => item.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10); // Limit to 10 most recent items
  }
}

export const storage = new MemStorage();
