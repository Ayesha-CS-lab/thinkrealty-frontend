import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './style/global.css';   // <-- Add this line
import { store } from "./app/store";
import { Provider } from "react-redux";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App /> {/* Assuming your router is inside App */}
    </Provider>
 </StrictMode>,
); 
