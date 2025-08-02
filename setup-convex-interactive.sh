#!/bin/bash

echo "🚀 CBO Chat - Convex Database Setup"
echo "==================================="
echo ""
echo "Since Convex requires browser authentication, I'll guide you through the process."
echo ""
echo "Step 1: Open a new terminal window"
echo "Step 2: Navigate to the project:"
echo "        cd '/Users/digitaldavinci/Telegram Mini App Studio/docker-infrastructure/apps/cbo-chat'"
echo ""
echo "Step 3: Run the Convex setup:"
echo "        npx convex dev --once --configure=new"
echo ""
echo "Step 4: When prompted in your browser:"
echo "        - Login or create a Convex account"
echo "        - Create a new project named 'cbo-chat'"
echo "        - Select your team"
echo ""
echo "Step 5: After setup completes, run this script to update your environment:"
echo ""
echo "Would you like me to wait and then update your .env file? (y/n)"
read -p "> " response

if [[ "$response" == "y" || "$response" == "Y" ]]; then
    echo ""
    echo "Great! Complete the steps above, then press Enter when done..."
    read
    
    # Check if .env.local was created
    if [ -f ".env.local" ]; then
        # Extract the Convex URL
        CONVEX_URL=$(grep "CONVEX_URL" .env.local | cut -d '=' -f2)
        
        if [ ! -z "$CONVEX_URL" ]; then
            echo ""
            echo "✅ Found Convex URL: $CONVEX_URL"
            
            # Update .env file
            if grep -q "VITE_CONVEX_URL" .env; then
                # Update existing line
                sed -i.bak "s|VITE_CONVEX_URL=.*|VITE_CONVEX_URL=$CONVEX_URL|" .env
                rm .env.bak
            else
                # Add new line
                echo "" >> .env
                echo "# Convex Database Configuration" >> .env
                echo "VITE_CONVEX_URL=$CONVEX_URL" >> .env
            fi
            
            echo "✅ Updated .env file with Convex URL"
            echo ""
            echo "Now deploying functions to Convex..."
            npx convex deploy -y
            
            echo ""
            echo "✅ Convex setup complete!"
            echo ""
            echo "Next steps:"
            echo "1. Commit your changes: git add .env && git commit -m 'Add Convex URL'"
            echo "2. Push to GitHub: git push"
            echo "3. DigitalOcean will automatically redeploy with Convex enabled"
            echo ""
            echo "Your app now has:"
            echo "- Full conversation history tracking"
            echo "- Business pattern recognition"
            echo "- Personalized RAG insights"
            echo "- Four Flows metrics tracking"
        else
            echo "❌ Could not find CONVEX_URL in .env.local"
        fi
    else
        echo "❌ .env.local not found. Please ensure you completed the Convex setup."
    fi
else
    echo ""
    echo "No problem! Run this script again after completing the Convex setup."
fi