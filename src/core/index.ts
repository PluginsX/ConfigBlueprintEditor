// 导出所有核心组件
export * from './types';
export * from './models';
export * from './services';

// 导出引擎组件
export * from '../engine';

// 提供一个便捷的方式来初始化整个核心模块
export const initializeCoreModule = async () => {
  const { initializeCoreServices } = await import('./services');
  const { initializeEngine } = await import('../engine');
  
  // 初始化引擎
  initializeEngine();
  
  // 初始化核心服务
  const services = initializeCoreServices();

  return {
    types: {},
    models: {},
    services: services,
    engine: { initializeEngine }
  };
};
