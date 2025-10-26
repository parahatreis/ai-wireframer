import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { clerkPubKey } from "./lib/clerk";
import "./lib/sentry";
import "./styles/tailwind.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <App />
  </ClerkProvider>
);

