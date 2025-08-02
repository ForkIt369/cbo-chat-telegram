#!/bin/bash

echo "Setting up Convex deployment for CBO Chat..."
echo ""
echo "This script will:"
echo "1. Deploy your Convex functions"
echo "2. Get your deployment URL"
echo "3. Update your .env file"
echo ""
echo "Please follow the prompts in your browser to authenticate and create a project."
echo ""
echo "Press Enter to continue..."
read

# Run convex dev once to set up the project
npx convex dev --once

# Extract the deployment URL from .env.local
if [ -f ".env.local" ]; then
    CONVEX_URL=$(grep "CONVEX_URL" .env.local | cut -d '=' -f2)
    
    if [ ! -z "$CONVEX_URL" ]; then
        echo ""
        echo "✅ Convex deployment successful!"
        echo "Deployment URL: $CONVEX_URL"
        echo ""
        
        # Update .env file
        if grep -q "VITE_CONVEX_URL" .env; then
            # Update existing line
            sed -i.bak "s|VITE_CONVEX_URL=.*|VITE_CONVEX_URL=$CONVEX_URL|" .env
            rm .env.bak
        else
            # Add new line
            echo "VITE_CONVEX_URL=$CONVEX_URL" >> .env
        fi
        
        echo "✅ Updated .env file with Convex URL"
        echo ""
        echo "Next steps:"
        echo "1. Commit and push your changes"
        echo "2. The DigitalOcean deployment will automatically use the new Convex database"
        echo ""
        echo "To run Convex locally with live sync:"
        echo "npx convex dev"
    else
        echo "❌ Could not find Convex URL in .env.local"
        echo "Please check the setup and try again."
    fi
else
    echo "❌ .env.local file not found"
    echo "The Convex setup may have failed."
fi