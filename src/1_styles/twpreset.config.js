const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '960px',
    },
    container: {
      center: true,
    },
    fontFamily: {
      sans: ['Amulya', ...defaultTheme.fontFamily.sans],
      serif: ['Bluu Next', ...defaultTheme.fontFamily.serif],
      mono: ['Source Code Pro', ...defaultTheme.fontFamily.mono],
      display: ['Bluu Next Titling', ...defaultTheme.fontFamily.serif],
      spell: ['Bluu Next', ...defaultTheme.fontFamily.serif],
    },
    extend: {
      height: {
        'screen-w/o-nav': 'calc(100vh - var(--navbar-height) - 2rem)',
      },
      width: {
        '9%': '9%',
        '10%': '10%',
        list: '36rem',
      },
      maxWidth: {
        DEFAULT: '50rem',
      },
      dropShadow: {
        spell: '0 0 2.5rem hsl(var(--a))',
      },
    },
  },
  daisyui: {
    styled: true,
    themes: [
      {
        wordomancy: {
          primary: 'hsl(36 100% 60%)',
          'primary-focus': 'hsl(36 90% 50%)',
          // 'primary-content': 'hsl(333 100% 55%)',
          secondary: 'hsl(26 96% 70%)',
          'secondary-focus': 'hsl(26 88% 62%)',
          // 'secondary-content': 'hsl(339 75% 75%)',
          accent: 'hsl(266 96% 82%)',
          'accent-focus': 'hsl(266 86% 75%)',
          // 'accent-content': 'hsl(39 90% 55%)',
          neutral: 'hsl(228 10% 50%)',
          'neutral-focus': 'hsl(228, 14%, 70%)',
          // 'neutral-content': 'hsl(228, 8%, 41%)',
          'base-100': 'hsl(228 50% 8%)',
          // 'base-200': 'hsl(228 50% 8%)',
          // 'base-300': 'hsl(228 50% 8%)',
          'base-content': 'hsl(333 27% 97%)',
          info: 'hsl(180 70% 65%)',
          // 'info-content': '#6ee5f7',
          success: 'hsl(150 80% 60%)',
          // 'success-content': '#47ebaf',
          warning: 'hsl(40 80% 70%)',
          // 'warning-content': '#f9cf86',
          error: 'hsl(2 75% 75%)',
          // 'error-content': '#eb4768',
          '--rounded-box': '.4rem',
          '--rounded-btn': '.15rem',
          '--rounded-badge': '50%',
          '--animation-btn': '0.16s',
          '--animation-input': '0.12s',
          '--btn-text-case': 'uppercase',
          '--btn-focus-scale': '0.98',
          '--border-btn': '0.0625rem',
          '--tab-border': '0.125rem',
          '--tab-radius': '.4rem',
          '--navbar-padding': '.25rem',
        },
      },
    ],
  },
};
