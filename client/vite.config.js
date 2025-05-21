import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

//SWITCH URL
const URL = [
  "https://blutape.net", //Server play [0]
  "http://192.168.100.53:5000", // office play [1]
  "http://192.168.1.123:5000", // home play [2]
  "http://127.0.0.1:5000", //all play [3]
];

const serverURL = URL[3];

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
