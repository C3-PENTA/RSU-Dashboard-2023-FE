import { AxiosRequestConfig, AxiosResponse } from 'axios';

import axiosInstance from '@/config/httpConfig/axiosInstance';

const HttpConfig: AxiosRequestConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

const apiGet = <T>(url: string, token?: string) =>
  new Promise<AxiosResponse<T>>((resolve, reject) => {
    if (!navigator.onLine) {
      return reject(false);
    }
    if (token) {
      const CustomHttpConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return axiosInstance.get<T>(url, CustomHttpConfig).then(resolve, reject);
    }
    return axiosInstance.get<T>(url, HttpConfig).then(resolve, reject);
  });

const apiPost = <T>(url: string, payload: any, config?: AxiosRequestConfig) =>
  new Promise<AxiosResponse<T>>((resolve, reject) => {
    if (!navigator.onLine) {
      return reject(false);
    }

    return axiosInstance.post<T>(url, payload, { ...HttpConfig, ...config }).then(resolve, reject);
  });

const apiPatch = <T>(url: string, data: any, config?: AxiosRequestConfig) =>
  new Promise<AxiosResponse<T>>((resolve, reject) => {
    if (!navigator.onLine) {
      return reject(false);
    }

    return axiosInstance.patch<T>(url, data, { ...HttpConfig, ...config }).then(resolve, reject);
  });

const apiDelete = <T>(url: string) =>
  new Promise<AxiosResponse<T>>((resolve, reject) => {
    if (!navigator.onLine) {
      return reject(false);
    }

    return axiosInstance.delete<T>(url, HttpConfig).then(resolve, reject);
  });

export const http = {
  get: apiGet,
  post: apiPost,
  delete: apiDelete,
  patch: apiPatch,
};
