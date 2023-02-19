import axios from 'axios';

const client = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: import.meta.env.VITE_APP_BASE_PATH
});

export default client;
