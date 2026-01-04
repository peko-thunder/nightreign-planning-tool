import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nightreign: {
          bg: "#0a0a0f",
          dark: "#12121a",
          gold: "#c9a227",
          blue: "#3b82f6",
          red: "#ef4444",
          green: "#22c55e",
        },
      },
      fontFamily: {
        game: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
