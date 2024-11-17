/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        5: "5px",
      },
      spacing: (() => {
        const spacing = {};
        for (let i = 0; i <= 100; i++) {
          spacing[i] = `${i * 0.25}rem`; // เช่น top-1 จะเป็น 0.25rem, top-2 เป็น 0.5rem
        }
        return spacing;
      })(),
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
