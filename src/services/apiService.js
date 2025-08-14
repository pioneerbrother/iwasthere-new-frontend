// File: new-frontend/src/services/apiService.js
import axios from 'axios';

// The base URL of your live, deployed server.
const API_BASE_URL = 'https://iwasthere-production.up.railway.app/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// We no longer export setAuthToken from here.
// We ONLY export the api instance.
export default api;