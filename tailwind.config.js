/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: "#FFFFFF",
          surface: "#F5F5F7",
          surfaceHover: "#E8E8ED",
          border: "#D2D2D7",
          borderLight: "#E5E5EA",
          text: "#1D1D1F",
          secondary: "#6E6E73",
          tertiary: "#86868B",
          blue: "#0071E3",
          blueHover: "#0077ED",
          blueActive: "#0062C4",
          card: "rgba(255, 255, 255, 0.85)",
          danger: "#FF3B30",
          success: "#34C759",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        elevated: "0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        apple: "12px",
        "apple-lg": "18px",
        "apple-xl": "24px",
      },
    },
  },
  plugins: [],
}


