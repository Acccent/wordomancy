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
      display: ['Bluu Next Titling', ...defaultTheme.fontFamily.serif],
      spell: ['Bluu Next', ...defaultTheme.fontFamily.serif],
    },
    extend: {
      width: {
        '1/10': '10%',
      },
      maxWidth: {
        DEFAULT: '50rem',
      },
      dropShadow: {
        spell: '0 0 40px hsl(var(--a))',
      },
    },
  },
  daisyui: {
    styled: true,
    themes: [
      {
        wordomancy: {
          primary: 'hsl(34 93% 53%)',
          'primary-focus': 'hsl(34 100% 63%)',
          // 'primary-content': 'hsl(333 100% 55%)',
          secondary: 'hsl(44 93% 68%)',
          'secondary-focus': 'hsl(44 100% 78%)',
          // 'secondary-content': 'hsl(339 75% 75%)',
          accent: 'hsl(266 93% 83%)',
          'accent-focus': 'hsl(266 100% 83%)',
          // 'accent-content': 'hsl(39 90% 55%)',
          neutral: 'hsl(228 8% 40%)',
          'neutral-focus': 'hsl(228, 12%, 60%)',
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
          error: 'hsl(3 80% 60%)',
          // 'error-content': '#eb4768',
          '--rounded-box': '.4rem',
          '--rounded-btn': '.15rem',
          '--rounded-badge': '50%',
          '--animation-btn': '0.16s',
          '--animation-input': '0.12s',
          '--btn-text-case': 'uppercase',
          '--btn-focus-scale': '0.98',
          '--border-btn': '1px',
          '--tab-border': '2px',
          '--tab-radius': '.4rem',
          '--navbar-padding': '.25rem',
        },
      },
    ],
  },
};
