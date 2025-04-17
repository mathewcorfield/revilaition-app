import { defineConfig } from "vite";
 import react from "@vitejs/plugin-react-swc";
 import path from "path";
 import { componentTagger } from "lovable-tagger";
 
 // https://vitejs.dev/config/
 export default defineConfig(({ mode }) => ({
   server: {
     host: "::",
     port: 8080,
   },
   base: '/study-spark-gather/',  // Set this to the name of your repository or subdirectory
   build: {
    outDir: 'dist',  // Ensure the build output is placed in the 'dist' directory
  },
   plugins: [
     react(),
     mode === 'development' &&
     componentTagger(),
   ].filter(Boolean),
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./src"),
     },
   },
 }));
