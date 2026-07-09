# AppStore

`AppStore` 是一个基于 Zustand 的全局状态 store，维护应用的启动加载状态，用于控制路由在启动时显示启动屏还是主页面。

## 架构

```tsx
Store 结构
└── state: { loading: boolean }
└── actions: { finishLoading }
```

## 类型定义

```tsx
interface AppState {
  loading: boolean;
}

interface AppActions {
  finishLoading: () => void;
}

type AppStore = AppState & AppActions;
```

> `loading` 初始值为 `true`（应用启动中），调用 `finishLoading` 设为 `false`（启动完成）。

## 导出的 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `useAppStore` | `UseBoundStore<StoreApi<AppStore>>` | Zustand hook，在组件中读取/写入状态 |
| `AppState` | `interface` | 状态类型 |
| `AppActions` | `interface` | 操作方法类型 |
| `AppStore` | `type` | 完整 store 类型（状态 + 操作） |

## 基本用法

### 1. 创建 Store

```tsx
// src/store/appStore.ts
import { create } from 'zustand';
import type { AppStore } from '../types';

const useAppStore = create<AppStore>((set) => ({
  loading: true,

  finishLoading: () => set({ loading: false }),
}));

export { useAppStore };
```

### 2. 在组件中读取加载状态

```tsx
import { useAppStore } from '../store/appStore';

function MyComponent() {
  const loading = useAppStore((state) => state.loading);

  if (loading) return <ActivityIndicator />;
  return <Text>已就绪</Text>;
}
```

### 3. 初始加载完成后调用

```tsx
import { useAppStore } from '../store/appStore';

function SplashScreen() {
  const finishLoading = useAppStore((state) => state.finishLoading);

  const handleInitComplete = async () => {
    // …auth 检查完成
    finishLoading(); // loading → false，结束启动屏
  };
}
```

## 与 SignInContext 的关系

`AppStore` 和 `SignInContext` 分工不同：

| | AppStore | SignInContext |
|--|----------|---------------|
| **职责** | 控制启动加载状态 | 控制路由显示登录页还是主页 |
| **存储** | Zustand | React Context |
| **关联** | `loading = false` 时 Router 才渲染 `Navigation` | Router 通过 Provider 注入 `isSignedIn` |
