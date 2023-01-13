import client from './Client';

const api = {
  get: async (url: string) => {
    try {
      const { data } = await client.get(url);
      return data;
    } catch (error) {
      throw error;
    }
  },
  post: async (url: string, body: any, headers: any = {}) => {
    try {
      const { data } = await client.post(url, body, headers);
      return data;
    } catch (error) {
      throw error;
    }
  },
  put: async (url: string, body: any) => {
    try {
      const { data } = await client.put(url, body);
      return data;
    } catch (error) {
      throw error;
    }
  },
  patch: async (url: string, body: any) => {
    try {
      const { data } = await client.patch(url, body);
      return data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (url: string) => {
    try {
      const { data } = await client.delete(url);
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;