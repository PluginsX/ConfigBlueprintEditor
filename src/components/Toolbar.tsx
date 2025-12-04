import React from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  background: #2d2d2d;
  border-bottom: 1px solid #444;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ToolbarButton = styled.button`
  background: #444;
  border: 1px solid #666;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #555;
  }
  
  &:active {
    background: #333;
  }
`;

const ToolbarTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: #fff;
`;

const Toolbar: React.FC = () => {
  return (
    <ToolbarContainer>
      <ToolbarTitle>蓝图编辑器</ToolbarTitle>
      <ToolbarButton>保存</ToolbarButton>
      <ToolbarButton>加载</ToolbarButton>
      <ToolbarButton>运行</ToolbarButton>
      <ToolbarButton>清除</ToolbarButton>
    </ToolbarContainer>
  );
};

export default Toolbar;
