import { createSlice } from "@reduxjs/toolkit";

export interface IOrderAdded {
  tokenId: number;
  status: string;
  soldAt: BigInt;
  seller: string;
  price: BigInt;
  orderId: number;
  buyer: string;
}
export interface IListOrderAdded {
  listings: IOrderAdded[];
}

const initialState: IListOrderAdded = { listings: [] };

const orderAdded = createSlice({
  name: "ListOrderAdded",
  initialState,
  reducers: {
    fillListOrder: (state, action) => {
      state.listings = action.payload?.listings;
    },
  },
});
export const { fillListOrder } = orderAdded.actions;
export default orderAdded.reducer;
