import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // running, cycling, swimming, walking
  distance: real("distance").notNull(), // in km
  duration: integer("duration").notNull(), // in seconds
  pace: real("pace"), // min/km
  calories: integer("calories"),
  notes: text("notes"),
  date: timestamp("date").notNull().defaultNow(),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  icon: text("icon").default("running"), // running, bicycle, shopping-bag, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  xp: integer("xp").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(), // gradient colors
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const trainingPlans = pgTable("training_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6, 0 = Sunday
  workoutType: text("workout_type").notNull(),
  distance: real("distance"),
  intensity: text("intensity"), // easy, moderate, hard
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  isFromCoach: boolean("is_from_coach").notNull().default(false),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const activityFeed = pgTable("activity_feed", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // workout_completed, achievement_earned, plan_updated
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Insert schemas
export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  userId: true,
  pace: true,
  calories: true,
  date: true,
});

export const insertTodoSchema = createInsertSchema(todos).omit({
  id: true,
  userId: true,
  completed: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  userId: true,
  isFromCoach: true,
  timestamp: true,
});

export const insertTrainingPlanSchema = createInsertSchema(trainingPlans).omit({
  id: true,
  userId: true,
  active: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Todo = typeof todos.$inferSelect;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type TrainingPlan = typeof trainingPlans.$inferSelect;
export type InsertTrainingPlan = z.infer<typeof insertTrainingPlanSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ActivityFeedItem = typeof activityFeed.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
