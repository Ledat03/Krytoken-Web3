import { createSlice } from "@reduxjs/toolkit";

interface IOrderMatched {
  tokenTransfer: string;
  tokenId: number;
  seller: string;
  price: BigInt;
  orderId: number;
  buyer: string;
  blockTimestamp: number;
}
export interface IListOrderMatched {
  orderMatcheds: IOrderMatched[];
}

const initialState: IListOrderMatched = { orderMatcheds: [] };

const orderMatched = createSlice({
  name: "ListOrderMatched",
  initialState,
  reducers: {
    fillListMatched: (state, action) => {
      if (action) {
        state.orderMatcheds = action.payload?.orderAddeds;
      }
    },
  },
});
export const { fillListMatched } = orderMatched.actions;
export default orderMatched.reducer;
