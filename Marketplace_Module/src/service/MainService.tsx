import API_Base from "./Config";
import type { Permission } from "@/redux/slice/slicePermission";
export const Verify = async (address: string) => await API_Base.post(`/api/check_user/${address}`, { headers: { "Content-Type": "application/json" } });
export const SignMessage = async (verifySignature: object) => await API_Base.post("/api/verify_signature", verifySignature, { headers: { "Content-Type": "application/json" } });
export const renewRefreshToken = () => API_Base.post("/api/user/refresh_token", undefined, { headers: { "Content-Type": "application/json" } });
export const getPermission = async (address: string) => await API_Base.get(`/api/check/permission/${address}`, { headers: { "Content-Type": "application/json" } });
export const updatePermission = async (permission: Permission) => await API_Base.post("/api/update/permission", permission, { headers: { "Content-Type": "application/json" } });
export const testExpiredToken = async () => await API_Base.post("/api/expiredToken");
export const logOut = async () => await API_Base.post("/api/user/log_out");
