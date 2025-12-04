import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 200px;
  background: #2d2d2d;
  border-right: 1px solid #444;
  padding: 16px;
  color: white;
`;

// 移除未使用的SidebarTitle组件

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

// 节点类型映射：侧边栏显示名称 -> 配置键名
const NODE_TYPE_MAPPING: Record<string, string> = {
  '开始': 'start',
  '条件': 'condition',
  '循环': 'loop',
  'While循环': 'while',
  'For循环': 'forloop',
  'Switch': 'switch',
  'ForEach': 'foreach',
  '字符串': 'string',
  '数字': 'number',
  '布尔值': 'boolean',
  '函数定义': 'function_define',
  '函数调用': 'function_call',
  '事件定义': 'event_define',
  '事件调用': 'event_call'
};

const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {
  const nodeTypes = [
    { category: '流程控制', nodes: ['开始', '条件', '循环', 'While循环', 'For循环', 'Switch', 'ForEach'] },
    { category: '变量', nodes: ['字符串', '数字', '布尔值'] },
    { category: '函数', nodes: ['函数定义', '函数调用'] },
    { category: '事件', nodes: ['事件定义', '事件调用'] },
  ];

  // 模拟当前蓝图中定义的State容器、函数、变量
  const currentStates = [
    { id: 'main', name: '主蓝图', type: 'state' },
    { id: 'function-1', name: '自定义函数1', type: 'function' },
    { id: 'function-2', name: '自定义函数2', type: 'function' },
  ];

  const currentVariables = [
    { id: 'var-1', name: '计数器', type: 'number' },
    { id: 'var-2', name: '用户名', type: 'string' },
    { id: 'var-3', name: '是否完成', type: 'boolean' },
  ];

  const handleAddNode = (nodeDisplayName: string) => {
    const nodeType = NODE_TYPE_MAPPING[nodeDisplayName];
    if (nodeType) {
      onAddNode(nodeType);
    }
  };

  const handleDoubleClickState = (stateId: string, stateName: string) => {
    // 这里应该实现双击打开对应State的逻辑
    console.log(`双击打开State: ${stateName} (${stateId})`);
  };

  const handleDoubleClickVariable = (variableId: string, variableName: string) => {
    // 这里应该实现双击使用变量的逻辑
    console.log(`双击使用变量: ${variableName} (${variableId})`);
  };

  return (
    <SidebarContainer>
      {/* 当前蓝图内容区域 */}
      <NodeCategory>
        <CategoryTitle>当前蓝图</CategoryTitle>
        {currentStates.map((state) => (
          <NodeButton
            key={state.id}
            onDoubleClick={() => handleDoubleClickState(state.id, state.name)}
            title={`双击打开 ${state.name}`}
          >
            {state.type === 'function' ? '📄' : '📋'} {state.name}
          </NodeButton>
        ))}
      </NodeCategory>

      {/* 变量区域 */}
      <NodeCategory>
        <CategoryTitle>变量</CategoryTitle>
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

      {/* 节点库区域 */}
      <NodeCategory>
        <CategoryTitle>节点库</CategoryTitle>
        {nodeTypes.map((category) => (
          <div key={category.category}>
            <CategoryTitle style={{ fontSize: '11px', marginTop: '8px' }}>
              {category.category}
            </CategoryTitle>
            {category.nodes.map((node) => (
              <NodeButton
                key={node}
                onClick={() => handleAddNode(node)}
              >
                {node}
              </NodeButton>
            ))}
          </div>
        ))}
      </NodeCategory>
    </SidebarContainer>
  );
};

export default Sidebar;
