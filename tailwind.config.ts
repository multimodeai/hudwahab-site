import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#ff5f00",
        "n-50": "#fafafa",
        "n-100": "#f5f5f5",
        "n-200": "#e5e5e5",
        "n-300": "#d4d4d4",
        "n-400": "#a3a3a3",
        "n-500": "#737373",
        "n-600": "#525252",
        "n-900": "#171717",
      },
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "Plus Jakarta Sans",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        script: ["wreath", "cursive"],
      },
      boxShadow: {
        card: "0 1px 5px 3px rgba(0,0,0,0.05)",
        "card-hover": "0 3px 15px 3px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
