/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Palette sampled directly from the Green Corner logo.
        leaf: {
          50: "#eefaf0",
          100: "#d7f2dc",
          400: "#1fb340",
          500: "#0fa02a",
          600: "#0c8a24",
          700: "#0a6f1d"
        },
        citrus: {
          400: "#ffab2e",
          500: "#f2960c",
          600: "#d97f00"
        },
        ink: {
          900: "#1a1a1a",
          800: "#242424",
          700: "#333333"
        },
        cream: "#efe7d6",
        mint: "#16140f",
        soot: "#0b0a08",
        paper: "rgb(var(--gc-text) / <alpha-value>)",
        mute: "rgb(var(--gc-muted) / <alpha-value>)",
        line: "rgb(var(--gc-line) / <alpha-value>)",
        char: {
          950: "rgb(var(--gc-bg) / <alpha-value>)",
          900: "rgb(var(--gc-surface) / <alpha-value>)",
          800: "rgb(var(--gc-elevated) / <alpha-value>)",
          700: "rgb(var(--gc-elevated-2) / <alpha-value>)"
        },
        ember: {
          500: "#f2960c",
          400: "#ffab2e",
          300: "#ffc266"
        },
        corner: {
          700: "#0a6f1d",
          600: "#0c8a24",
          500: "#0fa02a",
          200: "#d7f2dc"
        },
        gold: {
          400: "#ffab2e",
          300: "#ffc266"
        }
      },
      fontFamily: {
        display: ["Oswald", "Impact", "sans-serif"],
        body: ["Source Sans 3", "Segoe UI", "sans-serif"]
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-1.5deg)" },
          "50%": { transform: "translateY(-14px) rotate(1.5deg)" }
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(1deg)" },
          "50%": { transform: "translateY(-10px) rotate(-1deg)" }
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" }
        },
        modalIn: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "floatSlow 8s ease-in-out infinite",
        bob: "bob 3.5s ease-in-out infinite",
        spinSlow: "spinSlow 18s linear infinite",
        pulseSoft: "pulseSoft 4s ease-in-out infinite",
        modalIn: "modalIn 0.2s ease-out"
      }
    }
  },
  plugins: []
};
