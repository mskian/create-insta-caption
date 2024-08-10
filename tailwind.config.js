/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#F472B6',
        background: '#F9FAFB',
        border: '#E5E7EB',
        text: '#111827',
        button: '#3B82F6',
        buttonHover: '#2563EB',
        error: '#EF4444',
        success: '#10B981',
      },
      fontFamily: {
        'sans': ['Hind Madurai', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
