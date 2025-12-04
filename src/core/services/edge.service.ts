// 边服务
import { Edge } from '../models/Edge.model';

export class EdgeService {
  // 创建新边
  createEdge(
    source: string,
    target: string,
    sourceHandle?: string,
    targetHandle?: string,
    data?: any
  ): Edge {
    const id = this.generateUniqueId();
    return new Edge(id, source, target, sourceHandle, targetHandle, data);
  }

  // 更新边
  updateEdge(
    edge: Edge,
    updates: { source?: string; target?: string; sourceHandle?: string; targetHandle?: string; data?: Partial<any> }
  ): void {
    if (updates.source !== undefined) {
      const newSourceHandle = updates.sourceHandle !== undefined ? updates.sourceHandle : edge.sourceHandle;
      edge.updateSource(updates.source, newSourceHandle);
    } else if (updates.sourceHandle !== undefined) {
      // 只更新源手柄
      edge.updateSource(edge.source, updates.sourceHandle);
    }

    if (updates.target !== undefined) {
      const newTargetHandle = updates.targetHandle !== undefined ? updates.targetHandle : edge.targetHandle;
      edge.updateTarget(updates.target, newTargetHandle);
    } else if (updates.targetHandle !== undefined) {
      // 只更新目标手柄
      edge.updateTarget(edge.target, updates.targetHandle);
    }

    if (updates.data) {
      edge.updateData(updates.data);
    }
  }

  // 复制边
  copyEdge(edge: Edge, nodeIdMap: { [oldNodeId: string]: string }): Edge | undefined {
    // 检查源节点和目标节点是否都在映射中
    if (nodeIdMap[edge.source] && nodeIdMap[edge.target]) {
      const newSource = nodeIdMap[edge.source];
      const newTarget = nodeIdMap[edge.target];
      
      return this.createEdge(newSource, newTarget, edge.sourceHandle, edge.targetHandle, { ...edge.data });
    }
    
    // 如果源节点或目标节点不在映射中，则不复制该边
    return undefined;
  }

  // 批量创建边
  createEdges(
    edgesData: Array<{ source: string; target: string; sourceHandle?: string; targetHandle?: string; data?: any }>
  ): Edge[] {
    return edgesData.map(data => this.createEdge(data.source, data.target, data.sourceHandle, data.targetHandle, data.data));
  }

  // 验证边连接
  validateEdgeConnection(source: string, target: string, sourceHandle?: string, targetHandle?: string): boolean {
    // 基本验证：源节点和目标节点不能相同
    if (source === target) {
      return false;
    }

    // 可以根据需要添加更多验证逻辑
    // 例如：检查源节点是否有指定的源手柄
    // 检查目标节点是否有指定的目标手柄
    // 检查源节点和目标节点类型是否兼容

    return true;
  }

  // 生成唯一ID
  private generateUniqueId(): string {
    return `edge_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}