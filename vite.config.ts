import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: '/study-spark-gather/', // this must match your repo name
  plugins: [react()],
resolve: {
    alias: {
      '@': '/src',  // Resolves '@' to the src directory
    },
  },
});
