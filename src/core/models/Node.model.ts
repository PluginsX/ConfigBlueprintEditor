// 节点领域模型
import { NodeData } from '../types/NodeTypes';

export class Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;

  constructor(id: string, type: string, position: { x: number; y: number }, data: NodeData) {
    this.id = id;
    this.type = type;
    this.position = position;
    this.data = data;
  }

  // 更新节点数据
  updateData(newData: Partial<NodeData>): void {
    this.data = { ...this.data, ...newData };
  }

  // 更新节点位置
  updatePosition(newPosition: { x: number; y: number }): void {
    this.position = newPosition;
  }

  // 获取节点类型
  getType(): string {
    return this.type;
  }

  // 检查节点是否有特定属性
  hasProperty(propertyName: string): boolean {
    return propertyName in this.data;
  }

  // 获取节点属性值
  getProperty(propertyName: string): any {
    return this.data[propertyName];
  }

  // 设置节点属性值
  setProperty(propertyName: string, value: any): void {
    this.data[propertyName] = value;
  }

  // 转换为JSON对象，用于存储或传输
  toJSON(): any {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      data: this.data
    };
  }

  // 从JSON对象创建Node实例
  static fromJSON(json: any): Node {
    return new Node(
      json.id,
      json.type,
      json.position,
      json.data
    );
  }
}