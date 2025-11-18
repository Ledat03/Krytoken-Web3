import { createSlice } from "@reduxjs/toolkit";
import type { ITrait } from "./sliceNFTContract";
export interface MetaData {
  id: number;
  tokenURI: string;
}
export interface NFTProperty {
  tokenId: number;
  name: string;
  subscription: string;
  trait: ITrait;
  image: string;
}
export interface NFTsData {
  nfts: MetaData[];
}
export interface NFTs {
  ListNFTs: NFTProperty[];
}

const initialState: NFTs = {
  ListNFTs: [],
};
const StoreNFT = createSlice({
  name: "StoreNFTs",
  initialState,
  reducers: {
    storedNFT: (state, action) => {
      state.ListNFTs = action.payload;
    },
  },
});
export default StoreNFT.reducer;
export const { storedNFT } = StoreNFT.actions;
