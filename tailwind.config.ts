import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: "#0F2535", // azul petróleo
          accent: "#1DB9A0", // teal menta
          muted: "#E5EEF4"
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 10px 30px rgba(15,37,53,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
