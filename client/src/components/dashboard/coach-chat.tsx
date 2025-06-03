import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, UserCheck } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export function CoachChat() {
  const [newMessage, setNewMessage] = useState("");

  const { data: messages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat-messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat-messages", { message });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-messages"] });
      setNewMessage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-morphism hover-lift animate-scale-in h-96">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism hover-lift animate-scale-in h-96">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Chat with Coach</CardTitle>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col h-80">
        {/* Messages */}
        <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.isFromCoach ? "" : "justify-end"
              }`}
            >
              {message.isFromCoach && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`rounded-xl p-3 max-w-xs ${
                  message.isFromCoach
                    ? "bg-secondary text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isFromCoach ? "text-muted-foreground" : "text-primary-foreground/70"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!message.isFromCoach && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-white/50 border-none focus:ring-2 focus:ring-primary/50"
          />
          <Button
            type="submit"
            size="sm"
            disabled={sendMessageMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
