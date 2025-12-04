// 节点服务
import { Node } from '../models/Node.model';
import { NodeData } from '../types/NodeTypes';

export class NodeService {
  // 创建新节点
  createNode(type: string, position: { x: number; y: number }, data: NodeData): Node {
    const id = this.generateUniqueId();
    return new Node(id, type, position, data);
  }

  // 更新节点
  updateNode(node: Node, updates: { position?: { x: number; y: number }; data?: Partial<NodeData> }): void {
    if (updates.position) {
      node.updatePosition(updates.position);
    }
    if (updates.data) {
      node.updateData(updates.data);
    }
  }

  // 复制节点
  copyNode(node: Node, offset: { x: number; y: number } = { x: 50, y: 50 }): Node {
    const newId = this.generateUniqueId();
    const newPosition = { x: node.position.x + offset.x, y: node.position.y + offset.y };
    const newData = { ...node.data };
    
    return new Node(newId, node.type, newPosition, newData);
  }

  // 批量创建节点
  createNodes(nodesData: Array<{ type: string; position: { x: number; y: number }; data: NodeData }>): Node[] {
    return nodesData.map(data => this.createNode(data.type, data.position, data.data));
  }

  // 验证节点数据
  validateNodeData(type: string, data: NodeData): boolean {
    // 根据节点类型验证数据
    switch (type) {
      case 'event':
        return !!data.eventType;
      case 'function':
        return !!data.functionName;
      case 'variable':
        return !!data.variableName;
      default:
        return true;
    }
  }

  // 生成唯一ID
  private generateUniqueId(): string {
    return `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}