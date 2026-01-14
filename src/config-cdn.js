/**
 * SHARED TAILWIND CONFIGURATION (CDN MODE)
 */

tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                urbanist: ['Urbanist', 'sans-serif'],
            },
            colors: {
                // page/default removed as requested
                'green-primary': '#03683D',
                'green-secondary': '#058C53',
                'green-hover-icons': '#BEE0D2',
                'green-hover-text': '#E3F1EB',
                'black': '#121212',
                'white': '#FCFCFC',
                'grey-primary': '#878787',
                'grey-secondary': '#D9D9D9',
                'grey-tertiary': '#EDEDED',
                'link-visited': '#4C1D95',
                'red-primary': '#B1242F',
                'red-secondary': '#C94A55',
            },
            boxShadow: {
                // Default: Uses 'grey-primary' (#878787)
                // Converted hex to rgba manually for shadow opacity
                'btn-default': '0 6px 14px rgba(135, 135, 135, 0.20)',

                // Hover: Uses 'green-hover-icons' (#BEE0D2) + 'grey-primary'
                'btn-hover': '0 18px 36px rgba(190, 224, 210, 0.40), 0 6px 18px rgba(135, 135, 135, 0.15)',

                // Active
                'btn-active': '0 4px 10px rgba(0, 0, 0, 0.2)',

                // Hover (Active): Green shadow
                'btn-hover-active': '0 4px 12px rgba(5, 140, 83, 0.2)',
            }
        }
    }
}
