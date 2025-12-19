import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#007A3D',      // Algeria green
        secondary: '#CE1126',    // Algeria red
        accent: '#0066CC',       // News blue
      },
    },
  },
  plugins: [],
};

export default config;
