import { configureStore } from "@reduxjs/toolkit";
import addressUser from "./slice/sliceSignature";
import loadInfoUser from "./slice/sliceInfoToken";
import ContractInfo from "./slice/sliceNFTContract";
import MarketInfo from "./slice/sliceMarketInfo";
import StoreNFT from "./slice/sliceNFTs";
import orderAdded from "./slice/sliceOrder";
import orderCancel from "./slice/sliceCancelOffer";
import orderMatched from "./slice/sliceMatchedOffer";
import StatePermission from "./slice/slicePermission";
import latestSoldData from "./slice/sliceLastestSold";
const store = configureStore({ reducer: { identifyAddress: addressUser, Info: loadInfoUser, contractInfo: ContractInfo, InfoNFTs: StoreNFT, marketInfo: MarketInfo, orderAdded: orderAdded, cancelOrders: orderCancel, matchedOrders: orderMatched, Permission: StatePermission, LatestSoldData: latestSoldData }, devTools: true });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
