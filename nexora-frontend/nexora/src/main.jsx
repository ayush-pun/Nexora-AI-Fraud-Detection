import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { SidebarProvider } from "./context/SidebarContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>

      <SidebarProvider>
        <App />
      </SidebarProvider>

    </QueryClientProvider>
  </React.StrictMode>
);