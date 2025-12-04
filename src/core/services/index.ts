// 导出所有核心服务
import { NodeService } from './node.service';
import { EdgeService } from './edge.service';
import { BlueprintService } from './blueprint.service';

export { NodeService } from './node.service';
export { EdgeService } from './edge.service';
export { BlueprintService } from './blueprint.service';

// 提供一个便捷的方式来初始化所有服务
export const initializeCoreServices = () => {
  const nodeService = new NodeService();
  const edgeService = new EdgeService();
  const blueprintService = new BlueprintService(nodeService, edgeService);

  return { nodeService, edgeService, blueprintService };
};
