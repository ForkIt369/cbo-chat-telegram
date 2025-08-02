import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

// Mock implementations for when Convex is not available
const mockUseMutation = () => {
  return async (...args: any[]) => {
    console.log('[Convex Mock] Mutation called:', args);
    return null;
  };
};

const mockUseQuery = () => {
  return undefined;
};

export function useConvexSession(telegramUser: any) {
  const [sessionId] = useState(() => uuidv4());
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isConvexEnabled] = useState(() => {
    // Check if Convex is properly configured
    return !!import.meta.env.VITE_CONVEX_URL;
  });

  // Use mock functions if Convex is not available
  const getOrCreateUser = isConvexEnabled ? useMutation(api.users.getOrCreateUser) : mockUseMutation();
  const createConversation = isConvexEnabled ? useMutation(api.conversations.createConversation) : mockUseMutation();
  const addMessage = isConvexEnabled ? useMutation(api.conversations.addMessage) : mockUseMutation();
  const updateConversation = isConvexEnabled ? useMutation(api.conversations.updateConversation) : mockUseMutation();
  
  // Only query if Convex is enabled and we have a sessionId
  const activeConversation = isConvexEnabled ? useQuery(
    api.conversations.getActiveConversation,
    sessionId ? { sessionId } : "skip"
  ) : mockUseQuery();

  // Only query if Convex is enabled and we have a userId
  const userInsights = isConvexEnabled ? useQuery(
    api.users.getUserInsightsSummary,
    userId ? { userId: userId as any } : "skip"
  ) : mockUseQuery();

  // Initialize user and conversation
  useEffect(() => {
    async function initializeSession() {
      if (!telegramUser || !isConvexEnabled) {
        console.log('[Convex] Skipping initialization:', { telegramUser: !!telegramUser, isConvexEnabled });
        return;
      }

      try {
        // Get or create user
        const newUserId = await getOrCreateUser({
          telegramId: telegramUser.id.toString(),
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
        });

        setUserId(newUserId);

        // Create conversation if not exists
        if (!activeConversation && newUserId) {
          const newConvId = await createConversation({
            userId: newUserId as any,
            sessionId,
          });
          setConversationId(newConvId);
        } else if (activeConversation) {
          setConversationId(activeConversation._id);
        }
      } catch (error) {
        console.error("[Convex] Error initializing session:", error);
        // Don't throw - let the app continue without Convex
      }
    }

    initializeSession();
  }, [telegramUser, activeConversation, isConvexEnabled]);

  // Function to save a message
  const saveMessage = async (role: "user" | "assistant", content: string) => {
    if (!conversationId || !userId || !isConvexEnabled) {
      console.log('[Convex] Skipping message save:', { conversationId: !!conversationId, userId: !!userId, isConvexEnabled });
      return;
    }

    try {
      // Extract keywords and flow mentions
      const keywords = extractKeywords(content);
      const flowMentions = extractFlowMentions(content);

      await addMessage({
        conversationId: conversationId as any,
        userId: userId as any,
        role,
        content,
        keywords,
        flowMentions,
      });

      // Auto-categorize conversation topic after assistant response
      if (role === "assistant") {
        const topic = extractTopic(content);
        const primaryFlow = flowMentions[0] || detectPrimaryFlow(content);
        
        await updateConversation({
          conversationId: conversationId as any,
          topic,
          primaryFlow,
        });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  return {
    sessionId,
    userId,
    conversationId,
    userInsights,
    saveMessage,
  };
}

// Helper functions
function extractKeywords(content: string): string[] {
  const businessKeywords = [
    "revenue", "sales", "customer", "growth", "profit", "cost",
    "team", "product", "market", "strategy", "metric", "KPI",
    "conversion", "retention", "churn", "CAC", "LTV", "ROI"
  ];
  
  const words = content.toLowerCase().split(/\s+/);
  return businessKeywords.filter(keyword => words.includes(keyword));
}

function extractFlowMentions(content: string): string[] {
  const flows = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes("value") || lowerContent.includes("customer") || lowerContent.includes("product")) {
    flows.push("value");
  }
  if (lowerContent.includes("info") || lowerContent.includes("data") || lowerContent.includes("analytics")) {
    flows.push("info");
  }
  if (lowerContent.includes("cash") || lowerContent.includes("revenue") || lowerContent.includes("cost")) {
    flows.push("cash");
  }
  if (lowerContent.includes("culture") || lowerContent.includes("team") || lowerContent.includes("communication")) {
    flows.push("culture");
  }
  
  return flows;
}

function extractTopic(content: string): string {
  // Simple topic extraction - in production, use NLP
  const firstSentence = content.split(/[.!?]/)[0];
  return firstSentence.slice(0, 100);
}

function detectPrimaryFlow(content: string): string {
  const flowMentions = extractFlowMentions(content);
  return flowMentions[0] || "value";
}