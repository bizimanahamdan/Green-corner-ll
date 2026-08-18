import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { pushDevPlugin } from "./vite-push-dev.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), pushDevPlugin(env)],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: true
    },
    preview: {
      host: true,
      port: 4173,
      strictPort: true,
      allowedHosts: true
    },
    build: {
      outDir: "dist",
      sourcemap: false
    }
  };
});
