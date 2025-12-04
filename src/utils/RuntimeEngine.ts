import { Node, Edge } from 'reactflow';
import { NodeData, Variable, FunctionDefinition } from '../types/NodeTypes';

// 运行时上下文
export interface RuntimeContext {
  variables: Map<string, Variable>;
  functions: Map<string, FunctionDefinition>;
  currentNode: string | null;
  callStack: string[];
}

// 执行结果
export interface ExecutionResult {
  success: boolean;
  nextNode?: string;
  output?: any;
  error?: string;
}

// 运行时引擎类
export class RuntimeEngine {
  private nodes: Node<NodeData>[];
  private edges: Edge[];
  private context: RuntimeContext;

  constructor(nodes: Node<NodeData>[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.context = {
      variables: new Map(),
      functions: new Map(),
      currentNode: null,
      callStack: []
    };
  }

  // 查找开始节点
  private findStartNode(): Node<NodeData> | null {
    return this.nodes.find(node => node.data.nodeType === 'start') || null;
  }

  // 根据ID查找节点
  private findNodeById(nodeId: string): Node<NodeData> | null {
    return this.nodes.find(node => node.id === nodeId) || null;
  }

  // 查找从指定节点出发的连接
  private findConnectionsFromNode(nodeId: string, portId?: string): Edge[] {
    return this.edges.filter(edge => 
      edge.source === nodeId && (!portId || edge.sourceHandle === portId)
    );
  }

  // 执行单个节点
  private executeNode(node: Node<NodeData>): ExecutionResult {
    const { nodeType } = node.data;

    switch (nodeType) {
      case 'start':
        return this.executeStartNode(node);
      case 'condition':
        return this.executeConditionNode(node);
      case 'loop':
        return this.executeLoopNode(node);
      case 'string':
      case 'number':
      case 'boolean':
        return this.executeVariableNode(node);
      case 'function':
        return this.executeFunctionNode(node);
      case 'event':
        return this.executeEventNode(node);
      default:
        return { success: false, error: `未知节点类型: ${nodeType}` };
    }
  }

  // 执行开始节点
  private executeStartNode(node: Node<NodeData>): ExecutionResult {
    // 开始节点只有一个输出端口
    const connections = this.findConnectionsFromNode(node.id, 'output-1');
    if (connections.length > 0) {
      return { success: true, nextNode: connections[0].target };
    }
    return { success: true }; // 没有连接，执行结束
  }

  // 执行条件节点
  private executeConditionNode(node: Node<NodeData>): ExecutionResult {
    // 这里简化处理，实际应该根据条件值选择输出端口
    const conditionValue = node.data.properties?.condition || true;
    const outputPort = conditionValue ? 'output-1' : 'output-2';
    const connections = this.findConnectionsFromNode(node.id, outputPort);
    
    if (connections.length > 0) {
      return { success: true, nextNode: connections[0].target };
    }
    return { success: true };
  }

  // 执行循环节点
  private executeLoopNode(node: Node<NodeData>): ExecutionResult {
    const loopCount = node.data.properties?.count || 1;
    
    // 简化实现：只执行一次循环体
    const loopBodyConnections = this.findConnectionsFromNode(node.id, 'output-1');
    if (loopBodyConnections.length > 0) {
      return { success: true, nextNode: loopBodyConnections[0].target };
    }
    
    return { success: true };
  }

  // 执行变量节点
  private executeVariableNode(node: Node<NodeData>): ExecutionResult {
    const variableName = `var_${node.id}`;
    const variableValue = node.data.properties?.value;
    
    // 存储变量到上下文
    this.context.variables.set(variableName, {
      name: variableName,
      type: node.data.nodeType as any,
      value: variableValue
    });

    return { success: true, output: variableValue };
  }

  // 执行函数节点
  private executeFunctionNode(node: Node<NodeData>): ExecutionResult {
    const functionName = node.data.properties?.functionName || `func_${node.id}`;
    
    // 简化实现：记录函数调用
    this.context.callStack.push(functionName);
    
    const connections = this.findConnectionsFromNode(node.id, 'output-1');
    if (connections.length > 0) {
      return { success: true, nextNode: connections[0].target };
    }
    
    return { success: true };
  }

  // 执行事件节点
  private executeEventNode(node: Node<NodeData>): ExecutionResult {
    const eventType = node.data.properties?.eventType || 'click';
    
    // 事件节点等待外部触发，这里只是模拟执行
    console.log(`事件触发: ${eventType}`);
    
    const connections = this.findConnectionsFromNode(node.id, 'output-1');
    if (connections.length > 0) {
      return { success: true, nextNode: connections[0].target };
    }
    
    return { success: true };
  }

  // 执行整个流程图
  public async execute(): Promise<ExecutionResult> {
    const startNode = this.findStartNode();
    if (!startNode) {
      return { success: false, error: '未找到开始节点' };
    }

    this.context.currentNode = startNode.id;
    let currentNode: Node<NodeData> | null = startNode;

    while (currentNode) {
      const result = this.executeNode(currentNode);
      
      if (!result.success) {
        return result;
      }

      if (result.nextNode) {
        currentNode = this.findNodeById(result.nextNode);
      } else {
        currentNode = null; // 执行结束
      }
    }

    return { success: true, output: '执行完成' };
  }

  // 获取变量值
  public getVariable(name: string): Variable | undefined {
    return this.context.variables.get(name);
  }

  // 设置变量值
  public setVariable(name: string, value: any, type: string): void {
    this.context.variables.set(name, { name, type: type as any, value });
  }

  // 获取当前执行状态
  public getExecutionState(): RuntimeContext {
    return { ...this.context };
  }
}
