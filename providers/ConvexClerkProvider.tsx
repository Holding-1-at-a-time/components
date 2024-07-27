"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React, { ReactNode } from "react";
import "./index.css";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("Missing Convex Public URL")
}

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string} appearance={{
    }}>
        ReactDOM.createRoot(document.getElementById("root")!).render (
        <React.StrictMode>
            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
                <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                    {children}
                </ConvexProviderWithClerk>
            </ClerkProvider>
        </React.StrictMode>
   </ClerkProvider >
);



export default ConvexClerkProvider;