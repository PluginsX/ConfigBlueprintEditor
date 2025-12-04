# 蓝图编辑器重构架构设计方案

## 1. 当前架构问题分析

### 1.1 App.tsx组件过于庞大
- 文件超过700行，承担了过多职责
- 违反单一职责原则
- 难以维护和扩展

### 1.2 状态管理混乱
- 同时使用useState和useNodesState管理节点状态
- 存在数据不一致的风险
- 状态分散在多个地方

### 1.3 缺乏清晰的分层架构
- 业务逻辑与UI组件混合
- 难以进行单元测试
- 代码复用性差

### 1.4 节点类型配置与UI组件紧耦合
- NODE_TYPES_CONFIG与CustomNode组件紧密关联
- 难以独立修改节点配置或UI表现

## 2. 新架构设计目标

### 2.1 分层架构
- **表现层(View Layer)**: React组件，负责UI渲染和用户交互
- **应用层(Application Layer)**: 协调UI和领域逻辑，处理应用状态
- **领域层(Domain Layer)**: 核心业务逻辑和数据模型
- **基础设施层(Infrastructure Layer)**: 外部依赖，如ReactFlow引擎

### 2.2 单一职责原则
- 每个模块只负责一项功能
- 提高代码可读性和可维护性

### 2.3 可扩展性
- 易于添加新的节点类型
- 支持插件化扩展

### 2.4 状态管理优化
- 集中化状态管理
- 使用Context API或状态管理库(如Redux/Zustand)

## 3. 新文件结构设计

```
src/
├── core/                          # 核心模块
│   ├── types/                     # 核心类型定义
│   │   ├── node.types.ts          # 节点相关类型
│   │   ├── blueprint.types.ts     # 蓝图相关类型
│   │   └── engine.types.ts        # 引擎相关类型
│   ├── models/                    # 领域模型
│   │   ├── Node.model.ts          # 节点模型
│   │   ├── Edge.model.ts          # 边模型
│   │   └── Blueprint.model.ts     # 蓝图模型
│   └── services/                  # 核心服务
│       ├── node.service.ts        # 节点服务
│       ├── edge.service.ts        # 边服务
│       └── blueprint.service.ts   # 蓝图服务
├── engine/                        # 运行时引擎
│   ├── runtime-engine.ts          # 运行时引擎核心
│   ├── executors/                 # 节点执行器
│   │   ├── base-executor.ts       # 基础执行器
│   │   ├── event-executor.ts      # 事件节点执行器
│   │   ├── function-executor.ts   # 函数节点执行器
│   │   └── variable-executor.ts   # 变量节点执行器
│   └── validators/                # 连接验证器
│       ├── connection-validator.ts # 连接验证器
│       └── pin-validator.ts       # 引脚验证器
├── store/                         # 状态管理
│   ├── index.ts                   # 状态管理入口
│   ├── blueprint.store.ts         # 蓝图状态
│   ├── ui.store.ts                # UI状态
│   └── runtime.store.ts           # 运行时状态
├── components/                    # UI组件
│   ├── editor/                    # 编辑器组件
│   │   ├── canvas/                # 画布组件
│   │   │   ├── Canvas.tsx         # 画布容器
│   │   │   └── Grid.tsx           # 网格背景
│   │   ├── nodes/                 # 节点组件
│   │   │   ├── Node.tsx           # 节点基础组件
│   │   │   ├── NodeHeader.tsx     # 节点头部
│   │   │   ├── NodeBody.tsx       # 节点主体
│   │   │   └── ports/             # 引脚组件
│   │   │       ├── Port.tsx       # 引脚基础组件
│   │   │       ├── InputPort.tsx  # 输入引脚
│   │   │       └── OutputPort.tsx # 输出引脚
│   │   ├── edges/                 # 边组件
│   │   │   └── Edge.tsx           # 边组件
│   │   └── controls/              # 控制组件
│   │       ├── Toolbar.tsx        # 工具栏
│   │       ├── ContextMenu.tsx    # 上下文菜单
│   │       └── Minimap.tsx        # 小地图
│   ├── panels/                    # 面板组件
│   │   ├── PropertyPanel.tsx      # 属性面板
│   │   ├── VariablePanel.tsx      # 变量面板
│   │   └── StateTabs.tsx          # 状态标签页
│   ├── sidebar/                   # 侧边栏组件
│   │   ├── Sidebar.tsx            # 侧边栏容器
│   │   └── NodeLibrary.tsx        # 节点库
│   └── windows/                   # 窗口组件
│       └── FunctionWindow.tsx     # 函数窗口
├── hooks/                         # 自定义Hooks
│   ├── useBlueprintStore.ts       # 蓝图状态Hook
│   ├── useUIStore.ts              # UI状态Hook
│   ├── useNodeOperations.ts       # 节点操作Hook
│   └── useEdgeOperations.ts       # 边操作Hook
├── utils/                         # 工具函数
│   ├── constants.ts               # 常量定义
│   ├── helpers.ts                 # 辅助函数
│   └── validators.ts              # 验证函数
├── config/                        # 配置文件
│   ├── node-types.config.ts       # 节点类型配置
│   └── app.config.ts              # 应用配置
└── App.tsx                        # 应用入口
```

