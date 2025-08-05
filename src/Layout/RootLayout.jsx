// src/layouts/RootLayout.jsx

import { Outlet } from "react-router-dom";
import ScrollToTop from "../utils/ScrollToTop"; // Adjust path if needed

export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
     
      <main>
        <Outlet />
      </main>
    </>
  );
}