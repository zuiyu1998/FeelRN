# HttpClient

`HttpClient` 是基于 axios 的 class 封装，提供 token 自动注入和响应数据自动解包，统一项目中的 HTTP 请求行为。

## 架构

```
HttpClient
└── constructor(config)
    ├── 创建 axios 实例（baseURL、超时、默认请求头）
    └── 注册拦截器
        ├── 请求拦截器 ── 自动注入 token（从 UserStore 读取）
        └── 响应拦截器 ── 自动解包 data 层 + 统一错误处理
```

## 类型定义

```tsx
// 后端统一响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// HttpClient 构造配置
interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
}
```

## 导出的 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `HttpClient` | `class` | HttpClient 类，可自行构造实例 |
| `http` | `HttpClient` | 全局单例实例 |

### 实例方法

| 方法 | 签名 | 说明 |
|------|------|------|
| `get` | `<T>(url: string, params?: Record<string, unknown>) => Promise<T>` | GET 请求，返回已解包的 `T` |
| `post` | `<T>(url: string, data?: unknown) => Promise<T>` | POST 请求，返回已解包的 `T` |
| `put` | `<T>(url: string, data?: unknown) => Promise<T>` | PUT 请求，返回已解包的 `T` |
| `del` | `<T>(url: string, params?: Record<string, unknown>) => Promise<T>` | DELETE 请求，返回已解包的 `T` |

## 基本用法

### 1. 定义 HttpClient 类

```tsx
// src/utils/http.ts
import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useUserStore } from '../store/userStore';
import type { ApiResponse, HttpClientConfig } from '../types';

class HttpClient {
  private instance: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 10000,
    });
    this.setupInterceptors();
  }

  // ── 注册拦截器 ──
  private setupInterceptors(): void {
    // 请求拦截器：自动注入 token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = useUserStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // 响应拦截器：自动解包 data
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        const body = response.data;
        if (body.code !== 0) {
          return Promise.reject(new Error(body.message || '请求失败'));
        }
        return body.data as any;
      },
      (error) => Promise.reject(error),
    );
  }

  // ── HTTP 方法 ──
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, { params });
    return response as unknown as T;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data);
    return response as unknown as T;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data);
    return response as unknown as T;
  }

  async del<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, { params });
    return response as unknown as T;
  }
}
```

### 2. 导出单例

```tsx
// src/utils/http.ts（接上面）
const http = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

export { HttpClient, http };
```

> token 使用 `useUserStore.getState().token` 而非 hook 调用，确保拦截器中能同步读取最新值。

### 3. 在业务代码中调用

```tsx
import { http } from '../utils/http';

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

// GET ── 返回已解包的 UserInfo
const user = await http.get<UserInfo>('/user/profile');

// POST ── 返回已解包的 token
const { token } = await http.post<{ token: string }>('/auth/login', {
  username: 'admin',
  password: '123456',
});
```

> 调用方拿到的是解包后的数据（`body.data`），无需手动处理 `response.data.data`。

## 统一错误处理

可以在响应拦截器中集中处理常见错误码：

```tsx
private setupInterceptors(): void {
  // …请求拦截器…

  this.instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
      const body = response.data;
      if (body.code !== 0) {
        switch (body.code) {
          case 401:
            // token 过期，触发重新登录
            break;
          case 403:
            // 无权限
            break;
        }
        return Promise.reject(new Error(body.message || '请求失败'));
      }
      return body.data as any;
    },
    (error) => {
      if (error.code === 'ECONNABORTED') {
        console.error('请求超时');
      }
      return Promise.reject(error);
    },
  );
}
```

## 多实例

当需要访问不同后端时，可创建多个实例：

```tsx
const httpApi = new HttpClient({ baseURL: 'https://api.example.com' });
const httpAuth = new HttpClient({ baseURL: 'https://auth.example.com' });
```
