import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The local API runs on port 3000, matching the reverse-proxy target in Caddyfile.
export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
});
