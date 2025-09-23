import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tech: {
          primary: "oklch(0.72 0.17 210)", // 电光蓝青
          secondary: "oklch(0.68 0.16 260)", // 霓虹蓝紫
          accent: "oklch(0.78 0.14 180)",
          bg: "oklch(0.15 0.02 250)",
          fg: "oklch(0.98 0 0)",
        },
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(56,189,248,0.25), 0 0 24px rgba(56,189,248,0.22)",
        "neon-sm": "0 0 0 1px rgba(56,189,248,0.25), 0 0 12px rgba(56,189,248,0.18)",
      },
      backgroundImage: {
        "grid-radial":
          "radial-gradient(circle at 25% 10%, rgba(56,189,248,0.08), transparent 35%), radial-gradient(circle at 75% 20%, rgba(147,51,234,0.08), transparent 40%), radial-gradient(circle at 50% 90%, rgba(59,130,246,0.08), transparent 45%)",
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
} satisfies Config;


