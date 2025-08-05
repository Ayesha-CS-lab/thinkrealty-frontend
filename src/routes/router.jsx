import { createBrowserRouter } from "react-router-dom";
import LazyComponent from "./LazyComponent";
import NetworkErrorFallback from "../pages/errorScreen/ErrorScreen";
import NotFound from "../pages/errorScreen/NotFound";

import RootLayout from "../Layout/RootLayout"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NetworkErrorFallback />, 
    
    children: [
      {
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
    path: "*",
    element: <NotFound />,
  },
]);