// WorkflowExecutor.ts - 工作流执行器，用于管理和执行整个工作流
import { NodeRegistry, nodeRegistry } from '../registry/NodeRegistry';

export interface WorkflowExecutionOptions {
  startNodeId?: string;
  context?: any;
  maxIterations?: number;
  timeout?: number;
}

export interface WorkflowExecutionResult {
  success: boolean;
  data: any;
  errors: Array<{ nodeId: string; error: string }>;
  executionTime: number;
}

export class WorkflowExecutor {
  private nodeRegistry: NodeRegistry;

  constructor(registry: NodeRegistry = nodeRegistry) {
    this.nodeRegistry = registry;
  }

  // 执行工作流
  async executeWorkflow(
    nodes: any[],
    edges: any[],
    options: WorkflowExecutionOptions = {}
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    const errors: Array<{ nodeId: string; error: string }> = [];
    const context = options.context || {};

    try {
      // 查找起始节点
      const startNode = this.findStartNode(nodes, options.startNodeId);
      if (!startNode) {
        throw new Error('Start node not found');
      }

      // 执行工作流
      const result = await this.executeNode(startNode, nodes, edges, context, errors);

      const executionTime = Date.now() - startTime;

      return {
        success: errors.length === 0,
        data: result,
        errors,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        data: null,
        errors: [{ nodeId: 'workflow', error: (error as Error).message || 'Workflow execution failed' }],
        executionTime
      };
    }
  }

  // 查找起始节点
  private findStartNode(nodes: any[], startNodeId?: string): any | null {
    if (startNodeId) {
      return nodes.find(node => node.id === startNodeId) || null;
    }

    // 如果没有指定起始节点ID，则查找第一个节点或类型为start的节点
    const startNode = nodes.find(node => node.data?.nodeType === 'start');
    if (startNode) {
      return startNode;
    }

    // 如果没有类型为start的节点，则返回第一个节点
    return nodes[0] || null;
  }

  // 执行单个节点
  private async executeNode(
    node: any,
    nodes: any[],
    edges: any[],
    context: any,
    errors: Array<{ nodeId: string; error: string }>
  ): Promise<any> {
    try {
      // 验证节点
      if (!this.nodeRegistry.validateNode(node)) {
        throw new Error('Node validation failed');
      }

      // 获取节点执行器
      const executor = this.nodeRegistry.getNodeExecutor(node.data?.nodeType);
      if (!executor) {
        throw new Error(`Node executor not found for type ${node.data?.nodeType}`);
      }

      // 执行节点
      const result = await executor.execute(node, context);

      // 找到所有输出连接
      const outgoingEdges = edges.filter(edge => edge.source === node.id);

      // 执行所有后续节点
      const nextResults = [];
      for (const edge of outgoingEdges) {
        const targetNode = nodes.find(n => n.id === edge.target);
        if (targetNode) {
          const nextResult = await this.executeNode(targetNode, nodes, edges, context, errors);
          nextResults.push(nextResult);
        }
      }

      // 如果只有一个后续节点，则返回该节点的结果；否则返回结果数组
      if (nextResults.length === 1) {
        return nextResults[0];
      } else if (nextResults.length > 1) {
        return nextResults;
      }

      // 如果没有后续节点，则返回当前节点的结果
      return result;
    } catch (error) {
      errors.push({ nodeId: node.id, error: (error as Error).message || 'Node execution failed' });
      throw error;
    }
  }

  // 暂停工作流
  pauseWorkflow(): void {
    // 这里可以实现暂停工作流的逻辑
    // 目前暂时为空
  }

  // 恢复工作流
  resumeWorkflow(): void {
    // 这里可以实现恢复工作流的逻辑
    // 目前暂时为空
  }

  // 终止工作流
  terminateWorkflow(): void {
    // 这里可以实现终止工作流的逻辑
    // 目前暂时为空
  }

  // 获取工作流执行状态
  getWorkflowStatus(): string {
    // 这里可以实现获取工作流执行状态的逻辑
    // 目前暂时返回'unknown'
    return 'unknown';
  }
}

// 创建全局工作流执行器实例
export const workflowExecutor = new WorkflowExecutor();
