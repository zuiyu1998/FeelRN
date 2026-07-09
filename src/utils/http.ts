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
    const response = await this.instance.delete<ApiResponse<T>>(url, {
      params,
    });
    return response as unknown as T;
  }
}

const http = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

export { HttpClient, http };
