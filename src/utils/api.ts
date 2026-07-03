import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Mengambil dari localStorage
    const authData = localStorage.getItem("user"); 
    let token = "";

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        // Mengambil jwtToken dari objek hasil login
        token = parsed.jwtToken || "";
      } catch (e) {
        token = localStorage.getItem("token") || "";
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;