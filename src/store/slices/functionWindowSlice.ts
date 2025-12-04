// functionWindowSlice.ts - 函数窗口状态管理
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义函数窗口状态类型
interface FunctionWindow {
  id: string;
  stateId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
}

// 定义函数窗口根状态类型
interface FunctionWindowRootState {
  windows: FunctionWindow[];
}

// 初始状态
const initialState: FunctionWindowRootState = {
  windows: []
};

// 创建 functionWindowSlice
const functionWindowSlice = createSlice({
  name: 'functionWindow',
  initialState,
  reducers: {
    // 添加函数窗口
    addFunctionWindow(state, action: PayloadAction<Omit<FunctionWindow, 'id' | 'isMinimized' | 'isMaximized'> & { id?: string }>) {
      const newId = action.payload.id || `window-${Date.now()}`;
      const newWindow: FunctionWindow = {
        id: newId,
        stateId: action.payload.stateId,
        title: action.payload.title,
        position: action.payload.position || { x: 100, y: 100 },
        size: action.payload.size || { width: 800, height: 600 },
        isMinimized: false,
        isMaximized: false
      };
      
      state.windows.push(newWindow);
    },

    // 关闭函数窗口
    closeFunctionWindow(state, action: PayloadAction<string>) {
      const windowId = action.payload;
      state.windows = state.windows.filter(win => win.id !== windowId);
    },

    // 最小化/最大化函数窗口
    toggleMinimizeWindow(state, action: PayloadAction<string>) {
      const windowId = action.payload;
      const targetWindow = state.windows.find(win => win.id === windowId);
      
      if (targetWindow) {
        targetWindow.isMinimized = !targetWindow.isMinimized;
      }
    },

    // 切换最大化状态
    toggleMaximizeWindow(state, action: PayloadAction<string>) {
      const windowId = action.payload;
      const targetWindow = state.windows.find(win => win.id === windowId);
      
      if (targetWindow) {
        targetWindow.isMaximized = !targetWindow.isMaximized;
        
        // 如果最大化，调整窗口大小
        if (targetWindow.isMaximized) {
          targetWindow.size = { width: 1200, height: 800 };
        } else {
          targetWindow.size = { width: 800, height: 600 };
        }
      }
    },

    // 更新函数窗口位置
    updateWindowPosition(state, action: PayloadAction<{ windowId: string; position: { x: number; y: number } }>) {
      const { windowId, position } = action.payload;
      const targetWindow = state.windows.find(win => win.id === windowId);
      
      if (targetWindow) {
        targetWindow.position = position;
      }
    },

    // 更新函数窗口大小
    updateWindowSize(state, action: PayloadAction<{ windowId: string; size: { width: number; height: number } }>) {
      const { windowId, size } = action.payload;
      const targetWindow = state.windows.find(win => win.id === windowId);
      
      if (targetWindow) {
        targetWindow.size = size;
      }
    },

    // 更新函数窗口标题
    updateWindowTitle(state, action: PayloadAction<{ windowId: string; title: string }>) {
      const { windowId, title } = action.payload;
      const targetWindow = state.windows.find(win => win.id === windowId);
      
      if (targetWindow) {
        targetWindow.title = title;
      }
    },

    // 重置函数窗口状态
    resetFunctionWindowState(state) {
      Object.assign(state, initialState);
    }
  }
});

// 导出 action creators
export const { 
  addFunctionWindow, 
  closeFunctionWindow, 
  toggleMinimizeWindow, 
  toggleMaximizeWindow, 
  updateWindowPosition, 
  updateWindowSize, 
  updateWindowTitle, 
  resetFunctionWindowState 
} = functionWindowSlice.actions;

// 导出 reducer
export default functionWindowSlice.reducer;
