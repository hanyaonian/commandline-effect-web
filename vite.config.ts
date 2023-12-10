import { defineConfig } from "vite";
import path from "path";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      fileName: "index",
      name: "TermnialComp",
      entry: path.resolve(__dirname, "src/index.ts"),
    },
    rollupOptions: {
      plugins: [typescript({ tsconfig: "./tsconfig.build.json" })],
    },
  },
  server: {
    port: 5173,
    open: "http://127.0.0.1:5173/demo/index.html",
  },
});
