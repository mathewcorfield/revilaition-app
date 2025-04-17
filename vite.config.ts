import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: '/study-spark-gather/', 
  plugins: [react()],
resolve: {
    alias: {
      '@': '/src',  // Resolves '@' to the src directory
    },
  },
});
