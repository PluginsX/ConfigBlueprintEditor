// NodeRegistry.ts - 节点注册器，用于注册和管理所有节点类型

export interface NodeExecutor {
  execute(node: any, context: any): Promise<any> | any;
  validate(node: any): boolean;
}

export interface NodeRegistryEntry {
  type: string;
  label: string;
  executor: NodeExecutor;
  inputs?: Array<{ id: string; label: string; type: string; dataType?: string }>;
  outputs?: Array<{ id: string; label: string; type: string; dataType?: string }>;
  properties?: Record<string, any>;
}

export class NodeRegistry {
  private registry: Map<string, NodeRegistryEntry> = new Map();

  // 注册节点类型
  registerNodeType(
    type: string,
    label: string,
    executor: NodeExecutor,
    inputs?: Array<{ id: string; label: string; type: string; dataType?: string }>,
    outputs?: Array<{ id: string; label: string; type: string; dataType?: string }>,
    properties?: Record<string, any>
  ): void {
    if (this.registry.has(type)) {
      throw new Error(`Node type '${type}' is already registered`);
    }

    this.registry.set(type, {
      type,
      label,
      executor,
      inputs: inputs || [],
      outputs: outputs || [],
      properties: properties || {}
    });
  }

  // 注销节点类型
  unregisterNodeType(type: string): void {
    if (!this.registry.has(type)) {
      throw new Error(`Node type '${type}' is not registered`);
    }

    this.registry.delete(type);
  }

  // 获取节点类型信息
  getNodeTypeInfo(type: string): NodeRegistryEntry | undefined {
    return this.registry.get(type);
  }

  // 获取节点执行器
  getNodeExecutor(type: string): NodeExecutor | undefined {
    return this.registry.get(type)?.executor;
  }

  // 验证节点
  validateNode(node: any): boolean {
    if (!node.data?.nodeType) {
      return false;
    }

    const nodeInfo = this.getNodeTypeInfo(node.data.nodeType);
    if (!nodeInfo) {
      return false;
    }

    return nodeInfo.executor.validate(node);
  }

  // 获取所有注册的节点类型
  getAllNodeTypes(): NodeRegistryEntry[] {
    return Array.from(this.registry.values());
  }

  // 根据节点类型筛选节点
  getNodeTypesByCategory(category: string): NodeRegistryEntry[] {
    // 这里可以根据需要实现分类筛选
    // 目前暂时返回所有节点类型
    return this.getAllNodeTypes();
  }

  // 检查节点类型是否已注册
  isNodeTypeRegistered(type: string): boolean {
    return this.registry.has(type);
  }

  // 清空注册器
  clear(): void {
    this.registry.clear();
  }
}

// 创建全局节点注册器实例
export const nodeRegistry = new NodeRegistry();
