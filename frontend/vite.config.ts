import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // server: {
  //   proxy: {
  //     "^/api/.*": {
  //       target: "http://localhost:3000",
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => {
  //         const p = path.replace(/^\/api/, "");
  //         return p;
  //       },
  //     },
  //   },
  // },
});
