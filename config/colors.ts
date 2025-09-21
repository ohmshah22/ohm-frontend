// Aarogya Sahayak Color Palette
export const colors = {
  // Primary Colors - Health & Wellness Theme
  primary: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Main primary
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  
  // Secondary Colors - Trust & Care
  secondary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Main secondary
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // Accent Colors
  accent: {
    orange: '#FF9800',
    amber: '#FFC107',
    teal: '#009688',
    purple: '#9C27B0',
  },
  
  // Status Colors
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  
  // Neutral Colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F1F3F4',
    dark: '#121212',
  },
  
  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
  
  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
  
  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
};

// Gradient Colors
export const gradients = {
  primary: ['#4CAF50', '#2E7D32'],
  secondary: ['#2196F3', '#1565C0'],
  health: ['#4CAF50', '#81C784'],
  care: ['#2196F3', '#64B5F6'],
  warning: ['#FF9800', '#F57C00'],
  success: ['#4CAF50', '#66BB6A'],
};

// Theme Colors for different sections
export const themeColors = {
  dashboard: colors.primary[500],
  vitals: colors.secondary[500],
  reminders: colors.accent.orange,
  healthWorkers: colors.accent.teal,
  profile: colors.accent.purple,
};
