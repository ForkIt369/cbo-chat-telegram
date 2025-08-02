import { ConvexReactClient } from "convex/react";

export interface RagInsight {
  type: 'pattern' | 'recommendation' | 'similar_challenge' | 'milestone';
  title: string;
  description: string;
  relevance: number;
  actionable: boolean;
}

// Service for generating personalized insights using RAG
export class RagInsightsService {
  // @ts-ignore - Will be used when database queries are implemented
  private convexClient: ConvexReactClient
  
  constructor(convexClient: ConvexReactClient) {
    this.convexClient = convexClient
  }

  // Analyze message for business insights
  async analyzeMessage(message: string, _userId: string): Promise<RagInsight[]> {
    const insights: RagInsight[] = [];

    // Pattern detection
    const patterns = this.detectBusinessPatterns(message);
    if (patterns.length > 0) {
      insights.push(...patterns.map(pattern => ({
        type: 'pattern' as const,
        title: `Pattern Detected: ${pattern.name}`,
        description: pattern.description,
        relevance: pattern.relevance,
        actionable: true,
      })));
    }

    // Check for similar challenges (would use vector search in production)
    if (message.toLowerCase().includes('revenue') || message.toLowerCase().includes('sales')) {
      insights.push({
        type: 'similar_challenge',
        title: 'Similar Challenge Found',
        description: 'Other businesses in your stage have faced similar revenue challenges. Common solution: Focus on customer retention before acquisition.',
        relevance: 0.8,
        actionable: true,
      });
    }

    // Milestone detection
    if (message.includes('increased') || message.includes('improved') || message.includes('achieved')) {
      insights.push({
        type: 'milestone',
        title: 'Potential Milestone Achieved! 🎉',
        description: 'This sounds like progress! Remember to track this win for future reference.',
        relevance: 0.9,
        actionable: false,
      });
    }

    return insights;
  }

  // Detect business patterns in text
  private detectBusinessPatterns(text: string): Array<{name: string, description: string, relevance: number}> {
    const patterns = [];
    const lowerText = text.toLowerCase();

    // Pattern: Growth Plateau
    if (lowerText.includes('stuck') || lowerText.includes('plateau') || lowerText.includes('not growing')) {
      patterns.push({
        name: 'Growth Plateau',
        description: 'Your business might be experiencing a growth plateau. This often happens when current strategies have reached their limit. Time to explore new channels or pivot your approach.',
        relevance: 0.9,
      });
    }

    // Pattern: Cash Flow Crunch
    if (lowerText.includes('cash flow') || lowerText.includes('runway') || lowerText.includes('burning')) {
      patterns.push({
        name: 'Cash Flow Crunch',
        description: 'Cash flow challenges detected. Focus on: 1) Accelerating receivables, 2) Negotiating payment terms, 3) Identifying quick revenue wins.',
        relevance: 0.95,
      });
    }

    // Pattern: Team Scaling Issues
    if (lowerText.includes('hiring') || lowerText.includes('team') || lowerText.includes('capacity')) {
      patterns.push({
        name: 'Team Scaling',
        description: 'Scaling team challenges identified. Consider: 1) Documenting processes first, 2) Hiring for culture fit, 3) Implementing proper onboarding.',
        relevance: 0.85,
      });
    }

    // Pattern: Customer Churn
    if (lowerText.includes('churn') || lowerText.includes('losing customers') || lowerText.includes('retention')) {
      patterns.push({
        name: 'Customer Churn',
        description: 'High churn rate pattern detected. Immediate actions: 1) Exit interviews with churned customers, 2) Implement health scoring, 3) Create win-back campaigns.',
        relevance: 0.92,
      });
    }

    return patterns;
  }

  // Get personalized recommendations based on history
  async getPersonalizedRecommendations(_userId: string): Promise<RagInsight[]> {
    // In production, this would query the vector database for similar patterns
    // and provide contextual recommendations based on user's history
    
    return [
      {
        type: 'recommendation',
        title: 'Weekly Business Health Check',
        description: 'Based on your conversation patterns, scheduling weekly reviews of your Four Flows metrics could help catch issues early.',
        relevance: 0.85,
        actionable: true,
      },
      {
        type: 'recommendation',
        title: 'Focus on Info Flow',
        description: "You haven't discussed data or analytics recently. Strong Info Flow is crucial for making informed decisions.",
        relevance: 0.75,
        actionable: true,
      },
    ];
  }

  // Generate contextual follow-up questions
  generateFollowUpQuestions(topic: string): string[] {
    const questions: Record<string, string[]> = {
      revenue: [
        "What's your current MRR/ARR?",
        "How has revenue trended over the last 3 months?",
        "What's your average deal size?",
        "Which revenue stream is most profitable?",
      ],
      team: [
        "How many team members do you currently have?",
        "What's your current hiring plan?",
        "Are there any culture challenges?",
        "How do you measure team productivity?",
      ],
      customer: [
        "What's your current churn rate?",
        "How do you measure customer satisfaction?",
        "What's your NPS score?",
        "How long is your sales cycle?",
      ],
      growth: [
        "What's your current growth rate?",
        "Which channels drive most growth?",
        "What's your CAC vs LTV ratio?",
        "What's blocking faster growth?",
      ],
    };

    // Find the best matching topic
    const topicKey = Object.keys(questions).find(key => 
      topic.toLowerCase().includes(key)
    ) || 'revenue';

    return questions[topicKey];
  }
}

// Helper function to extract business metrics from text
export function extractBusinessMetrics(text: string): Array<{metric: string, value: number, unit: string}> {
  const metrics = [];
  
  // Revenue patterns
  const revenueMatch = text.match(/\$?(\d+(?:,\d{3})*(?:\.\d+)?)[kKmM]?\s*(?:MRR|ARR|revenue)/i);
  if (revenueMatch) {
    let value = parseFloat(revenueMatch[1].replace(/,/g, ''));
    if (text.includes('k') || text.includes('K')) value *= 1000;
    if (text.includes('m') || text.includes('M')) value *= 1000000;
    
    metrics.push({
      metric: text.includes('MRR') ? 'MRR' : text.includes('ARR') ? 'ARR' : 'revenue',
      value,
      unit: '$',
    });
  }

  // Percentage patterns
  const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/g);
  if (percentMatch) {
    percentMatch.forEach(match => {
      const value = parseFloat(match.replace('%', ''));
      let metric = 'metric';
      
      if (text.includes('churn')) metric = 'churn_rate';
      else if (text.includes('growth')) metric = 'growth_rate';
      else if (text.includes('conversion')) metric = 'conversion_rate';
      
      metrics.push({ metric, value, unit: '%' });
    });
  }

  // Customer count patterns
  const customerMatch = text.match(/(\d+)\s*(?:customers?|users?|clients?)/i);
  if (customerMatch) {
    metrics.push({
      metric: 'customer_count',
      value: parseInt(customerMatch[1]),
      unit: 'count',
    });
  }

  return metrics;
}