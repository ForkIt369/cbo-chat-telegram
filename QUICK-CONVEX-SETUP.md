# Quick Convex Setup for CBO Chat

## Option 1: Use Existing Convex Project (Fastest)

If you already have a Convex account and project:

1. **Get your deployment URL**:
   - Go to https://dashboard.convex.dev
   - Select your project (or create new one called "cbo-chat")
   - Go to Settings → URL & Deploy Key
   - Copy the **Deployment URL**

2. **Update your .env file**:
   ```bash
   # In the cbo-chat directory
   echo "VITE_CONVEX_URL=https://your-deployment.convex.cloud" >> .env
   ```

3. **Deploy the functions**:
   ```bash
   # Create .env.local with your deployment info
   echo "CONVEX_DEPLOYMENT=prod:your-project-name" > .env.local
   echo "CONVEX_URL=https://your-deployment.convex.cloud" >> .env.local
   
   # Deploy
   npx convex deploy -y
   ```

4. **Commit and push**:
   ```bash
   git add .env
   git commit -m "Add Convex deployment URL"
   git push
   ```

## Option 2: Create New Project (One Command)

Run this in a **new terminal window** (not in Claude Code):

```bash
cd '/Users/digitaldavinci/Telegram Mini App Studio/docker-infrastructure/apps/cbo-chat'
npx convex dev
```

Then:
1. Browser opens → Login/Signup
2. Choose "Create new project"
3. Name it "cbo-chat"
4. Press Ctrl+C to stop after it says "Watching for changes"

Your Convex URL will be in `.env.local` - copy it to `.env` as `VITE_CONVEX_URL`

## Option 3: Manual Setup

1. **Create account**: https://dashboard.convex.dev/signup
2. **Create project**: Click "New Project" → Name: "cbo-chat"
3. **Get URL**: Settings → URL & Deploy Key
4. **Update .env**: Add `VITE_CONVEX_URL=your-url`
5. **Run**: `npx convex deploy`

## Verify It Works

After setup, check:
- https://dashboard.convex.dev → Your project → Data
- You should see 7 tables (users, conversations, messages, etc.)

## That's it! 🚀

Your app now tracks everything and provides personalized business insights!