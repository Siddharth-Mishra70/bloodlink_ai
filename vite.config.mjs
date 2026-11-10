/**
 * @file vite.config.mjs
 * @description Vite 5 build tool and development server configuration for BloodLink AI.
 * Sets up React Fast Refresh plugin, tsconfig/jsconfig path aliases, custom build directory,
 * and dev server host settings.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  // Configure build output directory and increase chunk size warning threshold
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  // Active Vite plugins: Path alias resolution, React JSX compiler, and DhiWise component tagger
  plugins: [tsconfigPaths(), react(), tagger()],
  // Local development server network options
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }
});
