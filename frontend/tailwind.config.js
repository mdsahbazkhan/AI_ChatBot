/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{jsx,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'gray-900': '#111827',
        'gray-800': '#1f2937',
        'gray-700': '#374151',
        'gray-600': '#4b5563',
        'gray-500': '#6b7280',
        'gray-400': '#9ca3af',
        'gray-300': '#d1d5db',
        'gray-200': '#e5e7eb',
        'gray-100': '#f3f4f6',
        'blue-500': '#3b82f6',
        'blue-600': '#2563eb',
        'blue-700': '#1d4ed8',
      },
    },
  },
  plugins: [],
}