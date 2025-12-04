import React, { useCallback, useState, useRef, MouseEvent } from 'react';
import ReactFlow, {
  Node,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';

import CustomNode from './components/CustomNode';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import PropertyPanel from './components/PropertyPanel';
import StateTabs from './components/StateTabs';
import FunctionWindow from './components/FunctionWindow';
import ContextMenu from './components/ContextMenu';
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
  user-select: none;
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

const RightPanel = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: #2d2d2d;
  border-left: 1px solid #444;
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



function App() {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [copiedNode, setCopiedNode] = useState<Node | null>(null);

  // 获取当前状态
  const currentState = appState.states.find(state => state.id === appState.currentStateId);

  // ReactFlow实例引用
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  // 节点状态管理
  const [nodes, setNodes, onNodesChange] = useNodesState(currentState?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentState?.edges || []);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

  // 同步节点状态到应用状态（仅当节点或边实际更改时）
  React.useEffect(() => {
    if (currentState) {
      const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(currentState.nodes);
      const edgesChanged = JSON.stringify(edges) !== JSON.stringify(currentState.edges);
      
      if (nodesChanged || edgesChanged) {
        setAppState(prev => ({
          ...prev,
          states: prev.states.map(state =>
            state.id === currentState.id
              ? { ...state, nodes, edges }
              : state
          )
        }));
      }
    }
  }, [nodes, edges, currentState]);

  const onConnect = useCallback(
    (params: Connection) => {
      // 获取源节点和目标节点的配置
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;
      
      // 检查是否是执行引脚连接
      const isExecutionConnection = params.sourceHandle?.includes('execution') || params.targetHandle?.includes('execution');
      
      if (isExecutionConnection) {
        // 获取源节点的输出引脚配置
        const sourceOutput = sourceNode.data.outputs?.find((output: { id: string; type: string }) => output.id === params.sourceHandle);
        // 获取目标节点的输入引脚配置
        const targetInput = targetNode.data.inputs?.find((input: { id: string; type: string }) => input.id === params.targetHandle);
        
        // 验证执行引脚类型是否匹配：出发引脚（输出）只能连接到达引脚（输入）
        if (sourceOutput?.type === 'execution' && targetInput?.type === 'execution') {
          // 检查源节点是否已经有执行输出连接
          const hasSourceConnection = edges.some(edge => 
            edge.source === params.source && 
            edge.sourceHandle === params.sourceHandle &&
            edge.type !== 'preview'
          );
          
          // 检查目标节点是否已经有执行输入连接
          const hasTargetConnection = edges.some(edge => 
            edge.target === params.target && 
            edge.targetHandle === params.targetHandle &&
            edge.type !== 'preview'
          );
          
          // 只有当源和目标都没有执行连接时才允许连接
          if (!hasSourceConnection && !hasTargetConnection) {
            setEdges((eds) => addEdge(params, eds));
          }
        }
      } else {
        // 非执行引脚连接，使用默认规则
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [nodes, edges, setEdges]
  );

  const onAddNode = (nodeType: string, position?: { x: number; y: number }) => {
    const config = NODE_TYPES_CONFIG[nodeType as keyof typeof NODE_TYPES_CONFIG];
    if (!config) return;

    // 如果提供了位置，将其转换为ReactFlow画布坐标
    let newPosition = { x: Math.random() * 400, y: Math.random() * 400 };
    
    if (position && reactFlowInstance) {
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (reactFlowBounds) {
        // 计算相对于ReactFlow画布的位置
        newPosition = reactFlowInstance.project({
          x: position.x - reactFlowBounds.left,
          y: position.y - reactFlowBounds.top
        });
      }
    }

    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'custom',
      position: newPosition,
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
      // 检查是否已经有对应的状态数据
      let functionState = appState.states.find(state => state.id === node.id);
      
      // 如果没有，创建一个新的函数状态
      if (!functionState) {
        functionState = {
          id: node.id,
          name: node.data.label || '函数调用',
          nodes: [
            {
              id: `node-${Date.now()}-add`,
              type: 'custom',
              position: { x: 200, y: 150 },
              data: {
                label: '加法',
                nodeType: 'add',
                inputs: [
                  { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
                  { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
                ],
                outputs: [
                  { id: 'output-1', label: '结果', type: 'data', dataType: 'number' }
                ],
                properties: { operator: '+' }
              },
            }
          ],
          edges: [],
          isFunction: true,
          parentStateId: appState.currentStateId
        };
        
        // 添加到应用状态
        setAppState(prev => ({
          ...prev,
          states: [...prev.states, functionState] as BlueprintState[]
        }));
      }
      
      // 创建新的函数窗口
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

  // 处理画布右键点击
  const onPaneContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedNode(null); // 点击空白处时清除选中节点
  };

  // 处理节点右键点击
  const onNodeContextMenu = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedNode(node); // 记录当前选中的节点
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenuPosition(null);
  };

  // 节点操作处理函数
  const handleCopyNode = () => {
    if (!selectedNode) return;
    
    setCopiedNode({ ...selectedNode, id: '' }); // 复制节点但不复制ID（使用空字符串占位）
  };

  const handlePasteNode = () => {
    if (!copiedNode || !contextMenuPosition) return;
    
    // 生成新的唯一ID
    const newId = Date.now().toString();
    
    // 在当前菜单位置创建新节点
    const newNode = {
      ...copiedNode,
      id: newId,
      position: {
        x: contextMenuPosition.x - 75, // 居中显示
        y: contextMenuPosition.y - 30
      }
    } as Node;
    
    setNodes((nds) => nds.concat(newNode));
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    
    setNodes((nds) => nds.filter(node => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter(edge => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    setSelectedNode(null);
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

  // 构建节点类型数据结构用于右键菜单
  const nodeTypesForMenu = React.useMemo(() => {
    const nodeTypes = [
      { category: '流程控制', nodes: ['开始', '条件', '循环', 'While循环', 'For循环', 'Switch', 'ForEach'] },
      { category: '变量', nodes: ['字符串', '数字', '布尔值'] },
      { category: '函数', nodes: ['函数定义', '函数调用'] },
      { category: '事件', nodes: ['事件定义', '事件调用'] },
      { category: '数值运算', nodes: ['加法', '减法', '乘法', '除法', '取模', '幂运算'] },
      { category: '比较运算', nodes: ['等于', '不等于', '大于', '小于', '大于等于', '小于等于'] },
      { category: '逻辑运算', nodes: ['逻辑与', '逻辑或', '逻辑非'] }
    ];

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
      '事件调用': 'event_call',
      '加法': 'add',
      '减法': 'subtract',
      '乘法': 'multiply',
      '除法': 'divide',
      '取模': 'modulo',
      '幂运算': 'power',
      '等于': 'equal',
      '不等于': 'not_equal',
      '大于': 'greater',
      '小于': 'less',
      '大于等于': 'greater_or_equal',
      '小于等于': 'less_or_equal',
      '逻辑与': 'and',
      '逻辑或': 'or',
      '逻辑非': 'not'
    };

    return nodeTypes.flatMap(category => 
      category.nodes.map(node => ({
        id: NODE_TYPE_MAPPING[node],
        name: node,
        category: category.category,
        type: NODE_TYPE_MAPPING[node]
      }))
    );
  }, []);

  return (
    <>
      <EditorContainer
        onContextMenu={(e) => e.preventDefault()}
      >
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
          <FlowContainer ref={reactFlowWrapper}>
            <ReactFlow
              onInit={setReactFlowInstance}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(event, node) => setSelectedNode(node)}
              onNodeDoubleClick={onNodeDoubleClick}
              onNodeContextMenu={onNodeContextMenu}
              onPaneClick={() => {
                setSelectedNode(null);
                closeContextMenu();
              }}
              onPaneContextMenu={onPaneContextMenu}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
              <Background variant={BackgroundVariant.Lines} gap={20} size={1} color="#333333" />
            </ReactFlow>
            <ContextMenu
              position={contextMenuPosition}
              onClose={closeContextMenu}
              onSelectNode={selectedNode ? undefined : onAddNode}
              onCopyNode={handleCopyNode}
              onPasteNode={handlePasteNode}
              onDeleteNode={handleDeleteNode}
              nodeTypes={selectedNode ? undefined : nodeTypesForMenu}
              menuType={selectedNode ? 'nodeOperations' : 'nodeCreation'}
            />
          </FlowContainer>
        </CanvasContainer>
        <RightPanel>
          <PropertyPanel
            selectedNode={selectedNode}
            onPropertyChange={onPropertyChange}
          />
        </RightPanel>
      </EditorContainer>

      {/* 函数窗口 */}
      {appState.functionWindows.map((window) => {
        // 找到对应的函数状态数据
        const functionState = appState.states.find(state => state.id === window.stateId);
        
        return (
          <FunctionWindow
            key={window.id}
            window={window}
            nodes={functionState?.nodes || []} // 加载函数的节点数据
            edges={functionState?.edges || []} // 加载函数的边数据
            onNodesChange={(changes) => {
              // 更新函数状态的节点
              if (functionState) {
                // 这里可以根据changes更新节点，暂时简化处理
                console.log('Nodes changed in function window:', changes);
                
                // 简单实现：更新节点位置和选择状态
                const updatedNodes = (functionState.nodes || []).map(node => {
                  const change = changes.find((c: any) => c.id === node.id);
                  if (change) {
                    return { ...node, ...change.changed }; 
                  }
                  return node;
                });
                
                // 添加新节点
                const newNodes = changes
                  .filter((c: any) => c.type === 'add')
                  .map((c: any) => c.node);
                
                if (newNodes.length > 0) {
                  updatedNodes.push(...newNodes);
                }
                
                // 删除节点
                const removedNodeIds = changes
                  .filter((c: any) => c.type === 'remove')
                  .map((c: any) => c.id);
                
                if (removedNodeIds.length > 0) {
                  removedNodeIds.forEach((id: string) => {
                    const index = updatedNodes.findIndex(n => n.id === id);
                    if (index > -1) {
                      updatedNodes.splice(index, 1);
                    }
                  });
                }
                
                // 更新应用状态
                setAppState(prev => ({
                  ...prev,
                  states: prev.states.map(state =>
                    state.id === functionState.id
                      ? { ...state, nodes: updatedNodes }
                      : state
                  ) as BlueprintState[]
                }));
              }
            }}
            onEdgesChange={(changes) => {
              // 更新函数状态的边
              if (functionState) {
                // 这里可以根据changes更新边，暂时简化处理
                console.log('Edges changed in function window:', changes);
                
                // 简单实现：更新边的选择状态
                const updatedEdges = (functionState.edges || []).map(edge => {
                  const change = changes.find((c: any) => c.id === edge.id);
                  if (change) {
                    return { ...edge, ...change.changed }; 
                  }
                  return edge;
                });
                
                // 删除边
                const removedEdgeIds = changes
                  .filter((c: any) => c.type === 'remove')
                  .map((c: any) => c.id);
                
                if (removedEdgeIds.length > 0) {
                  removedEdgeIds.forEach((id: string) => {
                    const index = updatedEdges.findIndex(e => e.id === id);
                    if (index > -1) {
                      updatedEdges.splice(index, 1);
                    }
                  });
                }
                
                // 更新应用状态
                setAppState(prev => ({
                  ...prev,
                  states: prev.states.map(state =>
                    state.id === functionState.id
                      ? { ...state, edges: updatedEdges }
                      : state
                  ) as BlueprintState[]
                }));
              }
            }}
            onConnect={(connection) => {
              // 添加新的边
              if (functionState) {
                const updatedEdges = addEdge(connection, functionState.edges || []);
                // 更新函数状态的边
                setAppState(prev => ({
                  ...prev,
                  states: prev.states.map(state =>
                    state.id === functionState.id
                      ? { ...state, edges: updatedEdges }
                      : state
                  )
                }));
              }
            }}
            onPropertyChange={onPropertyChange}
            onClose={onCloseFunctionWindow}
            onMinimize={onMinimizeFunctionWindow}
            onMaximize={onMaximizeFunctionWindow}
          />
        );
      })}
    </>
  );
}

export default App;
