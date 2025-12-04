// BasicNodeExecutor.ts - 基本节点执行器，提供通用的节点执行逻辑
import { NodeExecutor } from '../registry/NodeRegistry';

export abstract class BasicNodeExecutor implements NodeExecutor {
  // 执行节点
  async execute(node: any, context: any): Promise<any> {
    try {
      // 验证节点
      if (!this.validate(node)) {
        throw new Error(`Node validation failed for node ${node.id}`);
      }

      // 执行节点的具体逻辑
      const result = await this.executeNodeLogic(node, context);

      // 处理执行结果
      return this.processResult(result, node, context);
    } catch (error) {
      // 处理执行错误
      return this.handleError(error, node, context);
    }
  }

  // 验证节点 - 抽象方法，需要子类实现
  abstract validate(node: any): boolean;

  // 执行节点的具体逻辑 - 抽象方法，需要子类实现
  abstract executeNodeLogic(node: any, context: any): Promise<any>;

  // 处理执行结果 - 可以被子类重写
  protected processResult(result: any, node: any, context: any): any {
    return result;
  }

  // 处理执行错误 - 可以被子类重写
  protected handleError(error: any, node: any, context: any): any {
    console.error(`Node execution error for node ${node.id}:`, error);
    return { error: error.message || 'Node execution failed' };
  }

  // 获取节点输入值 - 辅助方法
  protected getInputValue(node: any, inputId: string, context: any): any {
    // 这里可以根据需要实现从上下文或输入连接中获取值的逻辑
    // 目前暂时返回节点数据中的值
    return node.data?.inputs?.[inputId]?.value;
  }

  // 设置节点输出值 - 辅助方法
  protected setOutputValue(node: any, outputId: string, value: any, context: any): void {
    // 这里可以根据需要实现将值设置到上下文或输出连接中的逻辑
    // 目前暂时将值存储在节点数据中
    if (!node.data?.outputs) {
      node.data.outputs = {};
    }
    node.data.outputs[outputId] = { value };
  }

  // 获取节点属性 - 辅助方法
  protected getNodeProperty(node: any, propertyName: string, defaultValue: any = undefined): any {
    return node.data?.properties?.[propertyName] ?? defaultValue;
  }

  // 更新节点属性 - 辅助方法
  protected updateNodeProperty(node: any, propertyName: string, value: any): void {
    if (!node.data?.properties) {
      node.data.properties = {};
    }
    node.data.properties[propertyName] = value;
  }
}
