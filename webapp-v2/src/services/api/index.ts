import client from './Client';

export const API_PREFIX = '/api';
export const FACES_API_PREFIX = `${API_PREFIX}/faces`;

type ApiMethodParams = {
  query?: {[key: string]: any};
  body?: any;
  headers?: any;
};

const api = {
  get: async <T>(url: string, { query, headers }: ApiMethodParams = {}) => {
    try {
      const { data } = await client.get(url, { params: query, headers });
      return data as T;
    } catch (error) {
      throw error;
    }
  },
  post: async <T>(url: string, { query, body, headers }: ApiMethodParams = {}) => {
    try {
      const { data } = await client.post(url, body, { params: query, headers });
      return data as T;
    } catch (error) {
      throw error;
    }
  },
  put: async <T>(url: string, { query, body, headers }: ApiMethodParams = {}) => {
    try {
      const { data } = await client.put(url, body, { params: query, headers });
      return data as T;
    } catch (error) {
      throw error;
    }
  },
  patch: async <T>(url: string, { query, body, headers }: ApiMethodParams = {}) => {
    try {
      const { data } = await client.patch(url, body, { params: query, headers });
      return data as T;
    } catch (error) {
      throw error;
    }
  },
  delete: async <T>(url: string, { query, headers }: ApiMethodParams = {}) => {
    try {
      const { data } = await client.delete(url, { params: query, headers });
      return data as T;
    } catch (error) {
      throw error;
    }
  }
};

export default api;