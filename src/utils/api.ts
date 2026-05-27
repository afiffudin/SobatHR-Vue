import axios from "axios";

// Membuat instance axios dengan mengambil base URL dari file .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Batas waktu request 10 detik
  headers: {
    "Content-Type": "application/json",
  },
});

// TAMBAHKAN REVISI DI SINI: Axios Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage setiap kali aplikasi melakukan request API
    const token = localStorage.getItem("token");
    
    // Jika token eksis, masukkan ke dalam header Authorization Bearer
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Tangani error yang terjadi sebelum request dikirim
    return Promise.reject(error);
  }
);

export default api;