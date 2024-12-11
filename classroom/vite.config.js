import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "pdfjs-dist/build/pdf.worker.min.js": "pdfjs-dist/build/pdf.worker.min.js",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ["pdfjs-dist"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["pdfjs-dist"],
    exclude: ["pdfjs-dist/build/pdf.worker"],
  },
});
