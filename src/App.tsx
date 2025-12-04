import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';

import CustomNode from './components/CustomNode';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import PropertyPanel from './components/PropertyPanel';
import StateTabs from './components/StateTabs';
import FunctionWindow from './components/FunctionWindow';
import { NODE_TYPES_CONFIG } from './types/NodeTypes';
import { AppState, BlueprintState, initialAppState } from './types/BlueprintTypes';

// 定义节点类型
const nodeTypes = {
  custom: CustomNode,
};

// 样式组件
const EditorContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #1e1e1e;
  color: #ffffff;
`;

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FlowContainer = styled.div`
  flex: 1;
  position: relative;
`;

function App() {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // 获取当前状态
  const currentState = appState.states.find(state => state.id === appState.currentStateId);
  const currentNodes = currentState?.nodes || [];
  const currentEdges = currentState?.edges || [];

  // 节点状态管理
  const [nodes, setNodes, onNodesChange] = useNodesState(currentNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentEdges);

  // 同步节点状态到应用状态
  React.useEffect(() => {
    if (currentState) {
      setAppState(prev => ({
        ...prev,
        states: prev.states.map(state =>
          state.id === currentState.id
            ? { ...state, nodes, edges }
            : state
        )
      }));
    }
  }, [nodes, edges, currentState]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = (nodeType: string) => {
    const config = NODE_TYPES_CONFIG[nodeType as keyof typeof NODE_TYPES_CONFIG];
    if (!config) return;

    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: config.label,
        nodeType: nodeType,
        inputs: config.inputs,
        outputs: config.outputs,
        properties: config.properties || {}
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onPropertyChange = (nodeId: string, property: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          if (property.includes('.')) {
            const [parent, child] = property.split('.');
            return {
              ...node,
              data: {
                ...node.data,
                [parent]: {
                  ...node.data[parent],
                  [child]: value
                }
              }
            };
          }
          return {
            ...node,
            data: {
              ...node.data,
              [property]: value
            }
          };
        }
        return node;
      })
    );
  };

  const onStateChange = (stateId: string) => {
    const newState = appState.states.find(state => state.id === stateId);
    if (newState) {
      setAppState(prev => ({ ...prev, currentStateId: stateId }));
      setNodes(newState.nodes);
      setEdges(newState.edges);
      setSelectedNode(null);
    }
  };

  const onAddState = () => {
    const newStateId = `state-${Date.now()}`;
    const newState: BlueprintState = {
      id: newStateId,
      name: `蓝图${appState.states.length}`,
      nodes: [],
      edges: [],
      isFunction: false
    };
    
    setAppState(prev => ({
      ...prev,
      states: [...prev.states, newState],
      currentStateId: newStateId
    }));
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  };

  const onCloseState = (stateId: string) => {
    if (stateId === 'main') return; // 不能关闭主蓝图
    
    const newStates = appState.states.filter(state => state.id !== stateId);
    const newCurrentStateId = appState.currentStateId === stateId 
      ? (newStates[0]?.id || 'main')
      : appState.currentStateId;
    
    setAppState(prev => ({
      ...prev,
      states: newStates,
      currentStateId: newCurrentStateId
    }));
    
    if (newCurrentStateId) {
      const newState = newStates.find(state => state.id === newCurrentStateId);
      if (newState) {
        setNodes(newState.nodes);
        setEdges(newState.edges);
      }
    }
    setSelectedNode(null);
  };

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    // 双击函数定义节点创建新的函数蓝图
    if (node.data.nodeType === 'function_define') {
      const functionName = node.data.properties?.functionName || `函数${Date.now()}`;
      const newStateId = `function-${Date.now()}`;
      
      // 创建新的函数蓝图状态
      const newState: BlueprintState = {
        id: newStateId,
        name: functionName,
        nodes: [
          {
            id: 'entry',
            type: 'custom',
            position: { x: 100, y: 100 },
            data: { 
              label: 'Entry',
              nodeType: 'start',
              inputs: [],
              outputs: [{ id: 'output-1', label: '执行', type: 'execution' }]
            },
          },
          {
            id: 'return',
            type: 'custom',
            position: { x: 300, y: 100 },
            data: { 
              label: 'Return',
              nodeType: 'function_define',
              inputs: [{ id: 'input-1', label: '执行', type: 'execution' }],
              outputs: []
            },
          }
        ],
        edges: [],
        isFunction: true,
        parentStateId: appState.currentStateId
      };
      
      setAppState(prev => ({
        ...prev,
        states: [...prev.states, newState],
        currentStateId: newStateId
      }));
      setNodes(newState.nodes);
      setEdges(newState.edges);
      setSelectedNode(null);
    }
    
    // 双击函数调用节点打开独立窗口
    else if (node.data.nodeType === 'function_call') {
      const newWindowId = `window-${Date.now()}`;
      setAppState(prev => ({
        ...prev,
        functionWindows: [
          ...prev.functionWindows,
          {
            id: newWindowId,
            stateId: node.id,
            title: node.data.label || '函数调用',
            position: { x: 100, y: 100 },
            size: { width: 800, height: 600 },
            isMinimized: false
          }
        ]
      }));
    }
  };

  const onCloseFunctionWindow = (windowId: string) => {
    setAppState(prev => ({
      ...prev,
      functionWindows: prev.functionWindows.filter(win => win.id !== windowId)
    }));
  };

  const onMinimizeFunctionWindow = (windowId: string) => {
    setAppState(prev => ({
      ...prev,
      functionWindows: prev.functionWindows.map(win =>
        win.id === windowId
          ? { ...win, isMinimized: !win.isMinimized }
          : win
      )
    }));
  };

  const onMaximizeFunctionWindow = (windowId: string) => {
    setAppState(prev => ({
      ...prev,
      functionWindows: prev.functionWindows.map(win =>
        win.id === windowId
          ? { ...win, size: { width: 1200, height: 800 } }
          : win
      )
    }));
  };

  return (
    <>
      <EditorContainer>
        <Sidebar onAddNode={onAddNode} />
        <CanvasContainer>
          <StateTabs
            states={appState.states}
            currentStateId={appState.currentStateId}
            onStateChange={onStateChange}
            onAddState={onAddState}
            onCloseState={onCloseState}
          />
          <Toolbar />
          <FlowContainer>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(event, node) => setSelectedNode(node)}
              onNodeDoubleClick={onNodeDoubleClick}
              onPaneClick={() => setSelectedNode(null)}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Lines} gap={20} size={1} />
            </ReactFlow>
          </FlowContainer>
        </CanvasContainer>
        <PropertyPanel
          selectedNode={selectedNode}
          onPropertyChange={onPropertyChange}
        />
      </EditorContainer>

      {/* 函数窗口 */}
      {appState.functionWindows.map((window) => (
        <FunctionWindow
          key={window.id}
          window={window}
          nodes={[]} // 这里应该加载函数的节点数据
          edges={[]} // 这里应该加载函数的边数据
          onNodesChange={() => {}}
          onEdgesChange={() => {}}
          onConnect={() => {}}
          onPropertyChange={onPropertyChange}
          onClose={onCloseFunctionWindow}
          onMinimize={onMinimizeFunctionWindow}
          onMaximize={onMaximizeFunctionWindow}
        />
      ))}
    </>
  );
}

export default App;
