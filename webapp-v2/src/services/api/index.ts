import client from './Client';

export const API_PREFIX = '/api';
export const FACES_API_PREFIX = `${API_PREFIX}/faces`;

const api = {
  get: async <T>(url: string) => {
    try {
      const { data } = await client.get(url);
      return data as T;
    } catch (error) {
      throw error;
    }
  },
  post: async <T>(url: string, body: any = {}, headers: any = {}) => {
    try {
      const { data } = await client.post(url, body, headers);
      return data as T;
    } catch (error) {
      throw error;
    }
  },
  put: async <T>(url: string, body: any) => {
    try {
      const { data } = await client.put(url, body);
      return data as T;
    } catch (error) {
      throw error;
    }
  },
  patch: async <T>(url: string, body: any) => {
    try {
      const { data } = await client.patch(url, body);
      return data as T;
    } catch (error) {
      throw error;
    }
  },
  delete: async <T>(url: string) => {
    try {
      const { data } = await client.delete(url);
      return data as T;
    } catch (error) {
      throw error;
    }
  }
};

export default api;