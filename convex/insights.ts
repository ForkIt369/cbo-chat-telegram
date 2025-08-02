import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a business insight
export const createInsight = mutation({
  args: {
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    insightType: v.string(),
    category: v.string(),
    title: v.string(),
    description: v.string(),
    impact: v.string(),
    actionItems: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const insightId = await ctx.db.insert("businessInsights", {
      ...args,
      status: "new",
      createdAt: new Date().toISOString(),
    });

    return insightId;
  },
});

// Get user's active insights
export const getActiveInsights = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const insights = await ctx.db
      .query("businessInsights")
      .withIndex("by_user_status", (q) => 
        q.eq("userId", args.userId).eq("status", "new")
      )
      .collect();

    return insights.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

// Update insight status
export const updateInsightStatus = mutation({
  args: {
    insightId: v.id("businessInsights"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const updates: any = { status: args.status };
    
    if (args.status === "completed") {
      updates.completedAt = new Date().toISOString();
    }

    await ctx.db.patch(args.insightId, updates);
  },
});

// Track a challenge
export const trackChallenge = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    flowType: v.string(),
    severity: v.string(),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const challengeId = await ctx.db.insert("challenges", {
      userId: args.userId,
      title: args.title,
      description: args.description,
      flowType: args.flowType,
      severity: args.severity,
      status: "identified",
      identifiedAt: new Date().toISOString(),
      relatedConversations: [args.conversationId],
    });

    return challengeId;
  },
});

// Get user's challenges by status
export const getChallengesByStatus = query({
  args: { 
    userId: v.id("users"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("challenges")
      .withIndex("by_user_status", (q) => 
        q.eq("userId", args.userId).eq("status", args.status)
      )
      .collect();
  },
});

// Track flow metrics
export const trackFlowMetric = mutation({
  args: {
    userId: v.id("users"),
    flowType: v.string(),
    metricName: v.string(),
    value: v.float64(),
    unit: v.string(),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    // Get previous value to calculate trend
    const previousMetrics = await ctx.db
      .query("flowMetrics")
      .withIndex("by_user_metric", (q) => 
        q.eq("userId", args.userId).eq("metricName", args.metricName)
      )
      .collect();

    const sortedMetrics = previousMetrics.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    let trend = "stable";
    if (sortedMetrics.length > 0) {
      const lastValue = sortedMetrics[0].value;
      if (args.value > lastValue) trend = "up";
      else if (args.value < lastValue) trend = "down";
    }

    const metricId = await ctx.db.insert("flowMetrics", {
      ...args,
      timestamp: new Date().toISOString(),
      trend,
    });

    return metricId;
  },
});

// Get flow metrics summary
export const getFlowMetricsSummary = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const metrics = await ctx.db
      .query("flowMetrics")
      .withIndex("by_user_flow", (q) => q.eq("userId", args.userId))
      .collect();

    // Group by flow type
    const summary = metrics.reduce((acc, metric) => {
      if (!acc[metric.flowType]) {
        acc[metric.flowType] = {
          metrics: [],
          lastUpdated: metric.timestamp,
        };
      }
      
      acc[metric.flowType].metrics.push({
        name: metric.metricName,
        value: metric.value,
        unit: metric.unit,
        trend: metric.trend,
        timestamp: metric.timestamp,
      });

      // Update last updated if more recent
      if (new Date(metric.timestamp) > new Date(acc[metric.flowType].lastUpdated)) {
        acc[metric.flowType].lastUpdated = metric.timestamp;
      }

      return acc;
    }, {} as Record<string, any>);

    return summary;
  },
});