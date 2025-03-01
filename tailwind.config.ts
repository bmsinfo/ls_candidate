import type { Config } from 'tailwindcss';

const colors = {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    light: 'hsl(var(--primary-light))',
    dodger: {
      DEFAULT: 'hsl(var(--primary-dodger))',
      light: 'hsl(var(--primary-dodger-light))',
    },
    'border-light': 'hsl(var(--primary-border-light))',
  },
  accent: {
    green: 'hsl(var(--accent-green))',
    red: {
      DEFAULT: 'hsl(var(--accent-red))',
      background: 'hsl(var(--accent-red-bg))',
    },
  },
  foreground: 'hsl(var(--foreground))',
  grayscale: {
    dark: {
      DEFAULT: 'hsl(var(--grayscale-dark))',
      secondary: 'hsl(var(--grayscale-dark-secondary))',
    },
    gray: {
      DEFAULT: 'hsl(var(--grayscale-gray))',
      light: 'hsl(var(--grayscale-gray-light))',
    },
    mid: {
      DEFAULT: 'hsl(var(--grayscale-mid))',
      secondary: 'hsl(var(--grayscale-mid-secondary))',
      light: 'hsl(var(--grayscale-mid-light))',
      lighter: 'hsl(var(--grayscale-mid-lighter))',
      highlight: 'hsl(var(--grayscale-mid-highlight))',
    },
    light: {
      DEFAULT: 'hsl(var(--grayscale-light))',
      secondary: 'hsl(var(--grayscale-light-secondary))',
      background: 'hsl(var(--grayscale-light-bg))',
      white: 'hsl(var(--grayscale-white))',
    },
  },
  background: {
    DEFAULT: 'hsl(var(--background))',
    light: {
      DEFAULT: 'hsl(var(--background-light))',
    },
    mid: 'hsl(var(--background-mid))',
    dark: 'hsl(var(--background-dark))',
    transparent: 'hsl(var(--background-transparent))',
    faded: 'hsl(var(--background-faded))',
  },
  highlight: {
    blue: {
      DEFAULT: 'hsl(var(--highlight-blue))',
    },
  },
};

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    // fontSize: {
    //   vvs: "8px",
    // },
    container: {
      center: true,
      // padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    backgroundImage: {
      robotAI: "url('/robot-ai.jpg')",
    },
    extend: {
      height: {
        header: 'calc(100vh - 83px)',
        'header-mb': 'calc(100dvh - 8rem)',
        'without-header': 'calc(100vh - 108px)',
      },
      screens: {
        // Width-based breakpoints
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        tablet: '802px',
        'tablet-lg': '865px',
        'tablet-xl': '944px',
        // Min-height only :  ex when height ≥ 768px
        'tall-xs': { raw: '(min-height: 480px)' },
        'tall-sm': { raw: '(min-height: 640px)' },
        'tall-md': { raw: '(min-height: 768px)' },
        'tall-lg': { raw: '(min-height: 1024px)' },
        'tall-xl': { raw: '(min-height: 1280px)' },

        // Max-height only  : when height ≤ 768px
        'short-xs': { raw: '(max-height: 480px)' },
        'short-sm': { raw: '(max-height: 640px)' },
        'short-md': { raw: '(max-height: 768px)' }, // target support layout
        'short-lg': { raw: '(max-height: 1024px)' },
        'short-xl': { raw: '(max-height: 1280px)' },

        // Height range (min and max)
        'h-sm-md': { raw: '(min-height: 640px) and (max-height: 768px)' },
        'h-md-lg': { raw: '(min-height: 768px) and (max-height: 1024px)' },

        // Width range (min and max)
        'w-m-xs': { raw: '(min-width: 240px) and (max-width: 468px)' },
        'w-m-sm ': { raw: '(min-width: 468px) and (max-width: 640px)' },
        'w-sm-md': { raw: '(min-width: 640px) and (max-width: 768px)' },
        'w-md-lg': { raw: '(min-width: 768px) and (max-width: 1024px)' },

        // Combined ranges (both height and width)
        'box-sm': {
          raw: '(min-width: 640px) and (max-width: 768px) and (min-height: 640px) and (max-height: 768px)',
        },
        'box-md': {
          raw: '(min-width: 768px) and (max-width: 1024px) and (min-height: 768px) and (max-height: 1024px)',
        },
        // Complex combinations
        landscape: { raw: '(max-height: 768px) and (min-width: 1024px)' },
        portrait: { raw: '(min-height: 1024px) and (max-width: 768px)' },
      },
      fontFamily: {
        robot: ['var(--font-roboto)'],
      },
      boxShadow: {
        custom: '0px 4px 10px 0px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'custom-gradient': 'var(--custom-gradient)',
      },
      backgroundBlendMode: {
        'custom-gradient': 'var(--custom-gradient-blend-mode)',
      },
      colors,
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius-2))',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
