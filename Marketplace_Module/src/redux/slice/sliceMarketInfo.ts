import { createSlice } from "@reduxjs/toolkit";

interface IMarket {
  feeRate: number;
  feeByDecimal: number;
}
export interface IMarketFeeRate {
  feeUpdateds: IMarket[];
}

const initialState: IMarketFeeRate = { feeUpdateds: [] };
const MarketInfo = createSlice({
  name: "MarketInformation",
  initialState,
  reducers: {
    fetchMarketInfo: (state, action) => {
      state.feeUpdateds = action.payload.feeUpdateds;
    },
  },
});
export default MarketInfo.reducer;
export const { fetchMarketInfo } = MarketInfo.actions;
