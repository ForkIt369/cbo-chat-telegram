import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create user
export const getOrCreateUser = mutation({
  args: {
    telegramId: v.string(),
    firstName: v.string(),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_telegram_id", (q) => q.eq("telegramId", args.telegramId))
      .first();

    if (existingUser) {
      // Update last active time
      await ctx.db.patch(existingUser._id, {
        lastActiveAt: new Date().toISOString(),
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      telegramId: args.telegramId,
      firstName: args.firstName,
      lastName: args.lastName,
      username: args.username,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    });

    return userId;
  },
});

// Get user by telegram ID
export const getUserByTelegramId = query({
  args: { telegramId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_telegram_id", (q) => q.eq("telegramId", args.telegramId))
      .first();
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    businessType: v.optional(v.string()),
    businessStage: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    await ctx.db.patch(userId, updates);
  },
});

// Get user insights summary
export const getUserInsightsSummary = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const [totalInsights, activeInsights, completedChallenges] = await Promise.all([
      ctx.db
        .query("businessInsights")
        .withIndex("by_user_status", (q) => q.eq("userId", args.userId))
        .collect()
        .then((insights) => insights.length),
      
      ctx.db
        .query("businessInsights")
        .withIndex("by_user_status", (q) => 
          q.eq("userId", args.userId).eq("status", "new")
        )
        .collect()
        .then((insights) => insights.length),
      
      ctx.db
        .query("challenges")
        .withIndex("by_user_status", (q) => 
          q.eq("userId", args.userId).eq("status", "resolved")
        )
        .collect()
        .then((challenges) => challenges.length),
    ]);

    return {
      totalInsights,
      activeInsights,
      completedChallenges,
    };
  },
});