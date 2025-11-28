import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.6:3000/',
  timeout: 15000,
});

export const setAuthToken = (token?: string | null) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
};

api.defaults.headers.post['Content-Type'] = 'application/json';
api.defaults.headers.put['Content-Type'] = 'application/json';

api.defaults.transformRequest = [(data) => {
  if (data === undefined || data === null) return data;
  return JSON.stringify(data);
}];

api.interceptors.request.use((config) => {
  console.log('Enviando para:', 'http://192.168.0.6:3000/');
  console.log('Body sendo enviado:', config.data);
  return config;
});

api.interceptors.request.use((config) => {
  if (config.data !== undefined && config.data !== null) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

api.interceptors.response.use((response) => {
  console.log('Resposta recebida:', response.data);
  return response;
}, (error) => {
  console.error('Erro na resposta:', error);
  return Promise.reject(error);
});

export default api;