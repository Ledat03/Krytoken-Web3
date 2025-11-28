import { createSlice } from "@reduxjs/toolkit";

export interface TokenInfo {
  address: string;
  symbol: string;
  balance: string;
  decimals: number;
}
export interface Network {
  chainId: number;
  name: string;
}
interface InfoOfUser {
  tokenList: TokenInfo[];
  networks: Network;
  userAddress: string;
  isConnected: boolean;
}
const initialState: InfoOfUser = { tokenList: [], networks: { chainId: 0, name: "" }, userAddress: "", isConnected: false };

const loadInfoUser = createSlice({
  name: "get/LoadInfoUser",
  initialState,
  reducers: {
    getUserInfo: (state, action) => {
      (state.tokenList = action.payload.tokenList), (state.networks = action.payload.networks), (state.userAddress = action.payload.userAddress);
      state.isConnected = action.payload.isConnected;
    },
    fetchUserSwitch: (state, action) => {
      state.userAddress = action.payload.userAddress;
    },
    unauthorizeUser: (state) => {
      state.isConnected = false;
      state.tokenList = [];
      state.networks = { chainId: 0, name: "" };
      state.userAddress = "";
    },
  },
});
export const { getUserInfo, fetchUserSwitch, unauthorizeUser } = loadInfoUser.actions;
export default loadInfoUser.reducer;
