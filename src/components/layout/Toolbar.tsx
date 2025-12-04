import React from 'react';
import styled from 'styled-components';
import { Button } from '../ui';
import theme from '../../theme';

const ToolbarContainer = styled.div`
  background: ${theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};
`;

const ToolbarTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fonts.sizes.lg};
  color: ${theme.colors.textPrimary};
`;

const Toolbar: React.FC = () => {
  return (
    <ToolbarContainer>
      <ToolbarTitle>蓝图编辑器</ToolbarTitle>
      <Button variant="primary">保存</Button>
      <Button>加载</Button>
      <Button variant="success">运行</Button>
      <Button variant="danger">清除</Button>
    </ToolbarContainer>
  );
};

export default Toolbar;
