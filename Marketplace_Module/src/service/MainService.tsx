import API_Base from "./Config";

export const Verify = async (address: string) => await API_Base.post(`/api/check_user/${address}`, { headers: { "Content-Type": "application/json" } });
export const SignMessage = async (verifySignature: object) => await API_Base.post("/api/verify_signature", verifySignature, { headers: { "Content-Type": "application/json" } });
export const renewRefreshToken = () => API_Base.post("/api/user/refresh_token", { headers: { "Content-Type": "application/json" } });
export const testExpiredToken = async () => await API_Base.post("/api/expiredToken");
export const logOut = async () => await API_Base.post("/api/user/log_out");
