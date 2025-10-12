import axios from "axios";
import { renewRefreshToken, logOut } from "./MainService";
const API_Base = axios.create({
  baseURL: "http://localhost:8080/",
  withCredentials: true,
});
API_Base.interceptors.request.use((config) => {
  const url = config.url || "";
  const isPublic = url.startsWith("/api/verify_signature") || url.startsWith("/api/check_user/") || url.startsWith("/api/user/refresh_token");
  if (isPublic) {
    if (config.headers) delete (config.headers as any).Authorization;
  } else {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

API_Base.interceptors.response.use(
  (response) => {
    console.log("Response success:", response);
    return response;
  },
  async (error) => {
    console.log("response Error : ", error);
    const OriginalRequest = error.config;
    if (error.response.status === 401 && !OriginalRequest._retry && !OriginalRequest.url?.includes("refresh_token")) {
      try {
        OriginalRequest._retry = true;
        const renewAccessToken = await renewRefreshToken();
        localStorage.setItem("accessToken", renewAccessToken.data.accessToken);
        console.log(OriginalRequest);
        return API_Base.request(OriginalRequest);
      } catch (refreshError) {
        await logOut();
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }
    return error;
  }
);

export default API_Base;
