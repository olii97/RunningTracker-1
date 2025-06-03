import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkoutSchema, insertTodoSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Demo user ID (in real app, this would come from authentication)
  const DEMO_USER_ID = 1;

  // Workout routes
  app.get("/api/workouts", async (req, res) => {
    try {
      const workouts = await storage.getWorkouts(DEMO_USER_ID);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workouts" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const validatedData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout({
        ...validatedData,
        userId: DEMO_USER_ID,
      });
      res.json(workout);
    } catch (error) {
      res.status(400).json({ error: "Invalid workout data" });
    }
  });

  app.get("/api/workout-stats", async (req, res) => {
    try {
      const stats = await storage.getWorkoutStats(DEMO_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workout stats" });
    }
  });

  // Todo routes
  app.get("/api/todos", async (req, res) => {
    try {
      const todos = await storage.getTodos(DEMO_USER_ID);
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  });

  app.post("/api/todos", async (req, res) => {
    try {
      const validatedData = insertTodoSchema.parse(req.body);
      const todo = await storage.createTodo({
        ...validatedData,
        userId: DEMO_USER_ID,
      });
      res.json(todo);
    } catch (error) {
      res.status(400).json({ error: "Invalid todo data" });
    }
  });

  app.put("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const todo = await storage.updateTodo(id, req.body);
      if (!todo) {
        res.status(404).json({ error: "Todo not found" });
        return;
      }
      res.json(todo);
    } catch (error) {
      res.status(400).json({ error: "Failed to update todo" });
    }
  });

  app.delete("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTodo(id);
      if (!success) {
        res.status(404).json({ error: "Todo not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete todo" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements(DEMO_USER_ID);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  app.get("/api/user-xp", async (req, res) => {
    try {
      const xpData = await storage.getUserXP(DEMO_USER_ID);
      res.json(xpData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user XP" });
    }
  });

  // Training plan routes
  app.get("/api/training-plan", async (req, res) => {
    try {
      const plan = await storage.getTrainingPlan(DEMO_USER_ID);
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch training plan" });
    }
  });

  // Chat routes
  app.get("/api/chat-messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(DEMO_USER_ID);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage({
        ...validatedData,
        userId: DEMO_USER_ID,
      });
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // Activity feed routes
  app.get("/api/activity-feed", async (req, res) => {
    try {
      const feed = await storage.getActivityFeed(DEMO_USER_ID);
      res.json(feed);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity feed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
