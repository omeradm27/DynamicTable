import axios from 'axios';

export const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:5000/api/`
//export const BACKEND_URL = `http://localhost:5055/api/`

const instance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 500000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const responseBody = (response) => response.data;
console.log('responseBody',responseBody);

const requests = {
  get: (url, body, headers) =>
    instance.get(url, body, headers).then(responseBody),

  post: (url, body) => instance.post(url, body).then(responseBody),

  put: (url, body, headers) =>
    instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url) => instance.delete(url).then(responseBody),
};

export default requests;
