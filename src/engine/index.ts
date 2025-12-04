// engine/index.ts - 运行时引擎统一入口
import { nodeRegistry } from './registry/NodeRegistry';
import { workflowExecutor } from './runtime/WorkflowExecutor';
import { MathNodeExecutor } from './execute/MathNodeExecutor';
import { ConditionNodeExecutor } from './execute/ConditionNodeExecutor';

// 初始化引擎 - 注册所有节点类型
function initializeEngine(): void {
  // 注册数值运算节点
  registerMathNodes();
  
  // 注册条件判断节点
  registerConditionNodes();
  
  // 注册其他类型的节点
  // registerOtherNodes();
}

// 注册数值运算节点
function registerMathNodes(): void {
  const mathExecutor = new MathNodeExecutor();
  
  // 加法节点
  nodeRegistry.registerNodeType(
    'add',
    '加法',
    mathExecutor,
    [
      { id: 'input-1', label: '输入1', type: 'number', dataType: 'number' },
      { id: 'input-2', label: '输入2', type: 'number', dataType: 'number' }
    ],
    [
      { id: 'output-1', label: '输出', type: 'number', dataType: 'number' }
    ],
    { description: '将两个数值相加' }
  );
  
  // 减法节点
  nodeRegistry.registerNodeType(
    'subtract',
    '减法',
    mathExecutor,
    [
      { id: 'input-1', label: '输入1', type: 'number', dataType: 'number' },
      { id: 'input-2', label: '输入2', type: 'number', dataType: 'number' }
    ],
    [
      { id: 'output-1', label: '输出', type: 'number', dataType: 'number' }
    ],
    { description: '将两个数值相减' }
  );
  
  // 乘法节点
  nodeRegistry.registerNodeType(
    'multiply',
    '乘法',
    mathExecutor,
    [
      { id: 'input-1', label: '输入1', type: 'number', dataType: 'number' },
      { id: 'input-2', label: '输入2', type: 'number', dataType: 'number' }
    ],
    [
      { id: 'output-1', label: '输出', type: 'number', dataType: 'number' }
    ],
    { description: '将两个数值相乘' }
  );
  
  // 除法节点
  nodeRegistry.registerNodeType(
    'divide',
    '除法',
    mathExecutor,
    [
      { id: 'input-1', label: '输入1', type: 'number', dataType: 'number' },
      { id: 'input-2', label: '输入2', type: 'number', dataType: 'number' }
    ],
    [
      { id: 'output-1', label: '输出', type: 'number', dataType: 'number' }
    ],
    { description: '将两个数值相除' }
  );
  
  // 取模节点
  nodeRegistry.registerNodeType(
    'modulus',
    '取模',
    mathExecutor,
    [
      { id: 'input-1', label: '输入1', type: 'number', dataType: 'number' },
      { id: 'input-2', label: '输入2', type: 'number', dataType: 'number' }
    ],
    [
      { id: 'output-1', label: '输出', type: 'number', dataType: 'number' }
    ],
    { description: '计算两个数值的模' }
  );
  
  // 幂运算节点
  nodeRegistry.registerNodeType(
    'power',
    '幂运算',
    mathExecutor,
    [
      { id: 'input-1', label: '输入1', type: 'number', dataType: 'number' },
      { id: 'input-2', label: '输入2', type: 'number', dataType: 'number' }
    ],
    [
      { id: 'output-1', label: '输出', type: 'number', dataType: 'number' }
    ],
    { description: '计算数值的幂' }
  );
}

// 注册条件判断节点
function registerConditionNodes(): void {
  const conditionExecutor = new ConditionNodeExecutor();
  
  // 条件判断节点
  nodeRegistry.registerNodeType(
    'condition',
    '条件判断',
    conditionExecutor,
    [
      { id: 'input-1', label: '输入1', type: 'any', dataType: 'any' },
      { id: 'input-2', label: '输入2', type: 'any', dataType: 'any' }
    ],
    [
      { id: 'output-1', label: '输出1 (true)', type: 'boolean', dataType: 'boolean' },
      { id: 'output-2', label: '输出2 (false)', type: 'boolean', dataType: 'boolean' }
    ],
    {
      description: '根据条件判断结果选择输出端口',
      operator: 'eq' // 默认比较运算符
    }
  );
}

// 导出引擎组件
export { 
  nodeRegistry, 
  workflowExecutor, 
  initializeEngine 
};

// 导出类型
export type { 
  NodeExecutor, 
  NodeRegistryEntry 
} from './registry/NodeRegistry';

export type { 
  WorkflowExecutionOptions, 
  WorkflowExecutionResult 
} from './runtime/WorkflowExecutor';
