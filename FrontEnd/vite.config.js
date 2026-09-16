import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET || "http://127.0.0.1:9090",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4174,
    strictPort: false,
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET || "http://127.0.0.1:9090",
        changeOrigin: true,
      },
    },
  },
  build: { outDir: "dist" },
});
