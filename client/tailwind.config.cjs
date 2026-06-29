/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutrals
        'gray-900': '#2C2C2A',
        'gray-800': '#444441',
        'gray-400': '#888780',
        'gray-100': '#D3D1C7',
        'gray-50':  '#F1EFE8',

        // Blue — primary action
        'blue-900': '#042C53',
        'blue-800': '#0C447C',
        'blue-600': '#185FA5',
        'blue-400': '#378ADD',
        'blue-100': '#B5D4F4',
        'blue-50':  '#E6F1FB',

        // Semantic status
        'red-400':   '#E24B4A',
        'red-50':    '#FCEBEB',
        'red-800':   '#791F1F',
        'amber-400': '#EF9F27',
        'amber-50':  '#FAEEDA',
        'amber-800': '#633806',
        'green-600': '#639922',
        'green-50':  '#EAF3DE',
        'green-800': '#27500A',
        'teal-400':  '#1D9E75',
        'teal-50':   '#E1F5EE',

        // Heatmap intensity scale
        'heat-0': '#F1EFE8',
        'heat-1': '#E1F5EE',
        'heat-2': '#9FE1CB',
        'heat-3': '#EF9F27',
        'heat-4': '#E24B4A',

        // Kanban column dots
        'col-backlog':    '#B4B2A9',
        'col-inprogress': '#378ADD',
        'col-inreview':   '#EF9F27',
        'col-done':       '#639922',

        // Brand
        'brand-bg':   '#F1EFE8',
        'brand-dark': '#2C2C2A',
      },
    },
  },
  plugins: [],
}