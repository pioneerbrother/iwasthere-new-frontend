import axios from 'axios';
const api = axios.create({ baseURL: 'https://iwasthere-production.up.railway.app/api' });
export default api;