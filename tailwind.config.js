/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: "#0F3D2E",
          DEFAULT: "#155843",
          mid: "#1E6E54",
          soft: "#E4EFE9",
        },
        cream: {
          DEFAULT: "#FBF7EF",
          dim: "#F3ECDC",
          card: "#FFFDF8",
        },
        gold: {
          DEFAULT: "#C9A24B",
          soft: "#E8D9AE",
          dim: "#F1E8D0",
        },
        ink: {
          DEFAULT: "#1C2620",
          soft: "#5B6560",
          faint: "#9AA39C",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Manrope", "sans-serif"],
        arabic: ["Amiri", "serif"],
        "arabic-indopak": ["'Noto Naskh Arabic'", "serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(15, 61, 46, 0.18)",
        card: "0 4px 20px -6px rgba(15, 61, 46, 0.12)",
      },
      backgroundImage: {
        "emerald-gradient": "linear-gradient(160deg, #0F3D2E 0%, #1E6E54 100%)",
      },
    },
  },
  plugins: [],
};
