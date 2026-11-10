/**
 * @file App.jsx
 * @description Root component that mounts routing and top-level providers for BloodLink AI.
 */

import React from "react";
import Routes from "./Routes";

/**
 * App Component
 * Serves as the root wrapper for application-wide routing and contextual state.
 *
 * @returns {JSX.Element} The rendered root application component with active routes.
 */
function App() {
  return (
    <Routes />
  );
}

export default App;
