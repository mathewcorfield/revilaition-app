import { defineConfig } from "vite";
 import react from "@vitejs/plugin-react";
 import path from "path";
 
 // https://vitejs.dev/config/
 export default defineConfig(({ mode }) => ({
   server: {
     host: "::",
     port: 8080,
   },
   base: '/',  
   build: {
    outDir: 'dist',  // Ensure the build output is placed in the 'dist' directory
  },
   plugins: [
     react(),
     mode === 'development'
   ].filter(Boolean),
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./src"),
     },
   },
 }));
