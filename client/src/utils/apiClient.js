import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api",
});

// attach access token
API.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

// refresh on 401
let refreshing = null;
API.interceptors.response.use(
  res => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (!refreshing) {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("auth_user");
          window.location.href = "/auth";
          return Promise.reject(error);
        }
        original._retry = true;
        refreshing = axios.post(`${import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api"}/token/refresh/`, { refresh })
          .then(r => {
            localStorage.setItem("access", r.data.access);
            return r.data.access;
          })
          .finally(() => { refreshing = null; });
      }
      const newAccess = await refreshing;
      original.headers.Authorization = `Bearer ${newAccess}`;
      return axios(original);
    }
    return Promise.reject(error);
  }
);

export default API;
