// src/components/ScrollToTop.jsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  // Get the `pathname` object from the current location
  const { pathname } = useLocation();

  // This effect will run every time the `pathname` changes (i.e., on every route navigation)
  useEffect(() => {
    // Scroll the window to the top left corner
    window.scrollTo(0, 0);
  }, [pathname]); // The dependency array ensures this runs only when the URL path changes

  // This component doesn't render any visible UI
  return null;
}