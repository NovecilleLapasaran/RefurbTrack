import { MD3LightTheme } from 'react-native-paper';

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

// React Native Paper (MD3) theme, aligned with the tokens above.
export const paperTheme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0E5C3E',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E4EFE8',
    onPrimaryContainer: '#0B4A32',
    secondary: '#0E5C3E',
    background: '#F4F1E7',
    onBackground: '#1E2320',
    surface: '#FFFFFF',
    onSurface: '#1E2320',
    surfaceVariant: '#FBF9F1',
    onSurfaceVariant: '#7C7F76',
    outline: '#E7E2D3',
    outlineVariant: '#E7E2D3',
    error: '#B3261E',
    inverseSurface: '#1E2320',
    inverseOnSurface: '#F4F1E7',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FFFFFF',
      level3: '#FBF9F1',
      level4: '#FBF9F1',
      level5: '#FBF9F1',
    },
  },
};

export default theme;
