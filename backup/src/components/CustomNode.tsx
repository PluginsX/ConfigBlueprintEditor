import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styled from 'styled-components';
import { NODE_TYPES_CONFIG } from '../types/NodeTypes';

// UE蓝图风格节点容器 - 带彩色标题栏
const NodeContainer = styled.div.withConfig({ shouldForwardProp: (prop) => prop !== 'nodeType' })<{ nodeType: string }>`
  min-width: 180px;
  background: #2A2A2A;
  color: white;
  border: 1px solid #404040;
  border-radius: 1px; /* 统一为更尖锐的圆角 */
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5), 
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  transition: box-shadow 0.15s ease, transform 0.15s ease; /* 仅对非描边属性进行过渡 */
  overflow: visible;
  
  /* 选中状态 - 金色描边高亮（固定宽度） */
  &[data-selected="true"] {
    border-color: #FFD700;
    box-shadow: 0 0 0 2px #FFD700, 0 3px 15px rgba(0, 0, 0, 0.5), 
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
  
  /* 鼠标悬停状态 - 非选中节点 */
  &:not([data-selected="true"]):hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6), 
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  
  /* 鼠标悬停状态 - 选中节点（保持固定宽度的金色描边） */
  &[data-selected="true"]:hover {
    box-shadow: 0 0 0 2px #FFD700, 0 5px 15px rgba(0, 0, 0, 0.6), 
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
`;

// 节点类型图标（使用CSS绘制简单图标）
const NodeIcon = styled.div.withConfig({ shouldForwardProp: (prop) => prop !== 'iconType' })<{ iconType?: string }>`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  
  /* 事件节点图标 */
  &[data-icon="event"]::before {
    content: "⚡";
    font-size: 12px;
  }
  
  /* 函数节点图标 */
  &[data-icon="function"]::before {
    content: "f";
    font-size: 11px;
    font-family: 'Segoe UI Bold', sans-serif;
  }
  
  /* 执行节点图标 */
  &[data-icon="execution"]::before {
    content: "▶";
    font-size: 10px;
  }
  
  /* 分支节点图标 */
  &[data-icon="branch"]::before {
    content: "⋁";
    font-size: 12px;
  }
  
  /* 循环节点图标 */
  &[data-icon="loop"]::before {
    content: "⟳";
    font-size: 11px;
  }
  
  /* 字符串节点图标 */
  &[data-icon="string"]::before {
    content: '""';
    font-size: 9px;
  }
  
  /* 数字节点图标 */
  &[data-icon="number"]::before {
    content: "#";
    font-size: 11px;
  }
  
  /* 布尔节点图标 */
  &[data-icon="boolean"]::before {
    content: "☑";
    font-size: 10px;
  }
  
  /* 默认图标 */
  &::before {
    content: "◇";
    font-size: 10px;
  }
`;

// UE蓝图风格彩色标题栏
const NodeTitleBar = styled.div.withConfig({ shouldForwardProp: (prop) => prop !== 'nodeType' })<{ nodeType: string }>`
  padding: 4px 8px;
  background: ${(props) => {
    const config = NODE_TYPES_CONFIG[props.nodeType as keyof typeof NODE_TYPES_CONFIG];
    return config ? config.color : '#4A90E2';
  }};
  color: white;
  font-weight: 700;
  font-size: 10px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 1px 1px 0 0; /* 统一圆角 */
`;

