/**
 * SHARED TAILWIND CONFIGURATION (CDN MODE)
 */

tailwind.config = {
    theme: {
        screens: {
            'sm': '481px',
            'md': '769px',
            'lg': '1025px',
            'xl': '1441px',
        },
        extend: {
            fontFamily: {
                urbanist: ['Urbanist', 'sans-serif'],
            },
            fontSize: {
                'h1': ['36px', { lineHeight: '44px' }],
                'h2': ['30px', { lineHeight: '38px' }],
                'h3': ['24px', { lineHeight: '32px' }],
                'body-lg': ['18px', { lineHeight: '28px' }],
                'body': ['16px', { lineHeight: '24px' }],
                'body-sm': ['14px', { lineHeight: '20px' }],
                'body-xs': ['12px', { lineHeight: '16px' }],
                'label': ['14px', { lineHeight: '18px' }],
                'overline': ['12px', { lineHeight: '16px' }],
                'button': ['14px', { lineHeight: '20px' }],
                'link': ['14px', { lineHeight: '20px' }],
                'h1-mobile': ['30px', { lineHeight: '38px' }],
                'h2-mobile': ['26px', { lineHeight: '32px' }],
                'h3-mobile': ['22px', { lineHeight: '28px' }],
                'h1-fluid': ['clamp(30px, 4vw, 36px)', { lineHeight: '1.2' }],
                'h2-fluid': ['clamp(26px, 3vw, 30px)', { lineHeight: '1.2' }],
                'h3-fluid': ['clamp(22px, 2.5vw, 24px)', { lineHeight: '1.2' }],
            },
            fontWeight: {
                'light': '300',
                'regular': '400',
                'medium': '500',
                'semibold': '600',
            },
            lineHeight: {
                'h1': '44px',
                'h2': '38px',
                'h3': '32px',
                'body': '24px',
                'body-lg': '28px',
                'body-sm': '20px',
                'body-xs': '16px',
                'label': '18px',
                'overline': '16px',
                'button': '20px',
                'link': '20px',
            },
            spacing: {
                'heading-top': '32px',
                'heading-bottom': '8px',
                'paragraph': '16px',
                '4': '4px',
                '8': '8px',
                '12': '12px',
                '16': '16px',
                '20': '20px',
                '24': '24px',
                '32': '32px',
                '40': '40px',
                '48': '48px',
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

                // New Glow shadow from reference
                'btn-glow': '0 20px 40px rgba(16, 185, 129, 0.22)',
            },
            transitionDuration: {
                '400': '400ms',
            },
            transitionTimingFunction: {
                'button-ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
            }
        }
    }
}
