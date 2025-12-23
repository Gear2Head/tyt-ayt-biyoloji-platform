import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Xano API Client
 * Provides HTTP methods with automatic token management and error handling
 */

const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_BASE_URL || '';

class XanoClient {
    private client: AxiosInstance;
    private tokenKey = 'xano_auth_token';

    constructor() {
        this.client = axios.create({
            baseURL: XANO_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor - add auth token to requests
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle token refresh and errors
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If 401 and not already retried, try to refresh token
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newToken = await this.refreshToken();
                        if (newToken) {
                            this.setToken(newToken);
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return this.client(originalRequest);
                        }
                    } catch (refreshError) {
                        // Refresh failed, logout user
                        this.clearToken();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Token management
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.tokenKey);
    }

    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.tokenKey, token);
        }
    }

    clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.tokenKey);
        }
    }

    // Token refresh
    private async refreshToken(): Promise<string | null> {
        try {
            const response = await axios.post(`${XANO_BASE_URL}/auth/refresh`, {}, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                },
            });
            return response.data.authToken || null;
        } catch (error) {
            return null;
        }
    }

    // HTTP Methods
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, config);
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config);
        return response.data;
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.patch(url, data, config);
        return response.data;
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data, config);
        return response.data;
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url, config);
        return response.data;
    }
}

// Export singleton instance
export const xanoClient = new XanoClient();
export default xanoClient;
