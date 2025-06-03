import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Bike, ShoppingBag, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Todo } from "@shared/schema";

const iconMap = {
  bicycle: Bike,
  "shopping-bag": ShoppingBag,
  running: Activity,
};

export function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  const createTodoMutation = useMutation({
    mutationFn: async (data: { title: string; icon: string }) => {
      const response = await apiRequest("POST", "/api/todos", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setNewTodo("");
      setIsDialogOpen(false);
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const response = await apiRequest("PUT", `/api/todos/${id}`, { completed });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      createTodoMutation.mutate({
        title: newTodo.trim(),
        icon: "running",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-morphism hover-lift animate-fade-in">
        <CardContent className="p-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism hover-lift animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">To Do's</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-6 h-6 p-0 rounded-full">
                <Plus className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Todo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Enter todo item..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTodoMutation.isPending}>
                    {createTodoMutation.isPending ? "Adding..." : "Add Todo"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {todos?.map((todo) => {
            const IconComponent = iconMap[todo.icon as keyof typeof iconMap] || Activity;
            return (
              <div
                key={todo.id}
                className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-colors"
              >
                <button
                  onClick={() =>
                    toggleTodoMutation.mutate({
                      id: todo.id,
                      completed: !todo.completed,
                    })
                  }
                  className={`w-4 h-4 rounded border-2 transition-colors ${
                    todo.completed
                      ? "bg-primary border-primary text-white"
                      : "border-primary hover:bg-primary/10"
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {todo.title}
                </span>
                <IconComponent className="w-4 h-4 text-primary" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
