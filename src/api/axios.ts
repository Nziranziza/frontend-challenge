import axios, { AxiosInstance, AxiosResponse } from 'axios';

const { REACT_APP_BASE_URL = 'http://localhost:4000' } = process.env;

axios.defaults.baseURL = REACT_APP_BASE_URL;

const instance: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(function (response: AxiosResponse) {
  return response.data;
}, function (error) {
  if (error?.response?.data) {
    return Promise.reject(error?.response?.data);
  }
  return Promise.reject(null);
});

export default class API {

  static get(url: string, params = {}): Promise<any> {
    return instance({
      method: 'GET',
      url,
      params,
      withCredentials: true
    })
  }

  static post(url: string, data = {}, params = {}): Promise<any> {
    return instance({
      method: 'POST',
      url,
      data,
      params,
      withCredentials: true
    })
  }

  static put(url: string, data = {}, params = {}): Promise<any> {
    return instance({
      method: 'PUT',
      url,
      data,
      params,
      withCredentials: true
    });
  }

  static delete(url: string, params = {}, data = {}): Promise<any> {
    return instance({
      method: 'DELETE',
      url,
      data,
      params,
      withCredentials: true
    })
  }
}
