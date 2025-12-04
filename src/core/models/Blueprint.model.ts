// 蓝图领域模型
import { Node } from './Node.model';
import { Edge } from './Edge.model';

export class Blueprint {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
  data?: any;

  constructor(
    id: string,
    name: string,
    nodes: Node[] = [],
    edges: Edge[] = [],
    createdAt?: Date,
    updatedAt?: Date,
    data?: any
  ) {
    this.id = id;
    this.name = name;
    this.nodes = nodes;
    this.edges = edges;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.data = data;
  }

  // 添加节点
  addNode(node: Node): void {
    this.nodes.push(node);
    this.updateTimestamp();
  }

  // 移除节点
  removeNode(nodeId: string): void {
    this.nodes = this.nodes.filter(node => node.id !== nodeId);
    // 同时移除连接到该节点的所有边
    this.edges = this.edges.filter(edge => !edge.isConnectedTo(nodeId));
    this.updateTimestamp();
  }

  // 查找节点
  findNode(nodeId: string): Node | undefined {
    return this.nodes.find(node => node.id === nodeId);
  }

  // 添加边
  addEdge(edge: Edge): void {
    this.edges.push(edge);
    this.updateTimestamp();
  }

  // 移除边
  removeEdge(edgeId: string): void {
    this.edges = this.edges.filter(edge => edge.id !== edgeId);
    this.updateTimestamp();
  }

  // 查找边
  findEdge(edgeId: string): Edge | undefined {
    return this.edges.find(edge => edge.id === edgeId);
  }

  // 获取连接到特定节点的所有边
  getEdgesConnectedTo(nodeId: string): Edge[] {
    return this.edges.filter(edge => edge.isConnectedTo(nodeId));
  }

  // 更新蓝图名称
  updateName(newName: string): void {
    this.name = newName;
    this.updateTimestamp();
  }

  // 更新蓝图数据
  updateData(newData: Partial<any>): void {
    this.data = { ...this.data, ...newData };
    this.updateTimestamp();
  }

  // 清空蓝图
  clear(): void {
    this.nodes = [];
    this.edges = [];
    this.updateTimestamp();
  }

  // 检查蓝图是否为空
  isEmpty(): boolean {
    return this.nodes.length === 0 && this.edges.length === 0;
  }

  // 获取蓝图中节点的数量
  getNodeCount(): number {
    return this.nodes.length;
  }

  // 获取蓝图中边的数量
  getEdgeCount(): number {
    return this.edges.length;
  }

  // 更新时间戳
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  // 转换为JSON对象，用于存储或传输
  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      nodes: this.nodes.map(node => node.toJSON()),
      edges: this.edges.map(edge => edge.toJSON()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      data: this.data
    };
  }

  // 从JSON对象创建Blueprint实例
  static fromJSON(json: any): Blueprint {
    const nodes = json.nodes ? json.nodes.map((nodeJson: any) => Node.fromJSON(nodeJson)) : [];
    const edges = json.edges ? json.edges.map((edgeJson: any) => Edge.fromJSON(edgeJson)) : [];
    
    return new Blueprint(
      json.id,
      json.name,
      nodes,
      edges,
      json.createdAt ? new Date(json.createdAt) : undefined,
      json.updatedAt ? new Date(json.updatedAt) : undefined,
      json.data
    );
  }
}