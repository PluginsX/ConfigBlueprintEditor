// 样式主题配置

// 颜色变量
export const colors = {
  // 背景色
  background: '#1e1e1e',
  backgroundSecondary: '#2d2d2d',
  backgroundTertiary: '#444',
  
  // 边框色
  border: '#444',
  borderSecondary: '#666',
  
  // 文字颜色
  textPrimary: '#ffffff',
  textSecondary: '#ccc',
  textTertiary: '#999',
  
  // 强调色
  accent: '#007acc',
  accentHover: '#0066aa',
  
  // 功能颜色
  success: '#4CAF50',
  successHover: '#45a049',
  danger: '#FF6B6B',
  dangerHover: '#FF5252',
  warning: '#FFD700',
  info: '#4ECDC4',
  
  // 节点颜色
  nodePrimary: '#007acc',
  nodeSecondary: '#4ECDC4',
  nodeTertiary: '#FFD700',
};

// 字体配置
export const fonts = {
  family: 'Segoe UI, Arial, sans-serif',
  sizes: {
    xs: '11px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '20px',
  },
  weights: {
    normal: 400,
    bold: 600,
  },
};

// 间距配置
export const spacing = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '20px',
};

// 边框圆角配置
export const borderRadius = {
  sm: '2px',
  md: '3px',
  lg: '4px',
  xl: '8px',
};

// 阴影配置
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 2px 4px rgba(0, 0, 0, 0.4)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.5)',
};

// 动画配置
export const animations = {
  duration: {
    fast: '0.1s',
    normal: '0.2s',
    slow: '0.3s',
  },
  ease: 'ease',
};

// 完整主题配置
export const theme = {
  colors,
  fonts,
  spacing,
  borderRadius,
  shadows,
  animations,
};

export default theme;