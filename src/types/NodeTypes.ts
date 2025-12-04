// 节点类型定义
export interface NodePort {
  id: string;
  label: string;
  type: 'execution' | 'data';
  dataType?: 'string' | 'number' | 'boolean' | 'any' | 'array';
}

export interface NodeData {
  label: string;
  nodeType: string;
  inputs: NodePort[];
  outputs: NodePort[];
  properties?: Record<string, any>;
}

// 节点配置接口
export interface NodeConfig {
  label: string;
  inputs: NodePort[];
  outputs: NodePort[];
  color: string;
  properties?: Record<string, any>;
}

// 节点类型配置
export const NODE_TYPES_CONFIG: Record<string, NodeConfig> = {
  // 流程控制节点
  start: {
    label: '开始节点',
    inputs: [],
    outputs: [{ id: 'output-1', label: '执行', type: 'execution' }],
    color: '#4CAF50',
    properties: {}
  },
  condition: {
    label: '条件节点',
    inputs: [
      { id: 'input-1', label: '执行', type: 'execution' },
      { id: 'input-2', label: '条件', type: 'data', dataType: 'boolean' }
    ],
    outputs: [
      { id: 'output-1', label: '真', type: 'execution' },
      { id: 'output-2', label: '假', type: 'execution' }
    ],
    color: '#2196F3',
    properties: {}
  },
  loop: {
    label: '循环节点',
    inputs: [
      { id: 'input-1', label: '执行', type: 'execution' },
      { id: 'input-2', label: '次数', type: 'data', dataType: 'number' }
    ],
    outputs: [
      { id: 'output-1', label: '循环体', type: 'execution' },
      { id: 'output-2', label: '完成', type: 'execution' }
    ],
    color: '#FF9800',
    properties: {}
  },
  while: {
    label: 'While循环',
    inputs: [
      { id: 'input-1', label: '执行', type: 'execution' },
      { id: 'input-2', label: '条件', type: 'data', dataType: 'boolean' }
    ],
    outputs: [
      { id: 'output-1', label: '循环体', type: 'execution' },
      { id: 'output-2', label: '完成', type: 'execution' }
    ],
    color: '#FF9800',
    properties: {}
  },
  forloop: {
    label: 'For循环',
    inputs: [
      { id: 'input-1', label: '执行', type: 'execution' },
      { id: 'input-2', label: '起始', type: 'data', dataType: 'number' },
      { id: 'input-3', label: '结束', type: 'data', dataType: 'number' }
    ],
    outputs: [
      { id: 'output-1', label: '循环体', type: 'execution' },
      { id: 'output-2', label: '完成', type: 'execution' }
    ],
    color: '#FF9800',
    properties: {}
  },
  switch: {
    label: 'Switch节点',
    inputs: [
      { id: 'input-1', label: '执行', type: 'execution' },
      { id: 'input-2', label: '值', type: 'data', dataType: 'any' }
    ],
    outputs: [
      { id: 'output-1', label: '默认', type: 'execution' }
    ],
    color: '#2196F3',
    properties: { cases: [] }
  },
  foreach: {
    label: 'ForEach循环',
    inputs: [
      { id: 'input-1', label: '执行', type: 'execution' },
      { id: 'input-2', label: '数组', type: 'data', dataType: 'array' }
    ],
    outputs: [
      { id: 'output-1', label: '循环体', type: 'execution' },
      { id: 'output-2', label: '完成', type: 'execution' }
    ],
    color: '#FF9800',
    properties: {}
  },
  
  // 变量节点
  string: {
    label: '字符串变量',
    inputs: [],
    outputs: [{ id: 'output-1', label: '值', type: 'data', dataType: 'string' }],
    color: '#9C27B0',
    properties: { value: '' }
  },
  number: {
    label: '数字变量',
    inputs: [],
    outputs: [{ id: 'output-1', label: '值', type: 'data', dataType: 'number' }],
    color: '#607D8B',
    properties: { value: 0 }
  },
  boolean: {
    label: '布尔变量',
    inputs: [],
    outputs: [{ id: 'output-1', label: '值', type: 'data', dataType: 'boolean' }],
    color: '#795548',
    properties: { value: false }
  },
  
  // 函数节点
  function_define: {
    label: '函数定义',
    inputs: [
      { id: 'input-1', label: 'Entry', type: 'execution' }
    ],
    outputs: [
      { id: 'output-1', label: 'Return', type: 'execution' }
    ],
    color: '#E91E63',
    properties: { functionName: '', parameters: [] }
  },
  function_call: {
    label: '函数调用',
    inputs: [
      { id: 'input-1', label: '执行', type: 'execution' }
    ],
    outputs: [
      { id: 'output-1', label: '完成', type: 'execution' }
    ],
    color: '#E91E63',
    properties: { functionName: '', parameters: [] }
  },
  
  // 事件节点
  event_define: {
    label: '事件定义',
    inputs: [],
    outputs: [{ id: 'output-1', label: '触发', type: 'execution' }],
    color: '#FF5722',
    properties: { eventType: 'click' }
  },
  event_call: {
    label: '事件调用',
    inputs: [
      { id: 'input-1', label: '执行', type: 'execution' }
    ],
    outputs: [
      { id: 'output-1', label: '完成', type: 'execution' }
    ],
    color: '#FF5722',
    properties: { eventType: 'click' }
  }
};

// 变量类型
export type VariableType = 'string' | 'number' | 'boolean' | 'array';

export interface Variable {
  name: string;
  type: VariableType;
  value: any;
}

// 函数定义
export interface FunctionDefinition {
  name: string;
  parameters: string[];
  returnType: VariableType;
  nodes: any[]; // 函数内部的节点
}

// 事件类型
export type EventType = 'click' | 'keypress' | 'timer' | 'custom';
