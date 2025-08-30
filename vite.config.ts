import { defineConfig } from "vitest/config";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    watch: {
      usePolling: true, // enable polling
      interval: 100, // check every 100ms
    },
    host: true, // allow container access
    port: 5173,
  },
});
