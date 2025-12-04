// ConditionNodeExecutor.ts - 条件判断节点执行器
import { BasicNodeExecutor } from './BasicNodeExecutor';

export class ConditionNodeExecutor extends BasicNodeExecutor {
  // 验证节点
  validate(node: any): boolean {
    const nodeType = node.data?.nodeType;
    if (!nodeType || nodeType !== 'condition') return false;

    // 验证节点是否有输入值
    const inputs = node.data?.inputs;
    if (!inputs || !inputs['input-1'] || !inputs['input-2']) return false;

    // 验证比较运算符是否有效
    const operator = node.data?.properties?.operator;
    if (!operator) return false;

    const validOperators = ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'and', 'or', 'not'];
    if (!validOperators.includes(operator)) return false;

    return true;
  }

  // 执行节点的具体逻辑
  async executeNodeLogic(node: any, context: any): Promise<any> {
    const inputs = node.data?.inputs;
    const operator = node.data?.properties?.operator;

    if (!inputs || !operator) {
      throw new Error('Invalid node data');
    }

    const value1 = inputs['input-1'].value;
    const value2 = inputs['input-2']?.value;
    let result: boolean;

    // 执行相应的条件判断
    switch (operator) {
      case 'eq':
        result = value1 === value2;
        break;
      case 'neq':
        result = value1 !== value2;
        break;
      case 'gt':
        result = Number(value1) > Number(value2);
        break;
      case 'lt':
        result = Number(value1) < Number(value2);
        break;
      case 'gte':
        result = Number(value1) >= Number(value2);
        break;
      case 'lte':
        result = Number(value1) <= Number(value2);
        break;
      case 'and':
        result = Boolean(value1) && Boolean(value2);
        break;
      case 'or':
        result = Boolean(value1) || Boolean(value2);
        break;
      case 'not':
        result = !Boolean(value1);
        break;
      default:
        throw new Error(`Unknown condition operator: ${operator}`);
    }

    // 将结果设置到输出
    this.setOutputValue(node, 'output-1', result, context);

    // 根据结果选择输出端口
    const outputPort = result ? 'output-1' : 'output-2';

    return { success: true, result, outputPort };
  }
}
