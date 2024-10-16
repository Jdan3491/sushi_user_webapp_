/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A64744', // Rosso scuro
        secondary: '#FBE6D6', // Beige chiaro per lo sfondo
        accent: '#F3C16F', // Giallo/dorato per i pulsanti o dettagli
        highlight: '#F98B7A', // Rosso chiaro per interazioni
        neutral: '#DDB18D', // Marrone o crema per dettagli aggiuntivi
        white: '#FFFFFF', // Colore bianco per il testo principale
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'], // Font moderna e leggibile
      },
    },
  },
  plugins: [],
};
