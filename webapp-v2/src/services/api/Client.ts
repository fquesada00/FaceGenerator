import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';

const CONTENT_TYPE_JSON = 'application/json';

const BASIC_OPTIONS = {
  baseURL: import.meta.env.VITE_APP_BASE_PATH
};

export const client = axios.create({
  ...BASIC_OPTIONS
});

export const privateClient = axios.create({
  ...BASIC_OPTIONS,
  headers: {
    'Content-Type': CONTENT_TYPE_JSON
  },
  withCredentials: true
});

const requestInterceptor = (config: AxiosRequestConfig) => {
  const newConfig = { ...config };
  const headers = newConfig.headers as any;
  if (headers && headers['Content-Type'] === 'multipart/form-data')
    return newConfig;
  if (config.params) {
    newConfig.params = decamelizeKeys(config.params);
  }
  if (config.data) {
    newConfig.data = decamelizeKeys(config.data);
  }
  return newConfig;
};

const responseInterceptor = (response: AxiosResponse) => {
  if (
    response.data &&
    response.headers['content-type'] === 'application/json'
  ) {
    response.data = camelizeKeys(response.data);
  }
  return response;
};

client.interceptors.request.use(requestInterceptor);
client.interceptors.response.use(responseInterceptor);
privateClient.interceptors.request.use(requestInterceptor);
privateClient.interceptors.response.use(responseInterceptor);
