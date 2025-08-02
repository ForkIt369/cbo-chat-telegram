import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new conversation
export const createConversation = mutation({
  args: {
    userId: v.id("users"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversationId = await ctx.db.insert("conversations", {
      userId: args.userId,
      sessionId: args.sessionId,
      startedAt: new Date().toISOString(),
      resolved: false,
    });

    return conversationId;
  },
});

// Add a message to conversation
export const addMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    role: v.string(),
    content: v.string(),
    keywords: v.optional(v.array(v.string())),
    flowMentions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      userId: args.userId,
      role: args.role,
      content: args.content,
      timestamp: new Date().toISOString(),
      keywords: args.keywords,
      flowMentions: args.flowMentions,
    });

    return messageId;
  },
});

// Get conversation messages
export const getConversationMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    return messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  },
});

// Update conversation metadata
export const updateConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    topic: v.optional(v.string()),
    sentiment: v.optional(v.string()),
    primaryFlow: v.optional(v.string()),
    resolved: v.optional(v.boolean()),
    endedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { conversationId, ...updates } = args;
    await ctx.db.patch(conversationId, updates);
  },
});

// Get user's recent conversations
export const getUserConversations = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort by most recent first
    const sorted = conversations.sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    return args.limit ? sorted.slice(0, args.limit) : sorted;
  },
});

// Get active conversation for session
export const getActiveConversation = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) => q.eq(q.field("resolved"), false))
      .first();

    return conversation;
  },
});