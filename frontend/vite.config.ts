import { defineConfig } from "vite";
import path from "path";

// import tailwindcss from '@tailwindcss/vite'
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 3030,
  },
  plugins: [react(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
