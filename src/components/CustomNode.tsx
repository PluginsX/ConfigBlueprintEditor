import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styled from 'styled-components';
import { NODE_TYPES_CONFIG } from '../types/NodeTypes';

// 节点容器样式 - 圆角矩形
const NodeContainer = styled.div<{ nodeType: string }>`
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 150px;
  background: ${props => {
    const config = NODE_TYPES_CONFIG[props.nodeType as keyof typeof NODE_TYPES_CONFIG];
    return config ? config.color : '#607D8B';
  }};
  color: white;
  border: 2px solid #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
`;

const NodeHeader = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 4px;
`;

// 引脚容器 - 所有引脚都在节点两侧
const PortsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  min-height: 40px;
`;

const InputPorts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: space-around;
`;

const OutputPorts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: space-around;
`;

const PortLabel = styled.span`
  font-size: 9px;
  opacity: 0.9;
  white-space: nowrap;
`;

// 执行引脚 - 三角形
const ExecutionHandle = styled(Handle)`
  width: 0;
  height: 0;
  border: 5px solid transparent;
  background: transparent !important;
  border-left-color: #FF6B6B;
  border-right: none;
  transform: scale(0.8);
  
  &[data-handlepos="right"] {
    border-left-color: #FF6B6B;
    border-right: none;
  }
  
  &[data-handlepos="left"] {
    border-right-color: #FF6B6B;
    border-left: none;
  }
`;

// 数据引脚 - 圆形，根据数据类型设置不同颜色
const DataHandle = styled(Handle)<{ dataType?: string }>`
  width: 8px;
  height: 8px;
  border: 1px solid #fff;
  background: ${props => {
    switch (props.dataType) {
      case 'string': return '#9C27B0';  // 紫色
      case 'number': return '#2196F3';  // 蓝色
      case 'boolean': return '#4CAF50'; // 绿色
      case 'array': return '#FF9800';   // 橙色
      default: return '#607D8B';        // 灰色
    }
  }};
  border-radius: 50%;
`;

// 节点内容区域
const NodeContent = styled.div`
  padding: 4px 0;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  opacity: 0.8;
`;

// 自定义节点组件
const CustomNode: React.FC<NodeProps> = ({ data }) => {
  // 分离执行流和数据流引脚
  const executionInputs = data.inputs?.filter((input: any) => input.type === 'execution') || [];
  const executionOutputs = data.outputs?.filter((output: any) => output.type === 'execution') || [];
  const dataInputs = data.inputs?.filter((input: any) => input.type === 'data') || [];
  const dataOutputs = data.outputs?.filter((output: any) => output.type === 'data') || [];

  return (
    <NodeContainer nodeType={data.nodeType}>
      <NodeHeader>{data.label}</NodeHeader>

      {/* 节点内容区域 */}
      <NodeContent>
        {data.properties?.value !== undefined && (
          <span>{String(data.properties.value)}</span>
        )}
        {data.properties?.functionName && (
          <span>{data.properties.functionName}</span>
        )}
        {data.properties?.eventType && (
          <span>{data.properties.eventType}</span>
        )}
      </NodeContent>

      {/* 引脚容器 - 所有引脚都在节点两侧 */}
      <PortsContainer>
        {/* 左侧引脚 - 输入 */}
        <InputPorts>
          {/* 执行输入引脚 */}
          {executionInputs.map((input: any) => (
            <div key={input.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ExecutionHandle
                type="target"
                position={Position.Left}
                id={input.id}
              />
              <PortLabel>{input.label}</PortLabel>
            </div>
          ))}
          
          {/* 数据输入引脚 */}
          {dataInputs.map((input: any) => (
            <div key={input.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <DataHandle
                type="target"
                position={Position.Left}
                id={input.id}
                dataType={input.dataType}
              />
              <PortLabel>{input.label}</PortLabel>
            </div>
          ))}
        </InputPorts>

        {/* 右侧引脚 - 输出 */}
        <OutputPorts>
          {/* 执行输出引脚 */}
          {executionOutputs.map((output: any) => (
            <div key={output.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PortLabel>{output.label}</PortLabel>
              <ExecutionHandle
                type="source"
                position={Position.Right}
                id={output.id}
              />
            </div>
          ))}
          
          {/* 数据输出引脚 */}
          {dataOutputs.map((output: any) => (
            <div key={output.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PortLabel>{output.label}</PortLabel>
              <DataHandle
                type="source"
                position={Position.Right}
                id={output.id}
                dataType={output.dataType}
              />
            </div>
          ))}
        </OutputPorts>
      </PortsContainer>
    </NodeContainer>
  );
};

export default CustomNode;
