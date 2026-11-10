/**
 * @file index.jsx
 * @description Application entry point for BloodLink AI.
 * Sets up the React 18 Concurrent Mode root and injects global styles.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

// Locate root DOM container element
const container = document.getElementById("root");

// Initialize React 18 concurrent root
const root = createRoot(container);

// Render top-level application component
root.render(<App />);
