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
  [key: string]: any;
}

// 节点配置接口
export interface NodeConfig {
  label: string;
  inputs: NodePort[];
  outputs: NodePort[];
  color: string;
  properties?: Record<string, any>;
}

// 节点类型配置 - UE蓝图风格颜色方案
export const NODE_TYPES_CONFIG: Record<string, NodeConfig> = {
  // 事件节点 - 红色系 (UE蓝图事件节点通常为红色)
  start: {
    label: '开始节点',
    inputs: [],
    outputs: [{ id: 'output-1', label: '执行', type: 'execution' }],
    color: '#FF4444',
    properties: {}
  },
  event_define: {
    label: '事件定义',
    inputs: [],
    outputs: [{ id: 'output-1', label: '触发', type: 'execution' }],
    color: '#FF6B6B',
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
    color: '#FF6B6B',
    properties: { eventType: 'click' }
  },

  // 流程控制节点 - 蓝色系 (UE蓝图流程控制节点通常为蓝色)
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
    color: '#4A90E2',
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
    color: '#4A90E2',
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
    color: '#4A90E2',
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
    color: '#4A90E2',
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
    color: '#4A90E2',
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
    color: '#4A90E2',
    properties: {}
  },
  
  // 函数节点 - 紫色系 (UE蓝图函数节点通常为紫色)
  function_define: {
    label: '函数定义',
    inputs: [
      { id: 'input-1', label: 'Entry', type: 'execution' }
    ],
    outputs: [
      { id: 'output-1', label: 'Return', type: 'execution' }
    ],
    color: '#9C27B0',
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
    color: '#9C27B0',
    properties: { functionName: '', parameters: [] }
  },
  
  // 变量节点 - 根据数据类型设置不同颜色
  string: {
    label: '字符串变量',
    inputs: [],
    outputs: [{ id: 'output-1', label: '值', type: 'data', dataType: 'string' }],
    color: '#4CAF50',  // 绿色 - 字符串
    properties: { value: '' }
  },
  number: {
    label: '数字变量',
    inputs: [],
    outputs: [{ id: 'output-1', label: '值', type: 'data', dataType: 'number' }],
    color: '#2196F3',  // 蓝色 - 数字
    properties: { value: 0 }
  },
  boolean: {
    label: '布尔变量',
    inputs: [],
    outputs: [{ id: 'output-1', label: '值', type: 'data', dataType: 'boolean' }],
    color: '#FF9800',  // 橙色 - 布尔值
    properties: { value: false }
  },
  array: {
    label: '数组变量',
    inputs: [],
    outputs: [{ id: 'output-1', label: '值', type: 'data', dataType: 'array' }],
    color: '#FF5722',  // 深橙色 - 数组
    properties: { value: [] }
  },
  
  // 数值运算节点 - 青色系（只有数据引脚，无执行引脚）
  add: {
    label: '+',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'number' }],
    color: '#00BCD4',  // 青色 - 加法
    properties: { operator: '+' }
  },
  subtract: {
    label: '-',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'number' }],
    color: '#00BCD4',  // 青色 - 减法
    properties: { operator: '-' }
  },
  multiply: {
    label: '*',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'number' }],
    color: '#00BCD4',  // 青色 - 乘法
    properties: { operator: '*' }
  },
  divide: {
    label: '/',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'number' }],
    color: '#00BCD4',  // 青色 - 除法
    properties: { operator: '/' }
  },
  modulo: {
    label: '%',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'number' }],
    color: '#00BCD4',  // 青色 - 取模
    properties: { operator: '%' }
  },
  power: {
    label: '^',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'number' }],
    color: '#00BCD4',  // 青色 - 幂运算
    properties: { operator: '^' }
  },
  
  // 比较运算节点 - 紫色系（只有数据引脚，无执行引脚）
  equal: {
    label: '==',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'any' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'any' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'boolean' }],
    color: '#9C27B0',  // 紫色 - 等于
    properties: { operator: '==' }
  },
  not_equal: {
    label: '!=',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'any' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'any' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'boolean' }],
    color: '#9C27B0',  // 紫色 - 不等于
    properties: { operator: '!=' }
  },
  greater: {
    label: '>',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'boolean' }],
    color: '#9C27B0',  // 紫色 - 大于
    properties: { operator: '>' }
  },
  less: {
    label: '<',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'boolean' }],
    color: '#9C27B0',  // 紫色 - 小于
    properties: { operator: '<' }
  },
  greater_or_equal: {
    label: '>=',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'boolean' }],
    color: '#9C27B0',  // 紫色 - 大于等于
    properties: { operator: '>=' }
  },
  less_or_equal: {
    label: '<=',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'number' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'number' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'boolean' }],
    color: '#9C27B0',  // 紫色 - 小于等于
    properties: { operator: '<=' }
  },
  
  // 逻辑运算节点 - 橙色系（只有数据引脚，无执行引脚）
  and: {
    label: '&&',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'boolean' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'boolean' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'boolean' }],
    color: '#FF9800',  // 橙色 - 与
    properties: { operator: '&&' }
  },
  or: {
    label: '||',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'boolean' },
      { id: 'input-2', label: 'B', type: 'data', dataType: 'boolean' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'boolean' }],
    color: '#FF9800',  // 橙色 - 或
    properties: { operator: '||' }
  },
  not: {
    label: '!',
    inputs: [
      { id: 'input-1', label: 'A', type: 'data', dataType: 'boolean' }
    ],
    outputs: [{ id: 'output-1', label: '结果', type: 'data', dataType: 'boolean' }],
    color: '#FF9800',  // 橙色 - 非
    properties: { operator: '!' }
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
