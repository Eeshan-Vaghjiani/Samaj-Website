module.exports = {
  content: [
    './*.html',
    './js/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Current brand colors from the CSS variables
        'navy': 'rgba(26, 26, 108, 0.85)',
        'navy-light': 'rgba(26, 26, 108, 0.05)',
        'navy-dark': 'rgba(20, 20, 80, 1)',
        'navy-medium': 'rgba(26, 26, 108, 0.5)',
        'red': 'rgba(230, 62, 62, 0.85)',
        'red-light': 'rgba(230, 62, 62, 0.1)',
        'red-dark': 'rgba(200, 40, 40, 1)',
        'yellow': 'rgba(255, 204, 0, 0.85)',
        'yellow-light': 'rgba(255, 204, 0, 0.1)',
        'yellow-dark': 'rgba(230, 180, 0, 1)',
        'green': 'rgba(18, 143, 71, 0.85)',
        'green-light': 'rgba(18, 143, 71, 0.05)',
        'green-dark': 'rgba(15, 120, 60, 1)',
        'light-gray': '#f8f9fa',
        'medium-gray': '#e9ecef',
        'dark-gray': '#343a40',
      },
      borderRadius: {
        'custom': '12px',
        'card': '16px',
      },
      boxShadow: {
        'custom': '0 10px 20px rgba(0,0,0,0.05)',
        'card': '0 5px 15px rgba(0,0,0,0.08)',
        'header': '0 2px 15px rgba(0,0,0,0.05)',
        'button': '0 5px 15px rgba(0,0,0,0.1)',
      },
      transitionProperty: {
        'custom': 'all 0.3s ease',
      },
      backdropBlur: {
        'custom': '10px',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      height: {
        'hero': '500px',
        'slide': '500px',
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      gridTemplateColumns: {
        'footer': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
      zIndex: {
        '-1': '-1',
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
    fontFamily: {
      sans: ['Segoe UI', 'Helvetica Neue', 'sans-serif'],
    },
  },
  plugins: [],
} 