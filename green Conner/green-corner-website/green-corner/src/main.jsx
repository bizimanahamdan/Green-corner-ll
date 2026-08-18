import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { AuthProvider } from "./lib/AuthContext";
import { LanguageProvider } from "./lib/i18n/LanguageContext";
import { ThemeProvider } from "./lib/ThemeContext";
import RootErrorBoundary from "./components/RootErrorBoundary";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <LanguageProvider>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    </RootErrorBoundary>
  </React.StrictMode>
);
