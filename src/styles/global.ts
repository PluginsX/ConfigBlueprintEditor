import { createGlobalStyle } from 'styled-components';
import theme from '../theme';

const GlobalStyles = createGlobalStyle`
  // 重置样式
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    font-family: ${theme.fonts.family};
    font-size: ${theme.fonts.sizes.md};
    color: ${theme.colors.textPrimary};
    background-color: ${theme.colors.background};
    line-height: 1.5;
  }

  // 滚动条样式
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.backgroundTertiary};
    border-radius: ${theme.borderRadius.md};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.borderSecondary};
  }

  // 按钮基础样式
  button {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
  }

  // 输入框基础样式
  input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
  }

  // 链接基础样式
  a {
    color: ${theme.colors.accent};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  // 标题基础样式
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.fonts.weights.bold};
    line-height: 1.2;
    margin-bottom: ${theme.spacing.md};
  }

  h1 { font-size: ${theme.fonts.sizes.xl}; }
  h2 { font-size: ${theme.fonts.sizes.lg}; }
  h3 { font-size: ${theme.fonts.sizes.md}; }
  h4 { font-size: ${theme.fonts.sizes.sm}; }
  h5 { font-size: ${theme.fonts.sizes.xs}; }
  h6 { font-size: ${theme.fonts.sizes.xs}; }

  // 段落基础样式
  p {
    margin-bottom: ${theme.spacing.md};
  }

  // 列表基础样式
  ul, ol {
    margin-bottom: ${theme.spacing.md};
    margin-left: ${theme.spacing.xl};
  }

  li {
    margin-bottom: ${theme.spacing.sm};
  }

  // 代码块基础样式
  code {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: ${theme.fonts.sizes.sm};
    background-color: ${theme.colors.backgroundSecondary};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    color: ${theme.colors.info};
  }

  pre {
    background-color: ${theme.colors.backgroundSecondary};
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${theme.spacing.md};
  }

  pre code {
    background-color: transparent;
    padding: 0;
  }
`;

export default GlobalStyles;