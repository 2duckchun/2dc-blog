import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'
const { spacing } = require('tailwindcss/defaultTheme')

const config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      height: {
        header: 'var(--header)'
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'sans-serif']
      },
      textShadow: {
        bounce: `0 1px 0 #CCC,
                 0 2px 0 #CCC,
                 0 3px 0 #CCC,
                 0 4px 0 #CCC,
                 0 5px 0 transparent,
                 0 6px 0 transparent,
                 0 7px 0 transparent,
                 0 8px 0 transparent,
                 0 9px 10px rgba(0, 0, 0, .4)`,

        sm: '1px 1px 2px var(--tw-shadow-color)',
        DEFAULT: '2px 2px 4px var(--tw-shadow-color)',
        lg: '4px 4px 8px var(--tw-shadow-color)',
        xl: '4px 4px 16px var(--tw-shadow-color)'
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'bounce-bounce': {
          '0%': { top: '0' },
          '100%': {
            top: '-10px',
            'text-shadow': `0 1px 0 #CCC,
            0 2px 0 #CCC,
            0 3px 0 #CCC,
            0 4px 0 #CCC,
            0 5px 0 #CCC,
            0 6px 0 #CCC,
            0 7px 0 #CCC,
            0 8px 0 #CCC,
            0 9px 0 #CCC,
            0 20px 8px rgba(0, 0, 0, .2)`
          }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            //...
            'h1,h2,h3,h4': {
              'scroll-margin-top': spacing[20]
            },
            code: {
              color: '#e33f47',
              'font-weight': '500'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            a: {
              color: '#0000FF',
              'text-decoration': 'underline'
            }
          }
        }
      }),
      animation: {
        'bounce-bounce': 'bounce-bounce 0.3s ease infinite alternate',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value
          })
        },
        {
          values: theme('textShadow')
        }
      )
    }),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            }
          }
        },
        {
          values: theme('transitionDelay')
        }
      )
    })
  ]
} satisfies Config

export default config
