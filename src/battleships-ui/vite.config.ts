import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint2";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    eslint({
      lintInWorker: true,
      lintOnStart: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: false,
    port: 3000,
  },
});
