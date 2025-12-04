import { Node, Edge } from 'reactflow';

// 蓝图状态（State）定义
export interface BlueprintState {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  isFunction?: boolean; // 是否为函数蓝图
  parentStateId?: string; // 父级状态ID（用于函数嵌套）
}

// 应用状态管理
export interface AppState {
  currentStateId: string;
  states: BlueprintState[];
  selectedNode: Node | null;
  functionWindows: FunctionWindow[]; // 打开的独立函数窗口
}

// 函数窗口定义
export interface FunctionWindow {
  id: string;
  stateId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
}

// 初始应用状态
export const initialAppState: AppState = {
  currentStateId: 'main',
  states: [
    {
      id: 'main',
      name: '主蓝图',
      nodes: [
        {
          id: '1',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { 
            label: '开始节点',
            nodeType: 'start',
            inputs: [],
            outputs: [{ id: 'output-1', label: '执行', type: 'execution' }]
          },
        },
      ],
      edges: [],
      isFunction: false
    }
  ],
  selectedNode: null,
  functionWindows: []
};
