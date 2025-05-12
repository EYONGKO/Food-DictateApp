import { Platform, StyleSheet } from 'react-native';

/**
 * Creates styles that are only applied on web platform
 * @param webStyles Styles to apply only on web
 * @returns StyleSheet object with conditional web styles
 */
export const createWebStyles = (webStyles: Record<string, any>) => {
  if (Platform.OS !== 'web') {
    return {};
  }
  
  return StyleSheet.create(webStyles);
};

/**
 * Common web-specific styles that can be reused across components
 */
export const commonWebStyles = createWebStyles({
  // Card styles with better web shadows
  card: {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
  },
  cardHover: {
    boxShadow: '0 7px 14px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
  },
  
  // Button styles with hover effects
  button: {
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  buttonHover: {
    opacity: 0.9,
    transform: 'translateY(-1px)',
  },
  
  // Input styles
  input: {
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  inputFocus: {
    borderColor: '#22C55E',
  },
  
  // Responsive layout helpers
  responsiveContainer: {
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
  
  // Grid layout for web
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  
  // Flex layout improvements for web
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // Scrollbar styling
  customScrollbar: {
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#a8a8a8',
    },
  },
});
