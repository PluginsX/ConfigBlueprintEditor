// 蓝图服务
import { Blueprint } from '../models/Blueprint.model';
import { Node } from '../models/Node.model';
import { Edge } from '../models/Edge.model';
import { NodeService } from './node.service';
import { EdgeService } from './edge.service';


export class BlueprintService {
  private nodeService: NodeService;
  private edgeService: EdgeService;

  constructor(nodeService: NodeService, edgeService: EdgeService) {
    this.nodeService = nodeService;
    this.edgeService = edgeService;
  }

  // 创建新蓝图
  createBlueprint(name: string): Blueprint {
    const id = this.generateUniqueId();
    return new Blueprint(id, name);
  }

  // 加载蓝图
  loadBlueprint(data: any): Blueprint {
    return Blueprint.fromJSON(data);
  }

  // 保存蓝图
  saveBlueprint(blueprint: Blueprint): any {
    return blueprint.toJSON();
  }

  // 更新蓝图名称
  updateBlueprintName(blueprint: Blueprint, newName: string): void {
    blueprint.updateName(newName);
  }

  // 更新蓝图数据
  updateBlueprintData(blueprint: Blueprint, newData: Partial<any>): void {
    blueprint.updateData(newData);
  }

  // 添加节点到蓝图
  addNodeToBlueprint(blueprint: Blueprint, node: Node): void {
    blueprint.addNode(node);
  }

  // 从蓝图中移除节点
  removeNodeFromBlueprint(blueprint: Blueprint, nodeId: string): void {
    blueprint.removeNode(nodeId);
  }

  // 在蓝图中创建并添加节点
  createAndAddNodeToBlueprint(
    blueprint: Blueprint,
    type: any,
    position: { x: number; y: number },
    data: any
  ): Node {
    const node = this.nodeService.createNode(type, position, data);
    this.addNodeToBlueprint(blueprint, node);
    return node;
  }

  // 添加边到蓝图
  addEdgeToBlueprint(blueprint: Blueprint, edge: Edge): void {
    blueprint.addEdge(edge);
  }

  // 从蓝图中移除边
  removeEdgeFromBlueprint(blueprint: Blueprint, edgeId: string): void {
    blueprint.removeEdge(edgeId);
  }

  // 在蓝图中创建并添加边
  createAndAddEdgeToBlueprint(
    blueprint: Blueprint,
    source: string,
    target: string,
    sourceHandle?: string,
    targetHandle?: string,
    data?: any
  ): Edge | undefined {
    // 验证边连接
    if (this.edgeService.validateEdgeConnection(source, target, sourceHandle, targetHandle)) {
      const edge = this.edgeService.createEdge(source, target, sourceHandle, targetHandle, data);
      this.addEdgeToBlueprint(blueprint, edge);
      return edge;
    }
    
    return undefined;
  }

  // 复制蓝图
  copyBlueprint(original: Blueprint): Blueprint {
    const newId = this.generateUniqueId();
    const newName = `${original.name} - 副本`;
    
    // 复制节点
    const nodeIdMap: { [oldNodeId: string]: string } = {};
    const newNodes = original.nodes.map(node => {
      const newNode = this.nodeService.copyNode(node);
      nodeIdMap[node.id] = newNode.id;
      return newNode;
    });
    
    // 复制边
    const newEdges = original.edges
      .map(edge => this.edgeService.copyEdge(edge, nodeIdMap))
      .filter(edge => edge !== undefined) as Edge[];
    
    return new Blueprint(newId, newName, newNodes, newEdges);
  }

  // 清空蓝图
  clearBlueprint(blueprint: Blueprint): void {
    blueprint.clear();
  }

  // 验证蓝图
  validateBlueprint(blueprint: Blueprint): boolean {
    // 基本验证：蓝图必须有名称
    if (!blueprint.name || blueprint.name.trim() === '') {
      return false;
    }

    // 验证所有节点数据
    for (const node of blueprint.nodes) {
      if (!this.nodeService.validateNodeData(node.type, node.data)) {
        return false;
      }
    }

    // 验证所有边连接
    for (const edge of blueprint.edges) {
      if (!this.edgeService.validateEdgeConnection(edge.source, edge.target, edge.sourceHandle, edge.targetHandle)) {
        return false;
      }

      // 验证边的源节点和目标节点是否存在于蓝图中
      if (!blueprint.findNode(edge.source) || !blueprint.findNode(edge.target)) {
        return false;
      }
    }

    return true;
  }

  // 生成唯一ID
  private generateUniqueId(): string {
    return `blueprint_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}