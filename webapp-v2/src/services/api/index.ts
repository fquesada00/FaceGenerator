import { AxiosInstance } from "axios"

export const API_PREFIX = "/api"
export const FACES_API_PREFIX = `${API_PREFIX}/faces`
export const AUTH_API_PREFIX = `${API_PREFIX}/auth`

type ApiMethodParams = {
  query?: { [key: string]: any }
  body?: any
  headers?: { [key: string]: any }
  withCredentials?: boolean
}

const apiProvider = (client: AxiosInstance) => ({
  get: async <T>(
    url: string,
    { query, headers, withCredentials }: ApiMethodParams = {}
  ) => {
    try {
      const { data: responseData } = await client.get(url, {
        params: query,
        headers,
        withCredentials,
      })
      return responseData as T
    } catch (error) {
      throw error
    }
  },
  post: async <T>(
    url: string,
    { query, body, headers, withCredentials }: ApiMethodParams = {}
  ) => {
    try {
      const { data: responseData } = await client.post(url, body, {
        params: query,
        headers,
        withCredentials,
      })
      return responseData as T
    } catch (error) {
      throw error
    }
  },
  put: async <T>(
    url: string,
    { query, body, headers, withCredentials }: ApiMethodParams = {}
  ) => {
    try {
      const { data: responseData } = await client.put(url, body, {
        params: query,
        headers,
        withCredentials,
      })
      return responseData as T
    } catch (error) {
      throw error
    }
  },
  patch: async <T>(
    url: string,
    { query, body, headers, withCredentials }: ApiMethodParams = {}
  ) => {
    try {
      const { data: responseData } = await client.patch(url, body, {
        params: query,
        headers,
        withCredentials,
      })
      return responseData as T
    } catch (error) {
      throw error
    }
  },
  delete: async <T>(
    url: string,
    { query, headers, withCredentials }: ApiMethodParams = {}
  ) => {
    try {
      const { data: responseData } = await client.delete(url, {
        params: query,
        headers,
        withCredentials,
      })
      return responseData as T
    } catch (error) {
      throw error
    }
  },
})

export default apiProvider
