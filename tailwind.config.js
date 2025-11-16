/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // iOS System Colors - Light Mode
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          indigo: '#5856D6',
          orange: '#FF9500',
          pink: '#FF2D55',
          purple: '#AF52DE',
          red: '#FF3B30',
          teal: '#5AC8FA',
          yellow: '#FFCC00',
          // Grays
          gray: '#8E8E93',
          gray2: '#AEAEB2',
          gray3: '#C7C7CC',
          gray4: '#D1D1D6',
          gray5: '#E5E5EA',
          gray6: '#F2F2F7',
          // Label Colors
          label: '#000000',
          secondaryLabel: '#3C3C43',
          tertiaryLabel: '#3C3C43',
          // Fill Colors
          fillPrimary: '#78788033',
          fillSecondary: '#78788029',
          fillTertiary: '#7676801F',
          // Background Colors
          systemBackground: '#FFFFFF',
          secondarySystemBackground: '#F2F2F7',
          tertiarySystemBackground: '#FFFFFF',
          // Grouped Background
          groupedBackground: '#F2F2F7',
          secondaryGroupedBackground: '#FFFFFF',
          tertiaryGroupedBackground: '#F2F2F7',
        },
      },
      borderRadius: {
        'ios': '10px',
        'ios-lg': '13px',
        'ios-xl': '20px',
      },
      boxShadow: {
        'ios': '0 0 0 0.5px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 0 0 0.5px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.12)',
        'ios-button': '0 1px 2px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      spacing: {
        'ios-xs': '8px',
        'ios-sm': '12px',
        'ios-md': '16px',
        'ios-lg': '20px',
        'ios-xl': '24px',
        'ios-2xl': '32px',
      },
    },
  },
  plugins: [],
}
