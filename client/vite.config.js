import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const URL = "http://127.0.0.1:8000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: URL,
        changeOrigin: true,
        secure: false,
      },
      "/create": {
        target: URL,
        changeOrigin: true,
        secure: false,
      },
      "/read": {
        target: URL,
        changeOrigin: true,
        secure: false,
      },
      "/update": {
        target: URL,
        changeOrigin: true,
        secure: false,
      },
      "/delete": {
        target: URL,
        changeOrigin: true,
        secure: false,
      },
      "/export": {
        target: URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
