// blueprintSlice.ts - 蓝图状态管理
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from 'reactflow';

// 定义蓝图状态类型
interface BlueprintState {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  isFunction: boolean;
  parentStateId?: string;
}

// 定义蓝图根状态类型
interface BlueprintRootState {
  currentStateId: string;
  states: BlueprintState[];
}

// 初始状态
const initialState: BlueprintRootState = {
  currentStateId: 'main',
  states: [
    {
      id: 'main',
      name: '主蓝图',
      nodes: [],
      edges: [],
      isFunction: false
    }
  ]
};

// 创建 blueprintSlice
const blueprintSlice = createSlice({
  name: 'blueprint',
  initialState,
  reducers: {
    // 切换当前状态
    switchState(state, action: PayloadAction<string>) {
      state.currentStateId = action.payload;
    },

    // 添加新状态
    addState(state, action: PayloadAction<Omit<BlueprintState, 'id'> & { id?: string }>) {
      const newId = action.payload.id || `state-${Date.now()}`;
      const newState: BlueprintState = {
        id: newId,
        name: action.payload.name,
        nodes: action.payload.nodes || [],
        edges: action.payload.edges || [],
        isFunction: action.payload.isFunction || false,
        parentStateId: action.payload.parentStateId
      };
      
      state.states.push(newState);
      state.currentStateId = newId;
    },

    // 关闭状态
    closeState(state, action: PayloadAction<string>) {
      const stateId = action.payload;
      
      // 不能关闭主蓝图
      if (stateId === 'main') return;

      // 过滤掉要关闭的状态
      state.states = state.states.filter(state => state.id !== stateId);

      // 如果关闭的是当前状态，则切换到第一个状态
      if (state.currentStateId === stateId) {
        state.currentStateId = state.states[0]?.id || 'main';
      }
    },

    // 更新状态名称
    updateStateName(state, action: PayloadAction<{ stateId: string; newName: string }>) {
      const { stateId, newName } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        targetState.name = newName;
      }
    },

    // 添加节点
    addNode(state, action: PayloadAction<{ stateId?: string; node: Node }>) {
      const { stateId = state.currentStateId, node } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        targetState.nodes.push(node);
      }
    },

    // 更新节点
    updateNode(state, action: PayloadAction<{ stateId?: string; nodeId: string; updates: Partial<Node> }>) {
      const { stateId = state.currentStateId, nodeId, updates } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        const targetNode = targetState.nodes.find(n => n.id === nodeId);
        if (targetNode) {
          Object.assign(targetNode, updates);
        }
      }
    },

    // 移除节点
    removeNode(state, action: PayloadAction<{ stateId?: string; nodeId: string }>) {
      const { stateId = state.currentStateId, nodeId } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        // 移除节点
        targetState.nodes = targetState.nodes.filter(n => n.id !== nodeId);
        
        // 移除与该节点相关的所有边
        targetState.edges = targetState.edges.filter(
          edge => edge.source !== nodeId && edge.target !== nodeId
        );
      }
    },

    // 批量更新节点
    batchUpdateNodes(state, action: PayloadAction<{ stateId?: string; nodes: Node[] }>) {
      const { stateId = state.currentStateId, nodes } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        targetState.nodes = nodes;
      }
    },

    // 添加边
    addEdge(state, action: PayloadAction<{ stateId?: string; edge: Edge }>) {
      const { stateId = state.currentStateId, edge } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        targetState.edges.push(edge);
      }
    },

    // 更新边
    updateEdge(state, action: PayloadAction<{ stateId?: string; edgeId: string; updates: Partial<Edge> }>) {
      const { stateId = state.currentStateId, edgeId, updates } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        const targetEdge = targetState.edges.find(e => e.id === edgeId);
        if (targetEdge) {
          Object.assign(targetEdge, updates);
        }
      }
    },

    // 移除边
    removeEdge(state, action: PayloadAction<{ stateId?: string; edgeId: string }>) {
      const { stateId = state.currentStateId, edgeId } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        targetState.edges = targetState.edges.filter(e => e.id !== edgeId);
      }
    },

    // 批量更新边
    batchUpdateEdges(state, action: PayloadAction<{ stateId?: string; edges: Edge[] }>) {
      const { stateId = state.currentStateId, edges } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        targetState.edges = edges;
      }
    },

    // 清空状态
    clearState(state, action: PayloadAction<{ stateId?: string }>) {
      const { stateId = state.currentStateId } = action.payload;
      const targetState = state.states.find(s => s.id === stateId);
      
      if (targetState) {
        targetState.nodes = [];
        targetState.edges = [];
      }
    },

    // 重置蓝图状态
    resetBlueprintState(state) {
      Object.assign(state, initialState);
    }
  }
});

// 导出 action creators
export const { 
  switchState, 
  addState, 
  closeState, 
  updateStateName, 
  addNode, 
  updateNode, 
  removeNode, 
  batchUpdateNodes, 
  addEdge, 
  updateEdge, 
  removeEdge, 
  batchUpdateEdges, 
  clearState, 
  resetBlueprintState 
} = blueprintSlice.actions;

// 导出 reducer
export default blueprintSlice.reducer;
