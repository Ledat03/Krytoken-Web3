import axios from "axios";
import { renewRefreshToken, logOut } from "./MainService";
import { unauthorizeUser } from "@/redux/slice/sliceInfoToken";
import { toast } from "sonner";
const API_Base = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
API_Base.interceptors.request.use((config) => {
  const url = config.url || "";
  const isPublic = url.startsWith("/api/verify_signature") || url.startsWith("/api/check_user/") || url.startsWith("/api/user/refresh_token");
  if (!isPublic) {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) (config.headers as any).Authorization = `Bearer ${token}`;
  } else {
    if (config.headers) delete (config.headers as any).Authorization;
  }
  return config;
});

API_Base.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const OriginalRequest = error.config;
    if (status === 401) {
      if (!OriginalRequest._retry && !OriginalRequest.url?.includes("refresh_token")) {
        try {
          OriginalRequest._retry = true;
          const renewAccessToken = await renewRefreshToken();
          localStorage.setItem("accessToken", renewAccessToken.data.accessToken);
          OriginalRequest.headers.Authorization = `Bearer ${renewAccessToken.data.accessToken}`;
          return API_Base.request(OriginalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }
    if (status === 403) {
      const { default: store } = await import("@/redux/store");
      const adr = store.getState().Info.userAddress;
      if (adr) {
        await logOut(adr);
        localStorage.removeItem("accessToken");
        if (window.ethereum && typeof window.ethereum.removeAllListeners === "function") {
          window.ethereum.removeAllListeners("accountsChanged");
          window.ethereum.removeAllListeners("chainChanged");
          window.ethereum.removeAllListeners("disconnect");
        }
        store.dispatch(unauthorizeUser());
        toast.success("Wallet is disconnected", { duration: 2000 });
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default API_Base;
