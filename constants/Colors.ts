// EduSpark Brand Colors
export const COLORS = {
  // Primary Colors
  PRIMARY: '#00ADEF',      // Bright Blue
  SECONDARY: '#FFA500',    // Vibrant Orange
  ACCENT: '#FFD700',       // Lightning Yellow
  
  // Background Colors
  BACKGROUND_DARK: '#000000',
  BACKGROUND_DARK_BLUE: '#1a1a2e',
  BACKGROUND_NAVY: '#16213e',
  
  // Enhanced Background Colors
  BACKGROUND_DEEP_PURPLE: '#0F0F23',
  BACKGROUND_MIDNIGHT: '#1E1E2E',
  BACKGROUND_STEEL: '#2D2D44',
  BACKGROUND_OCEAN: '#1B2735',
  BACKGROUND_COSMIC: '#0B1426',
  
  // Text Colors
  TEXT_WHITE: '#FFFFFF',
  TEXT_GRAY_LIGHT: '#D1D5DB',
  TEXT_GRAY: '#9CA3AF',
  TEXT_GRAY_DARK: '#6B7280',
  
  // UI Colors
  BORDER_GRAY: '#374151',
  BORDER_GRAY_DARK: '#1F2937',
  OVERLAY_GRAY: '#111827',
  
  // Opacity Variants
  PRIMARY_OPACITY_30: 'rgba(0, 173, 239, 0.3)',
  SECONDARY_OPACITY_30: 'rgba(255, 165, 0, 0.3)',
  ACCENT_OPACITY_30: 'rgba(255, 215, 0, 0.3)',
  
  // Glow Effects
  PRIMARY_GLOW: 'rgba(0, 173, 239, 0.1)',
  SECONDARY_GLOW: 'rgba(255, 165, 0, 0.08)',
  ACCENT_GLOW: 'rgba(255, 215, 0, 0.05)',
  
  // Shadow Colors
  PRIMARY_SHADOW: 'rgba(0, 173, 239, 0.5)',
  SECONDARY_SHADOW: 'rgba(255, 165, 0, 0.5)',
  ACCENT_SHADOW: 'rgba(255, 215, 0, 0.5)',
} as const;

// Enhanced Gradient Colors
export const GRADIENTS = {
  // Professional Background Gradients
  BACKGROUND: [COLORS.BACKGROUND_DARK, COLORS.BACKGROUND_DEEP_PURPLE, COLORS.BACKGROUND_MIDNIGHT],
  BACKGROUND_ALT: [COLORS.BACKGROUND_COSMIC, COLORS.BACKGROUND_OCEAN, COLORS.BACKGROUND_STEEL],
  BACKGROUND_PREMIUM: [COLORS.BACKGROUND_DARK, COLORS.BACKGROUND_DARK_BLUE, COLORS.BACKGROUND_NAVY],
  
  // Brand Gradients
  BRAND: [COLORS.PRIMARY, COLORS.SECONDARY, COLORS.ACCENT],
  BRAND_REVERSE: [COLORS.ACCENT, COLORS.SECONDARY, COLORS.PRIMARY],
  
  // Logo Glow Gradients
  LOGO_GLOW: [COLORS.PRIMARY_GLOW, COLORS.SECONDARY_GLOW, COLORS.ACCENT_GLOW],
  
  // Special Effect Gradients
  AURORA: ['#667eea', '#764ba2', '#f093fb'],
  SUNSET: ['#fa709a', '#fee140', '#ff9a9e'],
  OCEAN: ['#4facfe', '#00f2fe', '#43e97b'],
  COSMIC: ['#a8edea', '#fed6e3', '#ffecd2'],
} as const; 