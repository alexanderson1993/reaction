import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    VitePWA({
      mode: "production",
      includeAssets: [
        "teko.json",
        "atom.glb",
        "wav/*.wav",
        "music/void.ogg",
        "assets/*",
        "assets/*.jpg",
        "assets/*.png",
        "assets/*.svg",
      ],
      registerType: "autoUpdate",
      base: "/",
      workbox: {
        globDirectory: "./dist",
        globPatterns: ["**/*.{js,css,html,png,jpg,ts,tsx}"],
      },
      manifest: {
        name: "Reaction",
        short_name: "Reaction",
        start_url: ".",
        display: "standalone",
        background_color: "#000",
        description: "A golf-style puzzle game of atomic destruction.",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