## 4. 各层详细设计

### 4.1 核心模块(core/)
存放核心类型定义、领域模型和服务。

#### 类型定义(types/)
- `node.types.ts`: 定义节点相关的基础类型和接口
- `blueprint.types.ts`: 定义蓝图相关的类型
- `engine.types.ts`: 定义运行时引擎相关的类型

#### 领域模型(models/)
- `Node.model.ts`: 节点领域模型，包含节点的核心属性和方法
- `Edge.model.ts`: 边领域模型，包含边的核心属性和方法
- `Blueprint.model.ts`: 蓝图领域模型，包含蓝图的核心属性和方法

#### 核心服务(services/)
- `node.service.ts`: 节点相关的核心服务，如节点创建、删除、更新等
- `edge.service.ts`: 边相关的核心服务，如边创建、删除、验证等
- `blueprint.service.ts`: 蓝图相关的核心服务，如蓝图保存、加载等

### 4.2 运行时引擎(engine/)
存放运行时引擎相关代码。

#### 运行时引擎核心(runtime-engine.ts)
- 实现蓝图执行的核心逻辑
- 管理执行上下文和调用栈

#### 节点执行器(executors/)
- `base-executor.ts`: 基础执行器，定义执行器接口
- `event-executor.ts`: 事件节点执行器
- `function-executor.ts`: 函数节点执行器
- `variable-executor.ts`: 变量节点执行器

#### 连接验证器(validators/)
- `connection-validator.ts`: 连接验证器，验证节点间连接是否合法
- `pin-validator.ts`: 引脚验证器，验证引脚类型匹配

### 4.3 状态管理(store/)
集中管理应用状态。

#### 状态管理入口(index.ts)
- 导出所有状态管理模块

#### 蓝图状态(blueprint.store.ts)
- 管理蓝图数据状态，包括节点、边等

#### UI状态(ui.store.ts)
- 管理UI相关状态，如选中节点、面板显示状态等

#### 运行时状态(runtime.store.ts)
- 管理运行时状态，如变量值、执行状态等

### 4.4 UI组件(components/)
存放所有React UI组件。

#### 编辑器组件(editor/)
##### 画布组件(canvas/)
- `Canvas.tsx`: 画布容器组件
- `Grid.tsx`: 网格背景组件

##### 节点组件(nodes/)
- `Node.tsx`: 节点基础组件
- `NodeHeader.tsx`: 节点头部组件
- `NodeBody.tsx`: 节点主体组件
- 引脚组件(ports/):
  - `Port.tsx`: 引脚基础组件
  - `InputPort.tsx`: 输入引脚组件
  - `OutputPort.tsx`: 输出引脚组件

##### 边组件(edges/)
- `Edge.tsx`: 边组件

##### 控制组件(controls/)
- `Toolbar.tsx`: 工具栏组件
- `ContextMenu.tsx`: 上下文菜单组件
- `Minimap.tsx`: 小地图组件

#### 面板组件(panels/)
- `PropertyPanel.tsx`: 属性面板组件
- `VariablePanel.tsx`: 变量面板组件
- `StateTabs.tsx`: 状态标签页组件

#### 侧边栏组件(sidebar/)
- `Sidebar.tsx`: 侧边栏容器组件
- `NodeLibrary.tsx`: 节点库组件

#### 窗口组件(windows/)
- `FunctionWindow.tsx`: 函数窗口组件

### 4.5 自定义Hooks(hooks/)
存放自定义React Hooks。

- `useBlueprintStore.ts`: 访问蓝图状态的Hook
- `useUIStore.ts`: 访问UI状态的Hook
- `useNodeOperations.ts`: 节点操作相关的Hook
- `useEdgeOperations.ts`: 边操作相关的Hook

### 4.6 工具函数(utils/)
存放通用工具函数。

- `constants.ts`: 常量定义
- `helpers.ts`: 辅助函数
- `validators.ts`: 验证函数

### 4.7 配置文件(config/)
存放应用配置。

- `node-types.config.ts`: 节点类型配置
- `app.config.ts`: 应用配置

## 5. 数据流设计

```
[UI组件] ↔ [Hooks] ↔ [状态管理] ↔ [核心服务] ↔ [领域模型]
                              ↕
                        [运行时引擎]
```

1. UI组件通过Hooks访问和修改状态
2. Hooks调用核心服务处理业务逻辑
3. 核心服务操作领域模型
4. 状态管理同步状态变化
5. 运行时引擎独立于UI进行蓝图执行

## 6. 状态管理策略

采用分层状态管理策略：

1. **全局状态**: 使用Zustand或Redux管理全局状态
2. **局部状态**: 组件内部状态使用useState/useReducer
3. **表单状态**: 使用React Hook Form等专用库

## 7. 性能优化策略

1. **组件优化**: 使用React.memo、useMemo、useCallback优化组件性能
2. **虚拟化**: 对大量节点和边使用虚拟化渲染
3. **懒加载**: 按需加载组件和资源
4. **状态选择性更新**: 精确控制状态更新范围

## 8. 扩展性设计

1. **插件化架构**: 支持通过插件扩展节点类型和功能
2. **配置驱动**: 通过配置文件定义节点类型和行为
3. **接口标准化**: 定义标准接口便于扩展