// 节点子标题
const NodeSubtitle = styled.div`
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #CCCCCC;
  font-size: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

// 节点特殊标记（如仅限开发等）
const NodeWarning = styled.div`
  padding: 2px 8px;
  background: linear-gradient(90deg, #FF9800 0%, #FF5722 100%);
  color: white;
  font-size: 8px;
  font-weight: 600;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
`;

// 节点内容区域容器
const NodeContentContainer = styled.div`
  padding: 6px 12px; // 增加左右内边距，让内容更居中
  display: flex;
  flex-direction: column;
  gap: 6px; // 增加内部元素间距
`;

// 输入/输出引脚容器
const PortsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin: 8px -4px 0 -4px; // 增加负外边距，让引脚突出到节点边缘
`;

// 单个引脚项容器 - 确保引脚和标签垂直对齐
const PortItem = styled.div<{ isOutput?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  ${props => props.isOutput ? 'flex-direction: row-reverse;' : ''}
`;

// 输入引脚容器
const InputPorts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; // 增加引脚间的垂直间距
  align-items: flex-start;
  margin-left: -12px; // 增加负外边距，让引脚突出到节点左侧
`;

// 输出引脚容器
const OutputPorts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; // 增加引脚间的垂直间距
  align-items: flex-end;
  margin-right: -12px; // 增加负外边距，让引脚突出到节点右侧
`;

// UE蓝图风格引脚标签
const PortLabel = styled.span`
  font-size: 8px;
  opacity: 0.95;
  white-space: nowrap;
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  padding: 1px 3px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// UE蓝图风格执行引脚 - 五边形箭头设计
const ExecutionHandle = styled(Handle)`
  width: 16px !important;
  height: 14px !important;
  border: none !important;
  margin-top: -7px !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  box-sizing: border-box !important;
  transform: none !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4)) !important;
  
  /* 向右箭头 - 输出引脚 */
  &[data-position="right"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    /* 创建五边形向右箭头形状 */
    background: white;
    clip-path: polygon(0% 50%, 25% 0%, 100% 0%, 100% 100%, 25% 100%);
  }
  
  &[data-position="right"]::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    
    /* 创建内部填充的五边形 */
    background: #FFD700; /* 金色填充 */
    clip-path: polygon(0% 50%, 25% 10%, 90% 10%, 90% 90%, 25% 90%);
  }
  
  /* 向左箭头 - 输入引脚 */
  &[data-position="left"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    /* 创建五边形向左箭头形状 */
    background: white;
    clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
  }
  
  &[data-position="left"]::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    
    /* 创建内部填充的五边形 */
    background: #FFD700; /* 金色填充 */
    clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%);
  }
`;

// UE蓝图风格数据引脚 - 圆形设计
const DataHandle = styled(Handle).withConfig({ shouldForwardProp: (prop) => prop !== 'dataType' })<{ dataType?: string }>`
  width: 16px !important;
  height: 16px !important;
  border: 2px solid white !important;
  background: ${props => {
    switch (props.dataType) {
      case 'string': return '#9C27B0';  // 紫色 - 字符串
      case 'number': return '#2196F3';  // 蓝色 - 数字
      case 'boolean': return '#4CAF50'; // 绿色 - 布尔值
      case 'array': return '#FF9800';   // 橙色 - 数组
      case 'any': return '#607D8B';     // 灰色 - 任意类型
      default: return '#607D8B';
    }
  }} !important;
  border-radius: 50% !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4)) !important;
  margin-top: -8px !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  box-sizing: border-box !important;
  transform: none !important;
`;

// UE蓝图风格节点内容区域
const NodeContent = styled.div`
  padding: 6px 10px;
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  opacity: 0.95;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  margin: 2px 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.15s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

// 节点输入字段容器
const NodeInputContainer = styled.div`
  padding: 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  input {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 9px;
    width: 80px;
    
    &:focus {
      outline: none;
      border-color: #4A90E2;
      box-shadow: 0 0 0 1px rgba(74, 144, 226, 0.5);
    }
  }
`;

// 自定义节点组件
const CustomNode: React.FC<NodeProps> = ({ data, selected }) => {
  // 分离执行流和数据流引脚
  const executionInputs = data.inputs?.filter((input: any) => input.type === 'execution') || [];
  const executionOutputs = data.outputs?.filter((output: any) => output.type === 'execution') || [];
  const dataInputs = data.inputs?.filter((input: any) => input.type === 'data') || [];
  const dataOutputs = data.outputs?.filter((output: any) => output.type === 'data') || [];

  // 获取节点图标类型
  const getNodeIconType = () => {
    if (data.nodeType.includes('event')) return 'event';
    if (data.nodeType.includes('function')) return 'function';
    if (data.nodeType.includes('branch')) return 'branch';
    if (data.nodeType.includes('loop')) return 'loop';
    if (data.nodeType.includes('string')) return 'string';
    if (data.nodeType.includes('number')) return 'number';
    if (data.nodeType.includes('boolean')) return 'boolean';
    if (data.nodeType.includes('add') || data.nodeType.includes('subtract') || 
        data.nodeType.includes('multiply') || data.nodeType.includes('divide') || 
        data.nodeType.includes('modulo') || data.nodeType.includes('power')) {
      return 'number';
    }
    if (data.nodeType.includes('equal') || data.nodeType.includes('not_equal') || 
        data.nodeType.includes('greater') || data.nodeType.includes('less')) {
      return 'boolean';
    }
    if (data.nodeType.includes('and') || data.nodeType.includes('or') || 
        data.nodeType.includes('not')) {
      return 'boolean';
    }
    return 'execution';
  };

  // 模拟获取目标信息（UE蓝图中显示在子标题的内容）
  const getTargetInfo = () => {
    if (data.nodeType.includes('function') || data.nodeType.includes('event')) {
      return 'Target is BP Third Person Player Controller';
    }
    if (data.nodeType.includes('print')) {
      return '';
    }
    return '';
  };

  // 判断是否为运算节点
  const isOperatorNode = () => {
    return data.nodeType === 'add' || data.nodeType === 'subtract' || 
           data.nodeType === 'multiply' || data.nodeType === 'divide' || 
           data.nodeType === 'modulo' || data.nodeType === 'power' || 
           data.nodeType === 'equal' || data.nodeType === 'not_equal' || 
           data.nodeType === 'greater' || data.nodeType === 'less' || 
           data.nodeType === 'greater_or_equal' || data.nodeType === 'less_or_equal' || 
           data.nodeType === 'and' || data.nodeType === 'or' || data.nodeType === 'not';
  };

  // 获取节点特殊标记（如"仅限开发"等）
  const getNodeWarning = () => {
    if (data.nodeType.includes('print') || data.nodeType.includes('debug')) {
      return '仅限开发';
    }
    return '';
  };

  return (
    <NodeContainer nodeType={data.nodeType} data-selected={selected}>
      {/* 节点标题栏与执行引脚组合 */}
      <div style={{ position: 'relative' }}>
        {/* 节点标题栏 */}
        <NodeTitleBar nodeType={data.nodeType}>
          <NodeIcon iconType={getNodeIconType()} data-icon={getNodeIconType()} />
          <span>{data.label}</span>
        </NodeTitleBar>

        {/* 执行输入引脚 - 移至标题栏高度并包含在节点内部 */}
        {!isOperatorNode() && executionInputs.length > 0 && (
          <div style={{ 
            position: 'absolute', 
            left: '0px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px'
          }}>
            {executionInputs.map((input: any) => (
              <div key={input.id} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <ExecutionHandle
                  type="target"
                  position={Position.Left}
                  id={input.id}
                  data-position="left"
                />
              </div>
            ))}
          </div>
        )}

        {/* 执行输出引脚 - 移至标题栏高度并包含在节点内部 */}
        {!isOperatorNode() && executionOutputs.length > 0 && (
          <div style={{ 
            position: 'absolute', 
            right: '0px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px'
          }}>
            {executionOutputs.map((output: any) => (
              <div key={output.id} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <ExecutionHandle
                  type="source"
                  position={Position.Right}
                  id={output.id}
                  data-position="right"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 节点子标题（如果有） */}
      {getTargetInfo() && <NodeSubtitle>{getTargetInfo()}</NodeSubtitle>}

      {/* 节点内容区域 */}
      <NodeContentContainer>

        {/* 节点内容 */}
        {data.properties?.value !== undefined && (
          <NodeInputContainer>
            <PortLabel>{data.properties.label || 'In String'}</PortLabel>
            <input
              type="text"
              value={String(data.properties.value)}
              readOnly
              style={{ cursor: 'default' }}
            />
          </NodeInputContainer>
        )}
        
        {data.properties?.functionName && (
          <NodeContent>
            <PortLabel>Function Name</PortLabel>
          </NodeContent>
        )}
        
        {data.properties?.eventType && (
          <NodeContent>
            <PortLabel>Event Type</PortLabel>
          </NodeContent>
        )}
        
        {/* 运算节点特殊内容 */}
        {isOperatorNode() && data.properties?.operator && (
          <NodeContent style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            padding: '8px',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            {data.properties.operator}
          </NodeContent>
        )}
        
        {/* 没有特定属性时显示通用内容 */}
        {!data.properties?.value && !data.properties?.functionName && !data.properties?.eventType && !isOperatorNode() && (
          <NodeContent>
            {data.label}
          </NodeContent>
        )}

        {/* 数据引脚区域 */}
        <PortsContainer>
          {/* 左侧数据输入引脚 */}
          <InputPorts>
            {dataInputs.map((input: any) => (
              <PortItem key={input.id}>
                <DataHandle
                  type="target"
                  position={Position.Left}
                  id={input.id}
                  dataType={input.dataType}
                />
                <PortLabel>{input.label}</PortLabel>
              </PortItem>
            ))}
          </InputPorts>

          {/* 右侧数据输出引脚 */}
          <OutputPorts>
            {dataOutputs.map((output: any) => (
              <PortItem key={output.id} isOutput>
                <PortLabel>{output.label}</PortLabel>
                <DataHandle
                  type="source"
                  position={Position.Right}
                  id={output.id}
                  dataType={output.dataType}
                />
              </PortItem>
            ))}
          </OutputPorts>
        </PortsContainer>
      </NodeContentContainer>

      {/* 节点警告标记（如仅限开发等） */}
      {getNodeWarning() && <NodeWarning>{getNodeWarning()}</NodeWarning>}
    </NodeContainer>
  );
};

export default CustomNode;
