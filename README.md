# 维他仓库 PDA

> 仓库手持终端 H5 系统 — 面向仓库一线作业人员的移动端 WMS/PDA 应用。

## 项目概述

这是一个给仓库一线人员使用的 PDA H5 前端项目。用户通过 PDA 设备、安卓手持终端、手机浏览器打开 H5 页面，完成仓库现场的入库、质检、上架、拣货、分拣、复核、装箱、发运、移库、补货、盘点、库存查询等操作。

**和普通后台管理系统的区别：** 这不是给办公室白领用的后台，而是真正面向仓库现场的手持终端系统。字体偏大、按钮偏大、操作路径短、核心动作支持扫码、适合戴手套或快速点击。

## 技术栈

| 技术 | 说明 |
|------|------|
| React 18 | UI 框架 |
| TypeScript 5 | 类型安全 |
| Vite 5 | 构建工具 |
| React Router 6 | 客户端路由 |
| Zustand | 轻量状态管理 |
| TailwindCSS 3 | 原子化 CSS |
| Mock 数据 | 纯前端，无需后端 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

开发服务器默认运行在 `http://localhost:3000`。

## 登录

项目内置 Mock 账号，无需真实后端：

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | 123456 | 管理员 |
| picker | 123456 | 拣货员 |
| receiver | 123456 | 收货员 |
| checker | 123456 | 质检员 |
| packer | 123456 | 装箱员 |

## 功能模块（22 个页面）

### 认证
- **登录** `/login` — 账号密码登录，记住账号

### 仓库选择
- **选择仓库** `/select-warehouse` — 选择当前作业仓库

### 首页
- **工作台** `/home` — 今日待办概览、功能入口、快捷操作

### 任务中心
- **任务中心** `/tasks` — 全部任务视图
- **我的任务** `/tasks/my` — 当前用户任务
- **异常任务** `/tasks/exception` — 异常任务列表

### 入库作业
- **入库收货** `/inbound/receive` — 扫描入库单，逐行/整单收货
- **入库质检** `/inbound/qc` — 质检判定，合格/不合格处理
- **上架** `/inbound/putaway` — 扫商品→扫库位→确认上架

### 出库作业
- **拣货** `/outbound/picking` — 按库位路径拣货，支持缺货登记
- **分拣** `/outbound/sorting` — 按订单/格口分拣
- **复核** `/outbound/recheck` — 商品和数量校验
- **装箱** `/outbound/packing` — 创建箱码、商品装箱
- **发运** `/outbound/ship` — 扫描箱码确认装车发运

### 库内作业
- **移库** `/warehouse/move` — 商品从原库位移到目标库位
- **补货** `/warehouse/replenish` — 存储区补货到拣货区

### 盘点作业
- **盘点录入** `/counting/execute` — 扫描库位/商品，录入实盘数量

### 查询中心
- **库存查询** `/query/inventory` — 按商品/库位/批次查询库存
- **库位库存** `/query/location-inventory` — 扫描库位查看该库位下所有商品

### 系统设置
- **系统配置** `/settings/system` — 用户信息、设备信息、清除缓存、退出登录
- **参数配置** `/settings/params` — 扫码行为、声音震动、分页大小等
- **设备信息** `/settings/device` — 设备编号、浏览器信息、版本、网络状态

## 项目结构

```
src/
├── api/                  # API 层（方便后续替换真实接口）
│   ├── auth.ts
│   ├── inbound.ts
│   ├── inventory.ts
│   ├── outbound.ts
│   ├── settings.ts
│   ├── tasks.ts
│   └── warehouse.ts
├── components/           # 公共组件
│   ├── AppHeader.tsx     # 页面头部（标题+返回）
│   ├── BottomActionBar.tsx  # 底部固定操作栏
│   ├── DocumentCard.tsx  # 单据卡片
│   ├── EmptyState.tsx    # 空状态
│   ├── LoadingState.tsx  # 加载状态
│   ├── LocationCard.tsx  # 库位卡片
│   ├── ProductCard.tsx   # 商品卡片
│   ├── QuantityInput.tsx # 数量输入（加减按钮）
│   ├── ScanInput.tsx     # 扫码输入组件
│   ├── StatusTag.tsx     # 状态标签
│   ├── StepGuide.tsx     # 作业步骤引导
│   └── TaskCard.tsx      # 任务卡片
├── layouts/
│   └── MobileLayout.tsx  # 移动端布局（max-w-[480px]）
├── mock/                 # Mock 数据
│   ├── users.ts
│   ├── warehouses.ts
│   ├── products.ts
│   ├── documents.ts
│   ├── tasks.ts
│   ├── inventory.ts
│   ├── inbound.ts
│   ├── outbound.ts
│   ├── containers.ts
│   ├── exceptions.ts
│   ├── records.ts
│   └── settings.ts
├── pages/                # 页面
│   ├── auth/             # 登录
│   ├── warehouse/        # 仓库选择、移库、补货
│   ├── home/             # 首页工作台
│   ├── tasks/            # 任务中心
│   ├── inbound/          # 入库（收货、质检、上架）
│   ├── outbound/         # 出库（拣货、分拣、复核、装箱、发运）
│   ├── counting/         # 盘点
│   ├── query/            # 查询（库存、库位库存）
│   └── settings/         # 设置（系统、参数、设备）
├── store/                # Zustand 状态管理
│   ├── userStore.ts
│   ├── warehouseStore.ts
│   ├── settingsStore.ts
│   └── taskStore.ts
├── types/
│   └── index.ts
├── utils/
│   ├── format.ts
│   ├── mockDelay.ts
│   ├── storage.ts
│   └── validate.ts
├── router/
│   └── index.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 设计原则

- **一个页面一个动作** — 每个页面只解决一个主要作业动作
- **扫码优先** — 所有核心输入支持扫码枪，也支持手工录入
- **底部固定操作** — 提交类按钮固定底部，防重复点击
- **状态明确** — 成功/异常/待处理有清晰的颜色和文字反馈
- **移动端优先** — 适配 375px~414px 宽度，关键按钮 ≥44px，关键文字 ≥16px
- **中文业务语言** — 不出现英文菜单，文案符合中国仓库习惯

## 生成方式

本项目由 AI 根据[完整 PRD 提示词](./PROMPT.md)一次性生成。PROMPT.md 包含了完整的业务需求、交互规范、技术约束和验收标准。

## License

MIT
