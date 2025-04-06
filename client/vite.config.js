import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        // target: "https://blutape.net:8000",
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: true,
      },
      "/create": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: true,
      },
      "/read": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
