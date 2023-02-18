import { privateClient } from 'services/api/Client';
import useAuth from './useAuth';
import useRefreshToken from './useRefreshToken';
import { useEffect } from 'react';
import { AxiosRequestConfig } from 'axios';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = privateClient.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const headers = config.headers as any;
        const authHeader = headers && headers['Authorization'];
        if (!authHeader) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${auth?.accessToken}`
          } as any;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = privateClient.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return privateClient(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      privateClient.interceptors.request.eject(requestIntercept);
      privateClient.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return privateClient;
};

export default useAxiosPrivate;
