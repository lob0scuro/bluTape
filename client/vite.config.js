import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

//SWITCH URL[0] TO IP OF LAPTOP
const URL = ["http://192.168.1.123:5000", "https://blutape.net"];

const serverURL = URL[0];

// https://vite.dev/config/
export default defineConfig({
  // root: "./",
  plugins: [react()],
  // mode: "production",
  // build: {
  //   outDir: "../dist",
  //   emptyOutDir: true,
  //   assetsDir: "assets",
  //   sourcemap: false,
  // },
  // base: "/",
  server: {
    // allowedHosts: ["https://www.blutape.net", "https://blutape.net"],
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
