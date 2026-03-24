import { createSlice } from "@reduxjs/toolkit";

export interface IOrderAdded {
  tokenId: number;
  isListing: boolean;
  price: BigInt;
  orderId: number;
  owner: string;
}

export interface IListOrder {
  listings: IOrderAdded[];
}

const initialState: IListOrder = { listings: [] };

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
