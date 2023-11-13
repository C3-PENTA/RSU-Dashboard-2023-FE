import axios, { AxiosRequestConfig } from 'axios';

const APP_ENV = import.meta.env.VITE_APP_ENV;
let API_URL = '';

if (APP_ENV === 'PROD') {
  API_URL = `${location.protocol}//${location.hostname}${
    location.port ? `:${location.port}` : ''
  }/api/`;
} else {
  API_URL = import.meta.env.VITE_API_URL;
}

const httpConfig: AxiosRequestConfig = {
  withCredentials: true,
  baseURL: API_URL,
  timeout: 10000,
};

const axiosInstance = axios.create(httpConfig);

export default axiosInstance;
