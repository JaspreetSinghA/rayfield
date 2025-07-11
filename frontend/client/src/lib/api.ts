// API Client Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = {
  baseURL: API_BASE_URL,
  
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      credentials: options.credentials || 'include',
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    register: (userData: { email: string; password: string; name: string }) =>
      apiClient.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    logout: () =>
      apiClient.request('/api/auth/logout', { method: 'POST' }),
  },

  // User endpoints
  user: {
    getProfile: () =>
      apiClient.request('/api/user/profile'),
    
    updateProfile: (data: any) =>
      apiClient.request('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Anomaly detection endpoints
  anomalies: {
    getAll: () =>
      apiClient.request('/api/anomalies'),
    
    getById: (id: string) =>
      apiClient.request(`/api/anomalies/${id}`),
    
    updateStatus: (id: string, status: string) =>
      apiClient.request(`/api/anomalies/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  // File upload endpoints
  upload: {
    submitFiles: async (formData: FormData) => {
      // Use production endpoint for uploads (authentication required)
      const url = `${apiClient.baseURL}/api/upload`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type for FormData
        credentials: 'include', // send cookies if needed
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return await response.json();
    },
    
    submitText: (textData: { title: string; content: string; category: string }) =>
      apiClient.request('/api/upload/text', {
        method: 'POST',
        body: JSON.stringify(textData),
      }),
  },

  // Reports endpoints
  reports: {
    generateSystemReport: (params: any) =>
      apiClient.request('/api/reports/system', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    
    generateAnalyticsReport: (params: any) =>
      apiClient.request('/api/reports/analytics', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    
    generateComplianceReport: (params: any) =>
      apiClient.request('/api/reports/compliance', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
  },
}; 