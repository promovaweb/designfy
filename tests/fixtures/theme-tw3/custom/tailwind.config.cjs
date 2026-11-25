/** Exposes representative Tailwind 3 colors backed by project CSS variables. */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { 500: "rgb(var(--primary-500) / <alpha-value>)", 950: "rgb(var(--primary-950) / <alpha-value>)" },
      },
    },
  },
};
