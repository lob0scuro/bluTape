import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const serverURL = "https://blutape.net";

// https://vite.dev/config/
export default defineConfig({
  root: "./",
  plugins: [react()],
  mode: "production",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: false,
  },
  base: "/",
  server: {
    allowedHosts: ["https://www.blutape.net", "https://blutape.net"],
    proxy: {
      "/auth": {
        target: serverURL,
        changeOrigin: true,
        secure: true,
      },
      "/create": {
        target: serverURL,
        changeOrigin: true,
        secure: true,
      },
      "/read": {
        target: serverURL,
        changeOrigin: true,
        secure: true,
      },
      "/update": {
        target: serverURL,
        changeOrigin: true,
        secure: true,
      },
      "/delete": {
        target: serverURL,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
