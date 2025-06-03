import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertWorkoutSchema } from "@shared/schema";

const workoutFormSchema = insertWorkoutSchema.extend({
  duration: z.string().min(1, "Duration is required"),
});

type WorkoutFormData = z.infer<typeof workoutFormSchema>;

interface AddWorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddWorkoutModal({ open, onOpenChange }: AddWorkoutModalProps) {
  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      type: "running",
      distance: 0,
      duration: "",
      notes: "",
    },
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: WorkoutFormData) => {
      // Convert duration from MM:SS format to seconds
      const [minutes, seconds] = data.duration.split(":").map(Number);
      const durationInSeconds = (minutes || 0) * 60 + (seconds || 0);

      const workoutData = {
        type: data.type,
        distance: data.distance,
        duration: durationInSeconds,
        notes: data.notes,
      };

      const response = await apiRequest("POST", "/api/workouts", workoutData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workout-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activity-feed"] });
      form.reset();
      onOpenChange(false);
    },
  });

  const onSubmit = (data: WorkoutFormData) => {
    createWorkoutMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Add Workout</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/50 border-none focus:ring-2 focus:ring-primary/50">
                        <SelectValue placeholder="Select workout type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="5.0"
                      className="bg-white/50 border-none focus:ring-2 focus:ring-primary/50"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (MM:SS)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="25:30"
                      className="bg-white/50 border-none focus:ring-2 focus:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How did it feel?"
                      rows={3}
                      className="bg-white/50 border-none focus:ring-2 focus:ring-primary/50 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createWorkoutMutation.isPending}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {createWorkoutMutation.isPending ? "Saving..." : "Save Workout"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
