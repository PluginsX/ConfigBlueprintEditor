// MathNodeExecutor.ts - 数值运算节点执行器
import { BasicNodeExecutor } from './BasicNodeExecutor';

export class MathNodeExecutor extends BasicNodeExecutor {
  // 验证节点
  validate(node: any): boolean {
    const nodeType = node.data?.nodeType;
    if (!nodeType) return false;

    // 验证节点类型是否为数值运算节点
    const mathTypes = ['add', 'subtract', 'multiply', 'divide', 'modulus', 'power'];
    if (!mathTypes.includes(nodeType)) return false;

    // 验证节点是否有输入值
    const inputs = node.data?.inputs;
    if (!inputs || !inputs['input-1'] || !inputs['input-2']) return false;

    // 验证输入值是否为数值
    const value1 = inputs['input-1'].value;
    const value2 = inputs['input-2'].value;

    return !isNaN(value1) && !isNaN(value2);
  }

  // 执行节点的具体逻辑
  async executeNodeLogic(node: any, context: any): Promise<any> {
    const nodeType = node.data?.nodeType;
    const inputs = node.data?.inputs;

    if (!nodeType || !inputs) {
      throw new Error('Invalid node data');
    }

    const value1 = Number(inputs['input-1'].value);
    const value2 = Number(inputs['input-2'].value);
    let result: number;

    // 执行相应的数值运算
    switch (nodeType) {
      case 'add':
        result = value1 + value2;
        break;
      case 'subtract':
        result = value1 - value2;
        break;
      case 'multiply':
        result = value1 * value2;
        break;
      case 'divide':
        if (value2 === 0) {
          throw new Error('Division by zero');
        }
        result = value1 / value2;
        break;
      case 'modulus':
        if (value2 === 0) {
          throw new Error('Modulus by zero');
        }
        result = value1 % value2;
        break;
      case 'power':
        result = Math.pow(value1, value2);
        break;
      default:
        throw new Error(`Unknown math operation: ${nodeType}`);
    }

    // 将结果设置到输出
    this.setOutputValue(node, 'output-1', result, context);

    return { success: true, result };
  }
}
