export const theme = {
  // Brand
  primary: '#0E5C3E', // Forest green (buttons, active tab, accents)
  primaryDark: '#0B4A32', // Hero profit card
  primarySoft: '#E4EFE8', // Tinted green fill
  secondary: '#0E5C3E',
  success: '#0E5C3E',
  warning: '#B7791F',
  error: '#B3261E',

  // Surfaces
  background: '#F4F1E7', // Cream app background
  surface: '#FFFFFF', // Card surface
  surfaceAlt: '#FBF9F1', // Softer card surface
  border: '#E7E2D3', // Hairline / chip border

  // Text
  text: '#1E2320',
  textMuted: '#7C7F76',
  textOnPrimary: '#FFFFFF',

  typography: {
    display: {
      fontSize: 40,
      fontWeight: '700',
      letterSpacing: -1,
    },
    h1: {
      fontSize: 26,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 19,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400',
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
    },
    caption: {
      fontSize: 13,
      fontWeight: '400',
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
    },
  },
  spacing: {
    xs: 6,
    small: 10,
    medium: 16,
    large: 24,
    xl: 32,
  },
  roundness: {
    small: 12,
    medium: 16,
    large: 22,
    pill: 999,
  },
};

export default theme;
