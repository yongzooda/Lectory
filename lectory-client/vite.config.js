import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && screenGraphPlugin()],
  publicDir: "./static",
  base: "./",
}));
