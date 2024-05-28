import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      Pages: path.resolve(__dirname, "./src/Pages"),
      Shared: path.resolve(__dirname, "./src/Shared"),
      assets: path.resolve(__dirname, "./src/assets"),
    },
  },
});
