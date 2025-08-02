import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useState } from "react";

// Create a conditional provider that only initializes Convex if URL is available
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convexClient, setConvexClient] = useState<ConvexReactClient | null>(null);
  
  useEffect(() => {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    
    if (convexUrl && convexUrl !== 'undefined' && convexUrl !== '') {
      console.log('[Convex] Initializing with URL:', convexUrl);
      try {
        const client = new ConvexReactClient(convexUrl);
        setConvexClient(client);
      } catch (error) {
        console.error('[Convex] Failed to initialize client:', error);
      }
    } else {
      console.warn('[Convex] No valid URL provided, running without database');
    }
  }, []);

  // If no Convex client, just render children without provider
  if (!convexClient) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}