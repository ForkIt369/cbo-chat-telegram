import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

// Mock hook that provides the same interface as useConvexSession but without Convex
export function useConvexMock(_telegramUser: any) {
  const [sessionId] = useState(() => uuidv4());
  const [userId] = useState<string | null>('mock-user-id');
  const [conversationId] = useState<string | null>('mock-conversation-id');

  // Mock save message function
  const saveMessage = async (role: "user" | "assistant", content: string) => {
    console.log('[Mock] Saving message:', { role, content });
    // Just log it, don't actually save
  };

  // Mock user insights
  const userInsights = {
    activeInsights: 3,
    completedChallenges: 7,
    totalConversations: 42
  };

  return {
    sessionId,
    userId,
    conversationId,
    userInsights,
    saveMessage,
  };
}