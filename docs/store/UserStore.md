# UserStore

`UserStore` 是一个基于 Zustand 的全局状态 store，维护当前登录用户的身份信息。

## 架构

```tsx
Store 结构
└── state: { token: string; user: User | null }
└── actions: { setToken, setUser, setAuth, signOut, ... }
```

## 类型定义

```tsx
interface User {
  id: string;
  // …其他用户字段由项目自行扩展
}

interface UserState {
  token: string;
  user: User | null;
}

interface UserActions {
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  setAuth: (token: string, user: User) => void;
  signOut: () => void;
}

type UserStore = UserState & UserActions;
```

> `User` 类型的具体字段由项目自行定义。本 store 只要求 `token: string` 和 `user: User | null` 两个状态字段。

## 导出的 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `useUserStore` | `UseBoundStore<StoreApi<UserStore>>` | Zustand hook，在组件中读取/写入状态 |
| `UserState` | `interface` | 状态类型 |
| `UserActions` | `interface` | 操作方法类型 |
| `UserStore` | `type` | 完整 store 类型（状态 + 操作） |

## 基本用法

### 1. 创建 Store

```tsx
// src/store/userStore.ts
import { create } from 'zustand';
import type { User, UserStore } from '../types';

const useUserStore = create<UserStore>((set) => ({
  token: '',
  user: null,

  setToken: (token: string) => set({ token }),
  setUser: (user: User | null) => set({ user }),
  setAuth: (token: string, user: User) => set({ token, user }),
  signOut: () => set({ token: '', user: null }),
}));

export { useUserStore };
```

### 2. 在组件中读取状态

```tsx
import { useUserStore } from '../store/userStore';

function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  if (!user) return <Text>未登录</Text>;

  return <Text>欢迎, {user.displayName}</Text>;
}
```

> 推荐使用选择器（selector）按字段精确订阅，避免不必要的重渲染。

### 3. 登录成功后写入

```tsx
import { useUserStore } from '../store/userStore';

function SignInForm() {
  const setAuth = useUserStore((state) => state.setAuth);

  const handleSignIn = async () => {
    const { token, user } = await loginApi(/* … */);
    setAuth(token, user);
  };
}
```

### 4. 登出

```tsx
import { useUserStore } from '../store/userStore';

function SignOutButton() {
  const signOut = useUserStore((state) => state.signOut);

  return <Button title="退出登录" onPress={signOut} />;
}
```

## Zustand v5 说明

项目使用 `zustand ^5.0.14`。v5 移除了 `create()` 的泛型类型参数中的额外括号——定义时不需要 `create<Store>()`，直接 `create<Store>(…)` 即可。

## 与 SignInContext 的关系

`UserStore` 和 `SignInContext` 分工不同：

| | UserStore | SignInContext |
|--|-----------|---------------|
| **职责** | 持久化用户数据（token、user） | 控制路由显示登录页还是主页 |
| **存储** | Zustand（可扩展，支持中间件） | React Context |
| **关联** | 登录成功后同时更新两个 | 仅持有 `isSignedIn` 布尔值 |

实践中可以在登录成功时同时调用 `setAuth` 和 `setIsSignedIn(true)`，在登出时调用 `signOut` 和 `setIsSignedIn(false)`。
