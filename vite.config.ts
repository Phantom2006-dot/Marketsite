import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      // Explicitly mark node_modules as external if needed
      external: [],
      onwarn(warning, warn) {
        // Suppress the specific warning about Radix UI
        if (warning.code === 'MODULE_NOT_FOUND' && warning.id?.includes('@radix-ui')) {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-tooltip',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      // Add all Radix UI packages you're using
    ],
    esbuildOptions: {
      // Ensure ESbuild can handle these packages
      supported: {
        'top-level-await': true
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
