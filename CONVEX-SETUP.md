# Convex Setup Instructions for CBO Chat

Follow these steps to deploy your Convex database:

## Option 1: Interactive Setup (Recommended)

1. **Run the setup command**:
   ```bash
   cd /Users/digitaldavinci/Telegram\ Mini\ App\ Studio/docker-infrastructure/apps/cbo-chat
   npx convex dev --once --configure=new
   ```

2. **Follow the browser prompts**:
   - It will open your browser for authentication
   - Create a new Convex account or login
   - Create a new project named "cbo-chat"
   - Select your team/organization

3. **Get your deployment URL**:
   After setup, check `.env.local` file for your `CONVEX_URL`

4. **Update your .env file**:
   ```bash
   # Copy the URL from .env.local
   # Update VITE_CONVEX_URL in .env
   ```

## Option 2: Using Convex Dashboard

1. **Go to**: https://dashboard.convex.dev

2. **Create a new project**:
   - Click "New Project"
   - Name it "cbo-chat"
   - Select your region

3. **Get your deployment URL**:
   - Go to Settings → URL & Deploy Key
   - Copy the Deployment URL

4. **Update your .env**:
   ```
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   ```

5. **Deploy your functions**:
   ```bash
   npx convex deploy
   ```

## Option 3: CLI with Existing Account

If you already have a Convex account:

1. **Login to Convex**:
   ```bash
   npx convex login
   ```

2. **Deploy**:
   ```bash
   npx convex deploy --cmd "echo 'Deployed'" --cmd-url-env-var-name VITE_CONVEX_URL
   ```

## After Deployment

1. **Verify deployment**:
   ```bash
   npx convex dashboard
   ```

2. **Test locally**:
   ```bash
   npm run dev
   ```

3. **Push to GitHub**:
   ```bash
   git add .env
   git commit -m "Add Convex deployment URL"
   git push
   ```

## Troubleshooting

- If authentication fails, try clearing your browser cookies for convex.dev
- If deployment fails, check that all TypeScript files compile: `npm run build`
- For connection issues, ensure your firewall allows connections to *.convex.cloud

## Environment Variables

Your `.env` file should now have:
```
VITE_CONVEX_URL=https://your-actual-deployment.convex.cloud
```

## Next Steps

Once deployed:
1. Your app will automatically start tracking conversations
2. Business insights will be generated
3. RAG capabilities will be active
4. Check the Convex dashboard to see your data