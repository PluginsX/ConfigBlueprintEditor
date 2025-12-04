// 边领域模型
export class Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: any;

  constructor(
    id: string,
    source: string,
    target: string,
    sourceHandle?: string,
    targetHandle?: string,
    data?: any
  ) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.sourceHandle = sourceHandle;
    this.targetHandle = targetHandle;
    this.data = data;
  }

  // 更新边数据
  updateData(newData: Partial<any>): void {
    this.data = { ...this.data, ...newData };
  }

  // 更新源节点
  updateSource(newSource: string, sourceHandle?: string): void {
    this.source = newSource;
    if (sourceHandle !== undefined) {
      this.sourceHandle = sourceHandle;
    }
  }

  // 更新目标节点
  updateTarget(newTarget: string, targetHandle?: string): void {
    this.target = newTarget;
    if (targetHandle !== undefined) {
      this.targetHandle = targetHandle;
    }
  }

  // 检查边是否连接到特定节点
  isConnectedTo(nodeId: string): boolean {
    return this.source === nodeId || this.target === nodeId;
  }

  // 检查边是否使用特定的源手柄
  hasSourceHandle(handleId: string): boolean {
    return this.sourceHandle === handleId;
  }

  // 检查边是否使用特定的目标手柄
  hasTargetHandle(handleId: string): boolean {
    return this.targetHandle === handleId;
  }

  // 转换为JSON对象，用于存储或传输
  toJSON(): any {
    return {
      id: this.id,
      source: this.source,
      target: this.target,
      sourceHandle: this.sourceHandle,
      targetHandle: this.targetHandle,
      data: this.data
    };
  }

  // 从JSON对象创建Edge实例
  static fromJSON(json: any): Edge {
    return new Edge(
      json.id,
      json.source,
      json.target,
      json.sourceHandle,
      json.targetHandle,
      json.data
    );
  }
}