import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - Core user information
  users: defineTable({
    telegramId: v.string(),
    firstName: v.string(),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    businessType: v.optional(v.string()), // SaaS, eCommerce, Agency, etc.
    businessStage: v.optional(v.string()), // Startup, Growth, Scale, Turnaround
    onboardingCompleted: v.boolean(),
    createdAt: v.string(),
    lastActiveAt: v.string(),
  })
  .index("by_telegram_id", ["telegramId"]),

  // Conversations table - Session grouping
  conversations: defineTable({
    userId: v.id("users"),
    sessionId: v.string(), // UUID for grouping messages
    startedAt: v.string(),
    endedAt: v.optional(v.string()),
    topic: v.optional(v.string()), // Auto-extracted topic
    sentiment: v.optional(v.string()), // positive, neutral, stressed
    primaryFlow: v.optional(v.string()), // Value, Info, Cash, Culture
    resolved: v.boolean(),
  })
  .index("by_user", ["userId"])
  .index("by_session", ["sessionId"]),

  // Messages table - Individual messages with embeddings
  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    role: v.string(), // "user" or "assistant"
    content: v.string(),
    timestamp: v.string(),
    embedding: v.optional(v.array(v.float64())), // For RAG similarity search
    keywords: v.optional(v.array(v.string())), // Extracted business terms
    flowMentions: v.optional(v.array(v.string())), // Which flows discussed
  })
  .index("by_conversation", ["conversationId"])
  .index("by_user_time", ["userId", "timestamp"]),

  // Business Insights table - Extracted insights
  businessInsights: defineTable({
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    insightType: v.string(), // "bottleneck", "opportunity", "pattern", "milestone"
    category: v.string(), // Maps to Four Flows
    title: v.string(),
    description: v.string(),
    impact: v.string(), // "high", "medium", "low"
    actionItems: v.array(v.string()),
    status: v.string(), // "new", "in_progress", "completed"
    createdAt: v.string(),
    completedAt: v.optional(v.string()),
  })
  .index("by_user_status", ["userId", "status"])
  .index("by_user_category", ["userId", "category"]),

  // Flow Metrics table - Quantitative tracking
  flowMetrics: defineTable({
    userId: v.id("users"),
    flowType: v.string(), // "value", "info", "cash", "culture"
    metricName: v.string(), // e.g., "customer_satisfaction", "revenue_growth"
    value: v.float64(),
    unit: v.string(), // "%", "$", "score", etc.
    timestamp: v.string(),
    conversationId: v.optional(v.id("conversations")), // Link to when discussed
    trend: v.optional(v.string()), // "up", "down", "stable"
  })
  .index("by_user_flow", ["userId", "flowType"])
  .index("by_user_metric", ["userId", "metricName"]),

  // Challenges table - Business problems tracking
  challenges: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    flowType: v.string(),
    severity: v.string(), // "critical", "high", "medium", "low"
    status: v.string(), // "identified", "analyzing", "solving", "resolved"
    identifiedAt: v.string(),
    resolvedAt: v.optional(v.string()),
    relatedConversations: v.array(v.id("conversations")),
    solutions: v.optional(v.array(v.string())),
  })
  .index("by_user_status", ["userId", "status"])
  .index("by_severity", ["severity"]),

  // Patterns table - Business pattern recognition
  patterns: defineTable({
    userId: v.id("users"),
    patternType: v.string(), // From the 64 Business Patterns
    frequency: v.int64(), // How often it appears
    firstSeen: v.string(),
    lastSeen: v.string(),
    contexts: v.array(v.string()), // Where it shows up
    recommendation: v.string(), // What to do about it
  })
  .index("by_user", ["userId"])
  .index("by_pattern", ["patternType"]),
});