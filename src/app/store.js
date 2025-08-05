// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import landingPageReducer from "../features/landingPage/landingPageSlice";

export const store = configureStore({
  reducer: {
    landingPage: landingPageReducer,
  },
});