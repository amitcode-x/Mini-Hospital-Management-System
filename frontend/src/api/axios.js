import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Public endpoints jahan token nahi bhejna
  const publicEndpoints = ["/auth/login/", "/auth/signup/"];

  if (
    token &&
    !publicEndpoints.some((url) => config.url.includes(url))
  ) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

export default axiosClient;
