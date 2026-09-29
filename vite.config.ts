import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: { "/api": { target: "https://mastersal.vercel.app", changeOrigin: true } } },
});
