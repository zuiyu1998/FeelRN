# SignInContext

`SignInContext` 是一个 React Context，仅暴露 `isSignedIn` 布尔值，用于决定 `Router` 显示登录页面还是主页面。

## 架构

```tsx
SignInContext.Provider
└── value={{ isSignedIn: boolean }}
```

**导出的 API：**

| 导出 | 类型 | 说明 |
|------|------|------|
| `SignInContext` | `Context<SignInContextType \| undefined>` | 原始 Context 对象，用于自己实现 Provider |
| `useIsSignedIn` | `() => boolean` | 获取 `isSignedIn` 布尔值 |
| `useIsSignedOut` | `() => boolean` | 便捷 hook，返回 `!isSignedIn` |

## 类型定义

```tsx
interface SignInContextType {
  isSignedIn: boolean;
}
```

> Context 本身**不提供** `signIn` / `signOut` 方法。登录/登出的状态变更由上层（`App.tsx` 或其他状态管理）通过 `SignInContext.Provider` 的 `value` 控制。

## 基本用法

### 1. 在 App 入口处管理状态并提供 Context

```tsx
// src/App.tsx
import { useState, useCallback } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SignInContext } from './router/SignInContext';
import Router from './router';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isSignedIn, setIsSignedIn] = useState(false);

  const value = { isSignedIn };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SignInContext.Provider value={value}>
        <Router />
      </SignInContext.Provider>
    </SafeAreaProvider>
  );
}

export default App;
```

### 2. Router 根据登录状态决定入口页面

```tsx
// src/router/Router.tsx
import { useIsSignedIn } from './SignInContext';

function Router() {
  const isSignedIn = useIsSignedIn();

  return <Navigation initialRouteName={isSignedIn ? 'Home' : 'SignIn'} />;
}
```

### 3. 在页面中读取登录状态

```tsx
// 登录页面
import { useIsSignedIn } from '../router/SignInContext';

function SignInScreen() {
  const isSignedIn = useIsSignedIn();
  // isSignedIn = false 时显示登录表单
}

// 主页
import { useIsSignedOut } from '../router/SignInContext';

function HomeScreen() {
  const isSignedOut = useIsSignedOut();
  // isSignedOut = false 表示已登录，显示主页内容
}
```

## 登录状态与导航流

```
App 启动
  │
  ▼
isSignedIn = false ──► initialRouteName = 'SignIn' ──► 显示 SignInScreen
  │                                                        │
  │                   登录成功（setIsSignedIn(true)）        │
  │                                                        │
  ▼                                                        ▼
isSignedIn = true  ──► initialRouteName = 'Home'  ──────► 显示 HomeScreen
  │
  ├── 可以从 Home 导航到 DetailsScreen
  │
  ▼
登出（setIsSignedIn(false)）──► initialRouteName = 'SignIn' ──► 返回 SignInScreen
```

## Hook 说明

### `useIsSignedIn()`

返回 `boolean`，即 `isSignedIn` 的值。

```tsx
function MyComponent() {
  const isSignedIn = useIsSignedIn();

  if (!isSignedIn) {
    return <Text>请先登录</Text>;
  }

  return <Text>欢迎回来</Text>;
}
```

### `useIsSignedOut()`

返回 `boolean`，是 `!isSignedIn` 的便捷写法。

```tsx
function MyComponent() {
  const isSignedOut = useIsSignedOut();

  return isSignedOut ? <SignInPrompt /> : <Dashboard />;
}
```

> `useIsSignedOut` 内部调用了 `useIsSignedIn()`，所以同样需要在 `SignInContext.Provider` 范围内使用。
