import { configureStore } from "@reduxjs/toolkit";
import addressUser from "./slice/sliceSignature";
import loadInfoUser from "./slice/sliceInfoToken";
import ContractInfo from "./slice/sliceNFTContract";
import StoreNFT from "./slice/sliceNFTs";
const store = configureStore({ reducer: { identifyAddress: addressUser, Info: loadInfoUser, contractInfo: ContractInfo, InfoNFTs: StoreNFT }, devTools: true });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
