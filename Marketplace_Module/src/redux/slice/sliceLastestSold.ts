import { createSlice } from "@reduxjs/toolkit";

export interface ILatestSold {
  tokenId: number;
  lastSalePrice: number;
  lastSaleBuyer: string;
  lastSaleSeller: string;
  lastSaleTimestamp: number;
  lastSaleType: string;
  totalSales: number;
}
export interface IListSold {
  latestSold: ILatestSold[];
}
const initialState: IListSold = {
  latestSold: [],
};

const latestSoldData = createSlice({
  name: "latestSoldData",
  initialState,
  reducers: {
    setLatestSoldData: (state, action) => {
      state.latestSold = action.payload.nftstats_collection;
    },
  },
});
export const { setLatestSoldData } = latestSoldData.actions;
export default latestSoldData.reducer;
