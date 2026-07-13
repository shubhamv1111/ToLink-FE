// API Configuration and Base Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_VERSION = '/v1';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// API Client with cookie support
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}${API_VERSION}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for cookies
    };

    try {
      const response = await fetch(url, config);
      
      // Handle empty responses (204, etc.)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message || 'API request failed', response.status);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Type Definitions
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePhoto?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isGoogleAccount: boolean;
  hasPassword: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  lastClicked?: string;
  isPrivate: boolean;
  hasPassword: boolean;
  password?: string;
  urlName?: string;
  activationAt?: string;
  expiresAt?: string;
  enabled: boolean;
}

export interface CreateLinkRequest {
  originalUrl: string;
  customAlias?: string;
  urlName?: string;
  isPrivate?: boolean;
  hasPassword?: boolean;
  password?: string;
  activationAt?: string;
  expiresAt?: string;
}

export interface UpdateLinkRequest extends Partial<CreateLinkRequest> {
  enabled?: boolean;
  clearActivationAt?: boolean;
  clearExpiresAt?: boolean;
  forceActivate?: boolean;
}

export interface LinkListResponse {
  items: Link[];
  total: number;
}

// Auth API
export const authApi = {
  signup: (name: string, email: string, password: string) =>
    api.post<User>('/auth/signup', { name, email, password }),
  
  login: (email: string, password: string) =>
    api.post<User>('/auth/login', { email, password }),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getMe: () =>
    api.get<User>('/auth/me'),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    api.patch<User>('/users/me', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Links API
export const linksApi = {
  create: (data: CreateLinkRequest) =>
    api.post<Link>('/links', data),
  
  getList: (params?: { 
    search?: string; 
    filter?: string; 
    limit?: number; 
    offset?: number;
    sort?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.filter) queryParams.append('filter', params.filter);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const query = queryParams.toString();
    return api.get<LinkListResponse>(`/links${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    api.get<Link>(`/links/${id}`),
  
  update: (id: string, data: UpdateLinkRequest) =>
    api.patch<Link>(`/links/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/links/${id}`),
  
  getStats: (shortCode: string) =>
    api.get<Link>(`/links/stats/${shortCode}`),
  
  checkAliasAvailability: (alias: string) =>
    api.get<{ alias: string; available: boolean; suggestions: string[] }>(
      `/links/alias-availability?alias=${alias}`
    ),
  
  suggestCode: (length?: number) =>
    api.get<{ shortCode: string }>(
      `/links/suggest-code${length ? `?length=${length}` : ''}`
    ),
};

// Analytics API
export const analyticsApi = {
  getOverview: (params: { scope?: 'user' | 'link'; linkId?: string; range?: string }) => {
    const queryParams = new URLSearchParams();
    if (params.scope) queryParams.append('scope', params.scope);
    if (params.linkId) queryParams.append('linkId', params.linkId);
    if (params.range) queryParams.append('range', params.range);
    
    return api.get<any>(`/analytics/overview?${queryParams.toString()}`);
  },
  
  getClicksSeries: (params: { 
    scope?: 'user' | 'link'; 
    linkId?: string; 
    range?: string;
    granularity?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.scope) queryParams.append('scope', params.scope);
    if (params.linkId) queryParams.append('linkId', params.linkId);
    if (params.range) queryParams.append('range', params.range);
    if (params.granularity) queryParams.append('granularity', params.granularity);
    
    return api.get<any>(`/analytics/clicks/series?${queryParams.toString()}`);
  },
  
  getClicksPerUrl: (range?: string) => {
    return api.get<any>(`/analytics/clicks/per-url${range ? `?range=${range}` : ''}`);
  },
};

// QR Code API
export const qrApi = {
  generate: (shortCode: string, options?: {
    size?: number;
    format?: 'png' | 'svg';
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    margin?: number;
    darkColor?: string;
    lightColor?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (options?.size) queryParams.append('size', options.size.toString());
    if (options?.format) queryParams.append('format', options.format);
    if (options?.errorCorrectionLevel) queryParams.append('errorCorrectionLevel', options.errorCorrectionLevel);
    if (options?.margin !== undefined) queryParams.append('margin', options.margin.toString());
    if (options?.darkColor) queryParams.append('darkColor', options.darkColor);
    if (options?.lightColor) queryParams.append('lightColor', options.lightColor);
    
    const query = queryParams.toString();
    return api.get<{ qrCode: string; shortUrl: string }>(`/qr/${shortCode}${query ? `?${query}` : ''}`);
  },
  
  getDownloadUrl: (shortCode: string, size?: number) => {
    const baseUrl = API_BASE_URL + API_VERSION;
    return `${baseUrl}/qr/${shortCode}/download${size ? `?size=${size}` : ''}`;
  },
};

