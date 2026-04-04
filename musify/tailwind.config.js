/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#07090e',
        s1:      '#0d1018',
        s2:      '#141820',
        s3:      '#1c2330',
        accent:  '#e8ff47',
        accent2: '#c5da2a',
        pink:    '#ff4e8e',
        blue:    '#4da3ff',
        purple:  '#9b5de5',
        tx:      '#edf0f7',
        tx2:     '#7e8898',
        tx3:     '#3d4455',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm:   ['DM Sans', 'sans-serif'],
      },
      animation: {
        blink:  'blink 1.8s ease-in-out infinite',
        spin:   'spin 0.7s linear infinite',
        bar1:   'barAnim 0.8s ease-in-out infinite',
        bar2:   'barAnim 0.8s ease-in-out infinite 0.15s',
        bar3:   'barAnim 0.8s ease-in-out infinite 0.3s',
      },
      keyframes: {
        blink:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
        barAnim: { '0%,100%': { height: '4px' }, '50%': { height: '14px' } },
      },
    },
  },
  plugins: [],
}
