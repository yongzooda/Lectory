// vite.config.js
import tailwind from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwind(),
    mode === "development" && screenGraphPlugin(),
  ].filter(Boolean),

  publicDir: "./static",
  base: "/",

  server: {
    proxy: {
      // React 개발 서버에서 /library 로 시작하는 모든 요청을
      // 백엔드(Spring Boot)로 포워딩
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/api/pay/ready": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ["jwt-decode"],
  },
}));
