import axios from 'axios';

const SERVICE_URLS = {
  user: 'https://ventixeuserservice-c3dxc0hvbgb3fdbp.swedencentral-01.azurewebsites.net/api',
  event: 'https://ventixeeventservices-cah0ebd7hagub9bu.swedencentral-01.azurewebsites.net/api',
  booking: 'https://ventixebookingservices-edd8fvenghbrghgf.swedencentral-01.azurewebsites.net/api'
};

const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const userApi = createApiInstance(SERVICE_URLS.user);
export const eventApi = createApiInstance(SERVICE_URLS.event);
export const bookingApi = createApiInstance(SERVICE_URLS.booking);

const api = userApi;
export default api; 