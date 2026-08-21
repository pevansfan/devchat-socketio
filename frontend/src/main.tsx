import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { AuthProvider } from "@/provider/AuthProvider";
import { RoomProvider } from "./provider/RoomProvider";
import './index.css'

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <AuthProvider>
      <RoomProvider>
        <App />
      </RoomProvider>
    </AuthProvider>
  </React.StrictMode>,
);