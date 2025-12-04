import React from 'react';
import styled from 'styled-components';
import { NODE_TYPES_CONFIG } from '../types/NodeTypes';

const SidebarContainer = styled.div`
  width: 200px;
  background: #2d2d2d;
  border-right: 1px solid #444;
  padding: 16px;
  color: white;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  flex-shrink: 0;
  
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1e1e1e;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
`;

const NodeCategory = styled.div`
  margin-bottom: 16px;
`;

const CategoryTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #999;
`;

const NodeButton = styled.button`
  width: 100%;
  background: #444;
  border: 1px solid #666;
  color: white;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  text-align: left;
  
  &:hover {
    background: #555;
  }
  
  &:active {
    background: #333;
  }
`;

interface SidebarProps {
  onAddNode: (nodeType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {

  // 模拟当前蓝图中定义的State容器（事件图表）、函数、变量
  const currentStates = [
    { id: 'main', name: '主事件图表', type: 'event' },
    { id: 'event-1', name: '玩家进入事件', type: 'event' },
    { id: 'event-2', name: '游戏结束事件', type: 'event' },
  ];

  const currentVariables = [
    { id: 'var-1', name: '计数器', type: 'number' },
    { id: 'var-2', name: '用户名', type: 'string' },
    { id: 'var-3', name: '是否完成', type: 'boolean' },
  ];

  const currentFunctions = [
    { id: 'func-1', name: '初始化游戏', type: 'function' },
    { id: 'func-2', name: '计算分数', type: 'function' },
    { id: 'func-3', name: '显示消息', type: 'function' },
  ];

  const handleDoubleClickState = (stateId: string, stateName: string) => {
    // 这里应该实现双击打开对应事件图表的逻辑
    console.log(`双击打开事件图表: ${stateName} (${stateId})`);
  };

  const handleDoubleClickVariable = (variableId: string, variableName: string) => {
    // 这里应该实现双击使用变量的逻辑
    console.log(`双击使用变量: ${variableName} (${variableId})`);
  };

  const handleDoubleClickFunction = (functionId: string, functionName: string) => {
    // 这里应该实现双击打开函数编辑窗口的逻辑
    console.log(`双击打开函数: ${functionName} (${functionId})`);
  };

  // 节点类型分类
  const nodeCategories = {
    '事件节点': ['start', 'event_define', 'event_call'],
    '流程控制': ['condition', 'loop', 'while', 'forloop', 'switch', 'foreach'],
    '函数节点': ['function_define', 'function_call'],
    '变量节点': ['string', 'number', 'boolean', 'array'],
    '数值运算': ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power'],
    '比较运算': ['equal', 'not_equal', 'greater', 'less', 'greater_or_equal', 'less_or_equal'],
    '逻辑运算': ['and', 'or', 'not']
  };

  return (
    <SidebarContainer>
      {/* 节点类型选择区域 */}
      {Object.entries(nodeCategories).map(([category, nodeTypes]) => (
        <NodeCategory key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          {nodeTypes.map(nodeType => {
            const config = NODE_TYPES_CONFIG[nodeType];
            if (!config) return null;
            
            return (
              <NodeButton
                key={nodeType}
                onClick={() => onAddNode(nodeType)}
                title={`添加 ${config.label} 节点`}
                style={{ 
                  borderLeft: `4px solid ${config.color}`,
                  background: '#444'
                }}
              >
                {config.label}
              </NodeButton>
            );
          })}
        </NodeCategory>
      ))}

      {/* 事件图表蓝图容器区域 */}
      <NodeCategory>
        <CategoryTitle>事件图表</CategoryTitle>
        {currentStates.map((state) => (
          <NodeButton
            key={state.id}
            onDoubleClick={() => handleDoubleClickState(state.id, state.name)}
            title={`双击打开 ${state.name}`}
          >
            📋 {state.name}
          </NodeButton>
        ))}
      </NodeCategory>

      {/* 当前蓝图中的函数区域 */}
      <NodeCategory>
        <CategoryTitle>当前蓝图函数</CategoryTitle>
        {currentFunctions.map((func) => (
          <NodeButton
            key={func.id}
            onDoubleClick={() => handleDoubleClickFunction(func.id, func.name)}
            title={`双击编辑函数 ${func.name}`}
          >
            📄 {func.name}
          </NodeButton>
        ))}
      </NodeCategory>

      {/* 当前蓝图中的变量区域 */}
      <NodeCategory>
        <CategoryTitle>当前蓝图变量</CategoryTitle>
        {currentVariables.map((variable) => (
          <NodeButton
            key={variable.id}
            onDoubleClick={() => handleDoubleClickVariable(variable.id, variable.name)}
            title={`双击使用变量 ${variable.name}`}
          >
            {variable.type === 'number' ? '🔢' : 
             variable.type === 'string' ? '📝' : '✅'} {variable.name}
          </NodeButton>
        ))}
      </NodeCategory>
    </SidebarContainer>
  );
};

export default Sidebar;
