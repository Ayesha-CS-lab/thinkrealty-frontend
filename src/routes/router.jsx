// your main router file, e.g., router.js

import { createBrowserRouter } from "react-router-dom";
import LazyComponent from "./LazyComponent";
import NetworkErrorFallback from "../pages/errorScreen/ErrorScreen";
import NotFound from "../pages/errorScreen/NotFound";

// --- Import your new layout component ---
import RootLayout from "../Layout/RootLayout"; // Adjust path if needed

export const router = createBrowserRouter([
  {
    // --- This is the new parent route ---
    path: "/",
    element: <RootLayout />,
    errorElement: <NetworkErrorFallback />, // Common error boundary for all child routes
    
    // --- Nest your page routes as children ---
    children: [
      {
        // 'index: true' makes this the default child route for the "/" path
        index: true, 
        element: <LazyComponent path="/" />,
      },
     
      {
        path: "preview",
        element: <LazyComponent path="/preview" />,
      },
    ]
  },
  {
    // The "Not Found" route can remain outside the main layout
    path: "*",
    element: <NotFound />,
  },
]);