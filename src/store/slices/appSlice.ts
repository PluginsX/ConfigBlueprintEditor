// appSlice.ts - 应用核心状态管理
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node } from 'reactflow';

// 定义 App 状态类型
interface AppState {
  selectedNode: Node | null;
  copiedNode: Node | null;
  contextMenuPosition: { x: number; y: number } | null;
  isLoading: boolean;
  error: string | null;
}

// 初始状态
const initialState: AppState = {
  selectedNode: null,
  copiedNode: null,
  contextMenuPosition: null,
  isLoading: false,
  error: null
};

// 创建 appSlice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // 选择节点
    selectNode(state, action: PayloadAction<Node | null>) {
      state.selectedNode = action.payload;
    },

    // 复制节点
    copyNode(state, action: PayloadAction<Node | null>) {
      state.copiedNode = action.payload;
    },

    // 设置右键菜单位置
    setContextMenuPosition(state, action: PayloadAction<{ x: number; y: number } | null>) {
      state.contextMenuPosition = action.payload;
    },

    // 关闭右键菜单
    closeContextMenu(state) {
      state.contextMenuPosition = null;
    },

    // 设置加载状态
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    // 设置错误信息
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // 清除错误信息
    clearError(state) {
      state.error = null;
    },

    // 重置应用状态
    resetAppState(state) {
      Object.assign(state, initialState);
    }
  }
});

// 导出 action creators
export const { 
  selectNode, 
  copyNode, 
  setContextMenuPosition, 
  closeContextMenu, 
  setLoading, 
  setError, 
  clearError, 
  resetAppState 
} = appSlice.actions;

// 导出 reducer
export default appSlice.reducer;
