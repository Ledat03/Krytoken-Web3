import { configureStore } from "@reduxjs/toolkit";
import addressUser from "./slice/sliceSignature";
import loadInfoUser from "./slice/sliceInfoToken";
import ContractInfo from "./slice/sliceNFTContract";
const store = configureStore({ reducer: { identifyAddress: addressUser, Info: loadInfoUser, contractInfo: ContractInfo }, devTools: true });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
