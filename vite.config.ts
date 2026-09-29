import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: resolve(import.meta.dirname, ".vite"),
  server: {
    port: Number(process.env.VITE_PORT ?? 5173),
    strictPort: true,
    watch: process.env.DEV_WATCH === "0" ? { usePolling: true } : undefined,
    proxy: {
      "/api": { target: "https://mastersal.vercel.app", changeOrigin: true },
    },
  },
});
