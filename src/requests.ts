// 封装uni-app原生请求方法
const baseURL = 'http://localhost:8081';
const timeout = 10000;

// 定义类型
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  [key: string]: any;
}

interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
  [key: string]: any;
}

interface ResponseData {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
  request: any;
}

// 请求拦截
let requestInterceptor = (config: RequestConfig): RequestConfig => {
  // 在发送请求之前做处理
  return config;
};

let requestInterceptorError = (error: any): Promise<any> => {
  // 处理请求错误
  return Promise.reject(error);
};

// 响应拦截
let responseInterceptor = (response: ResponseData): ResponseData => {
  // 这里可以添加响应拦截逻辑
  return response;
};

let responseInterceptorError = (error: any): Promise<any> => {
  // 处理响应错误
  return Promise.reject(error);
};

// 请求函数
const requests = <T = any>(url: string, options: RequestOptions = {}): Promise<{ data: T }> => {
  const { method = 'GET', params = {}, data, headers = {}, ...rest } = options;
  
  // 确保方法是合法的uni.request方法类型
  const requestMethod = method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';
  
  // 处理完整URL
  let fullURL = (url.startsWith('http') ? url : baseURL + url);
  
  // 处理请求参数 - 对所有请求类型都处理params
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    if (queryString) {
      fullURL += (fullURL.includes('?') ? '&' : '?') + queryString;
    }
  }
  
  // 应用请求拦截器
  const interceptedConfig = requestInterceptor({
    url: fullURL,
    method: requestMethod,
    data: requestMethod !== 'GET' ? data : undefined,
    header: headers,
    timeout,
    ...rest
  });
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: interceptedConfig.url,
      method: interceptedConfig.method,
      data: interceptedConfig.data,
      header: interceptedConfig.header,
      timeout: interceptedConfig.timeout,
      success: (res: any) => {
        try {
          const response = responseInterceptor({
            data: res.data,
            status: res.statusCode,
            statusText: '',
            headers: res.header,
            config: interceptedConfig,
            request: null
          });
          resolve(response);
        } catch (error) {
          reject(responseInterceptorError(error));
        }
      },
      fail: (err: any) => {
        reject(responseInterceptorError(err));
      }
    });
  });
};

// 设置拦截器的方法
export const setRequestInterceptor = (
  interceptor: (config: RequestConfig) => RequestConfig, 
  error?: (error: any) => Promise<any>
) => {
  if (typeof interceptor === 'function') {
    requestInterceptor = interceptor;
  }
  if (typeof error === 'function') {
    requestInterceptorError = error;
  }
};

export const setResponseInterceptor = (
  interceptor: (response: ResponseData) => ResponseData, 
  error?: (error: any) => Promise<any>
) => {
  if (typeof interceptor === 'function') {
    responseInterceptor = interceptor;
  }
  if (typeof error === 'function') {
    responseInterceptorError = error;
  }
};

// 初始化拦截器
setRequestInterceptor(requestInterceptor, requestInterceptorError);
setResponseInterceptor(responseInterceptor, responseInterceptorError);

export default requests;
