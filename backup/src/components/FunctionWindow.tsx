import React from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow';
import styled from 'styled-components';
import CustomNode from './CustomNode';

const WindowContainer = styled.div<{ position: { x: number; y: number }, size: { width: number; height: number }, isMinimized: boolean }>`
  position: fixed;
  left: ${props => props.position.x}px;
  top: ${props => props.position.y}px;
  width: ${props => props.isMinimized ? '200px' : `${props.size.width}px`};
  height: ${props => props.isMinimized ? '40px' : `${props.size.height}px`};
  background: #2d2d2d;
  border: 1px solid #444;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
`;

const WindowHeader = styled.div`
  background: #3d3d3d;
  padding: 8px 12px;
  border-bottom: 1px solid #444;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: move;
  user-select: none;
`;

const WindowTitle = styled.h3`
  margin: 0;
  font-size: 12px;
  color: #ccc;
  flex: 1;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 4px;
`;

const WindowButton = styled.button`
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const WindowContent = styled.div<{ isMinimized: boolean }>`
  flex: 1;
  display: ${props => props.isMinimized ? 'none' : 'block'};
  position: relative;
`;

const nodeTypes = {
  custom: CustomNode,
};

interface FunctionWindowProps {
  window: {
    id: string;
    stateId: string;
    title: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    isMinimized: boolean;
  };
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onPropertyChange: (nodeId: string, property: string, value: any) => void;
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
}

const FunctionWindow: React.FC<FunctionWindowProps> = ({
  window,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onPropertyChange,
  onClose,
  onMinimize,
  onMaximize
}) => {
  const [localNodes, , onLocalNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onLocalEdgesChange] = useEdgesState(edges);

  const handleConnect = (params: Connection) => {
    setLocalEdges((eds) => addEdge(params, eds));
    onConnect(params);
  };

  return (
    <WindowContainer
      position={window.position}
      size={window.size}
      isMinimized={window.isMinimized}
      onContextMenu={(e) => e.preventDefault()}
    >
      <WindowHeader>
        <WindowTitle>{window.title}</WindowTitle>
        <WindowControls>
          <WindowButton onClick={() => onMinimize(window.id)}>
            {window.isMinimized ? '□' : '_'}
          </WindowButton>
          <WindowButton onClick={() => onMaximize(window.id)}>
            □
          </WindowButton>
          <WindowButton onClick={() => onClose(window.id)}>
            ×
          </WindowButton>
        </WindowControls>
      </WindowHeader>
      <WindowContent isMinimized={window.isMinimized}>
        <ReactFlow
          nodes={localNodes}
          edges={localEdges}
          onNodesChange={(changes) => {
            onLocalNodesChange(changes);
            onNodesChange(changes);
          }}
          onEdgesChange={(changes) => {
            onLocalEdgesChange(changes);
            onEdgesChange(changes);
          }}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </WindowContent>
    </WindowContainer>
  );
};

export default FunctionWindow;
