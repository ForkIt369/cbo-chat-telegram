# Convex Database Integration for CBO Chat

This app now includes Convex database integration for session tracking and personalized RAG capabilities.

## Features

### 1. Session Tracking
- All conversations are stored with full history
- Messages are indexed for fast retrieval
- User profiles track business type and stage

### 2. Business Insights
- Automatic extraction of business patterns
- Challenge tracking with severity levels
- Progress monitoring across Four Flows

### 3. RAG Capabilities
- Personalized recommendations based on history
- Pattern recognition across conversations
- Similar challenge matching

## Setup

### 1. Create Convex Project

```bash
# Install Convex CLI globally
npm install -g convex

# Deploy to Convex
npx convex deploy
```

### 2. Update Environment Variables

Add your Convex deployment URL to `.env`:

```
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### 3. Database Schema

The schema includes:
- **users**: User profiles and business info
- **conversations**: Session grouping
- **messages**: Individual messages with embeddings
- **businessInsights**: Extracted insights and recommendations
- **flowMetrics**: Quantitative business metrics
- **challenges**: Business problem tracking
- **patterns**: Recurring pattern detection

## Usage

### Track Conversations

Conversations are automatically tracked when users interact with CBO Bro:

```typescript
const { saveMessage } = useConvexSession(user);

// Messages are saved automatically
await saveMessage('user', userMessage);
await saveMessage('assistant', botResponse);
```

### View Insights

User insights are displayed in the chat header:
- Active insights count
- Resolved challenges
- Progress indicators

### Query History

```typescript
// Get user's recent conversations
const conversations = await getUserConversations(userId);

// Get insights
const insights = await getActiveInsights(userId);

// Track metrics
await trackFlowMetric({
  userId,
  flowType: 'cash',
  metricName: 'MRR',
  value: 50000,
  unit: '$'
});
```

## Benefits

1. **Personalized Experience**: Every interaction builds the user's business profile
2. **Pattern Recognition**: Identify recurring challenges before they become critical
3. **Progress Tracking**: Visualize business improvement over time
4. **Contextual Responses**: CBO Bro references past conversations for better advice
5. **Accountability**: Track commitments and follow up automatically

## Future Enhancements

1. **Vector Embeddings**: Add OpenAI embeddings for semantic search
2. **Advanced Analytics**: Dashboard for business health visualization
3. **Peer Insights**: Anonymous pattern sharing across similar businesses
4. **Automated Follow-ups**: Proactive check-ins based on patterns
5. **Export Reports**: Generate business health reports